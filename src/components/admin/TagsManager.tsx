
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

const TagsManager = () => {
  const [newTagName, setNewTagName] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tags
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Tag[];
    }
  });

  // Fetch tag usage statistics
  const { data: tagUsage = [] } = useQuery({
    queryKey: ["tag-usage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_blog_post_tags")
        .select(`
          tag_id,
          tags!inner(name)
        `);
      
      if (error) throw error;
      
      // Count usage for each tag
      const usageMap = data.reduce((acc: Record<string, number>, item) => {
        acc[item.tag_id] = (acc[item.tag_id] || 0) + 1;
        return acc;
      }, {});
      
      return usageMap;
    }
  });

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from("tags")
        .insert([{ name, slug }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      setNewTagName("");
      toast({
        title: "Success",
        description: "Tag created successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const { data, error } = await supabase
        .from("tags")
        .update({ name, slug })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      setEditingTag(null);
      toast({
        title: "Success",
        description: "Tag updated successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      // First, remove all associations
      await supabase
        .from("admin_blog_post_tags")
        .delete()
        .eq("tag_id", id);
      
      // Then delete the tag
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag-usage"] });
      toast({
        title: "Success",
        description: "Tag deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    createTagMutation.mutate(newTagName.trim());
  };

  const handleUpdateTag = () => {
    if (!editingTag || !editingTag.name.trim()) return;
    updateTagMutation.mutate({ id: editingTag.id, name: editingTag.name.trim() });
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm("Are you sure you want to delete this tag? This will remove it from all associated blog posts.")) {
      deleteTagMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create new tag */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Add New Tag
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
            />
            <Button 
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
            >
              {createTagMutation.isPending ? "Creating..." : "Create Tag"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tags list */}
      <Card>
        <CardHeader>
          <CardTitle>All Tags ({tags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 border rounded">
                {editingTag?.id === tag.id ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag()}
                    />
                    <Button 
                      size="sm" 
                      onClick={handleUpdateTag}
                      disabled={updateTagMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingTag(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{tag.name}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Used in {tagUsage[tag.id] || 0} posts
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingTag(tag)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={deleteTagMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {tags.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tags found. Create your first tag above.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsManager;
