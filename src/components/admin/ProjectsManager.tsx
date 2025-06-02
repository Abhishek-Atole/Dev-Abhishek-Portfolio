
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FolderOpen, Github, ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github_url: string;
  demo_url?: string;
  image_url?: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

const ProjectsManager = () => {
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    tags: "",
    github_url: "",
    demo_url: "",
    image_url: "",
    status: "draft" as "draft" | "published"
  });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: typeof newProject) => {
      const tagsArray = projectData.tags.split(",").map(tag => tag.trim()).filter(Boolean);
      const { data, error } = await supabase
        .from("projects")
        .insert({
          title: projectData.title,
          description: projectData.description,
          tags: tagsArray,
          github_url: projectData.github_url,
          demo_url: projectData.demo_url || null,
          image_url: projectData.image_url || null,
          status: projectData.status
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setNewProject({
        title: "",
        description: "",
        tags: "",
        github_url: "",
        demo_url: "",
        image_url: "",
        status: "draft"
      });
      toast({
        title: "Project created",
        description: "The project has been created successfully.",
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

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (project: Project) => {
      const { data, error } = await supabase
        .from("projects")
        .update({
          title: project.title,
          description: project.description,
          tags: project.tags,
          github_url: project.github_url,
          demo_url: project.demo_url || null,
          image_url: project.image_url || null,
          status: project.status,
          updated_at: new Date().toISOString()
        })
        .eq("id", project.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setEditingProject(null);
      toast({
        title: "Project updated",
        description: "The project has been updated successfully.",
      });
    }
  });

  // Delete project mutation
  const deletProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    }
  });

  const handleCreateProject = () => {
    if (!newProject.title.trim() || !newProject.description.trim() || !newProject.github_url.trim()) {
      toast({
        title: "Error",
        description: "Title, description, and GitHub URL are required.",
        variant: "destructive"
      });
      return;
    }
    createProjectMutation.mutate(newProject);
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    updateProjectMutation.mutate(editingProject);
  };

  if (isLoading) {
    return <div className="p-4">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create New Project */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={20} />
            Add New Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({ ...newProject, status: e.target.value as "draft" | "published" })}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">GitHub URL *</label>
              <Input
                value={newProject.github_url}
                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Demo URL</label>
              <Input
                value={newProject.demo_url}
                onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                placeholder="https://demo.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <Input
                value={newProject.tags}
                onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={newProject.image_url}
                onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending}
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </Button>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen size={20} />
            Projects ({projects?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {projects && projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="p-6 border rounded-lg">
                  {editingProject?.id === project.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editingProject.title}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          placeholder="Project title"
                        />
                        <select
                          value={editingProject.status}
                          onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as "draft" | "published" })}
                          className="w-full px-3 py-2 border border-input rounded-md"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                      <Textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        placeholder="Project description"
                        rows={3}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editingProject.github_url}
                          onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                          placeholder="GitHub URL"
                        />
                        <Input
                          value={editingProject.demo_url || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                          placeholder="Demo URL"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          value={editingProject.tags.join(", ")}
                          onChange={(e) => setEditingProject({ 
                            ...editingProject, 
                            tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                          })}
                          placeholder="Tags (comma-separated)"
                        />
                        <Input
                          value={editingProject.image_url || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                          placeholder="Image URL"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUpdateProject}
                          disabled={updateProjectMutation.isPending}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingProject(null)}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-lg">{project.title}</h3>
                            <Badge variant={project.status === "published" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                          
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.tags.map((tag, index) => (
                                <Badge key={index} variant="outline">{tag}</Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-4 text-sm">
                            <a 
                              href={project.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Github size={16} />
                              GitHub
                            </a>
                            {project.demo_url && (
                              <a 
                                href={project.demo_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <ExternalLink size={16} />
                                Demo
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProject(project)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletProjectMutation.mutate(project.id)}
                            disabled={deletProjectMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {project.image_url && (
                        <div className="mt-4">
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No projects found. Create your first project above.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsManager;
