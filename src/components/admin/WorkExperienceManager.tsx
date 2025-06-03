
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Save, X, Building2 } from "lucide-react";

type WorkExperience = {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  duration: string;
  timeframe: string;
  description: string[];
  skills: string[];
  status: "draft" | "published";
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

const WorkExperienceManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    type: "Internship",
    location: "",
    duration: "",
    timeframe: "",
    description: "",
    skills: "",
    status: "draft" as "draft" | "published",
    display_order: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch work experiences
  const { data: workExperiences, isLoading } = useQuery({
    queryKey: ["work-experiences"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("work_experiences")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as WorkExperience[];
    }
  });

  // Create work experience mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<WorkExperience, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("work_experiences").insert([{
        ...data,
        description: data.description.filter(d => d.trim()),
        skills: data.skills.filter(s => s.trim())
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
      setIsCreating(false);
      resetForm();
      toast({ title: "Work experience created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create work experience", variant: "destructive" });
    }
  });

  // Update work experience mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WorkExperience> }) => {
      const { error } = await supabase
        .from("work_experiences")
        .update({
          ...data,
          description: data.description?.filter(d => d.trim()),
          skills: data.skills?.filter(s => s.trim())
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
      setEditingId(null);
      resetForm();
      toast({ title: "Work experience updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update work experience", variant: "destructive" });
    }
  });

  // Delete work experience mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("work_experiences").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
      toast({ title: "Work experience deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete work experience", variant: "destructive" });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      type: "Internship",
      location: "",
      duration: "",
      timeframe: "",
      description: "",
      skills: "",
      status: "draft",
      display_order: 0
    });
  };

  const handleEdit = (experience: WorkExperience) => {
    setEditingId(experience.id);
    setFormData({
      title: experience.title,
      company: experience.company,
      type: experience.type,
      location: experience.location,
      duration: experience.duration,
      timeframe: experience.timeframe,
      description: experience.description.join("\n"),
      skills: experience.skills.join(", "),
      status: experience.status,
      display_order: experience.display_order || 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const experienceData = {
      ...formData,
      description: formData.description.split("\n").filter(d => d.trim()),
      skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: experienceData });
    } else {
      createMutation.mutate(experienceData);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  if (isLoading) {
    return <div>Loading work experiences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Work Experience Management</h2>
          <p className="text-muted-foreground">Manage your work experiences and internships</p>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Work Experience
          </Button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 size={20} />
              {editingId ? "Edit Work Experience" : "Add New Work Experience"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Update the work experience details" : "Fill in the details for your work experience"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Software Engineering Intern"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g., Google Inc."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Job Simulation">Job Simulation</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., San Francisco, CA · Remote"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="e.g., 3 mos"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., Jan 2024 – Mar 2024"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (one bullet point per line)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Developed features using React and TypeScript&#10;Collaborated with cross-functional teams&#10;Improved application performance by 20%"
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save size={16} className="mr-2" />
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Work Experiences List */}
      <div className="grid gap-4">
        {workExperiences?.map((experience) => (
          <Card key={experience.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{experience.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {experience.company} · {experience.type} · {experience.location}
                  </CardDescription>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={experience.status === "published" ? "default" : "secondary"}>
                      {experience.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {experience.duration} · {experience.timeframe}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(experience)}
                    disabled={editingId === experience.id}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(experience.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {experience.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {experience.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {workExperiences?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Work Experiences Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start building your professional portfolio by adding your work experiences and internships.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Add Your First Work Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkExperienceManager;
