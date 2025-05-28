
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X, Tag } from "lucide-react";

interface TagsManagerProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsManager = ({ selectedTags, onTagsChange }: TagsManagerProps) => {
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all tags
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tags").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });

  // Create new tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const { data, error } = await supabase
        .from("tags")
        .insert({ name, slug })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      onTagsChange([...selectedTags, newTag.id]);
      setNewTagName("");
      toast({
        title: "Tag created",
        description: `"${newTag.name}" has been created and added.`,
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
    
    // Check if tag already exists
    const existingTag = tags?.find(tag => 
      tag.name.toLowerCase() === newTagName.trim().toLowerCase()
    );
    
    if (existingTag) {
      if (!selectedTags.includes(existingTag.id)) {
        onTagsChange([...selectedTags, existingTag.id]);
      }
      setNewTagName("");
      return;
    }

    createTagMutation.mutate(newTagName.trim());
  };

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTag();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag size={20} />
          Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Tags:</p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tagId => {
                const tag = tags?.find(t => t.id === tagId);
                return tag ? (
                  <Badge key={tagId} variant="default" className="flex items-center gap-1">
                    {tag.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto w-auto p-0 ml-1"
                      onClick={() => handleRemoveTag(tagId)}
                    >
                      <X size={12} />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Add New Tag */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Add New Tag:</p>
          <div className="flex gap-2">
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter tag name..."
              className="flex-1"
            />
            <Button 
              onClick={handleCreateTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
              size="sm"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Available Tags */}
        {tags && tags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Available Tags:</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {tags.map(tag => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => handleToggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TagsManager;
