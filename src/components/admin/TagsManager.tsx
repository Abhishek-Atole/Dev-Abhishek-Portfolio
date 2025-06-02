import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const TagsManager = () => {
  const [tags, setTags] = useState<{ id: string; name: string; count: number }[]>([]);
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tags and usage count
  const fetchTags = async () => {
    setLoading(true);
    // Get all tags
    const { data: tagData } = await supabase.from("tags").select("*");
    // Get tag usage counts from blog posts
    const { data: posts } = await supabase.from("admin_blog_posts").select("tags");
    const tagCounts: Record<string, number> = {};
    (posts || []).forEach(post => {
      (typeof post.tags === "string" ? post.tags.split(",") : post.tags || []).forEach(tag => {
        const t = tag.trim();
        if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });
    setTags(
      (tagData || []).map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        count: tagCounts[tag.name] || 0,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // Add tag
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    await supabase.from("tags").insert([{ name: newTag.trim() }]);
    setNewTag("");
    fetchTags();
  };

  // Delete tag
  const handleDeleteTag = async (id: string) => {
    await supabase.from("tags").delete().eq("id", id);
    fetchTags();
  };

  // Edit tag
  const handleEditTag = async (id: string) => {
    if (!editValue.trim()) return;
    await supabase.from("tags").update({ name: editValue.trim() }).eq("id", id);
    setEditingTag(null);
    setEditValue("");
    fetchTags();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          className="border border-border bg-muted text-foreground placeholder:text-muted-foreground px-2 py-1 rounded"
          placeholder="New tag name"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
        />
        <Button onClick={handleAddTag} disabled={loading || !newTag.trim()}>
          Add Tag
        </Button>
      </div>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Tag</th>
                <th className="p-2 text-left">Used</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map(tag => (
                <tr key={tag.id} className="border-t">
                  <td className="p-2">
                    {editingTag === tag.id ? (
                      <input
                        className="border px-2 py-1 rounded"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td className="p-2">{tag.count}</td>
                  <td className="p-2 flex gap-2">
                    {editingTag === tag.id ? (
                      <>
                        <Button size="sm" onClick={() => handleEditTag(tag.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingTag(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => { setEditingTag(tag.id); setEditValue(tag.name); }}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteTag(tag.id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TagsManager;
