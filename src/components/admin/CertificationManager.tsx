
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, X, Award, ExternalLink, Edit, Trash2, 
  Calendar, Building, Link as LinkIcon 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  verification_link?: string;
  issue_date?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

const CertificationManager = () => {
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    verification_link: "",
    issue_date: "",
    description: "",
    image_url: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch certificates
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data as Certificate[];
    }
  });

  // Create certificate mutation
  const createCertMutation = useMutation({
    mutationFn: async (certData: typeof newCert) => {
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          ...certData,
          issue_date: certData.issue_date || null
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setIsAddingCert(false);
      setNewCert({
        title: "",
        issuer: "",
        verification_link: "",
        issue_date: "",
        description: "",
        image_url: ""
      });
      toast({
        title: "Certificate added",
        description: "The certificate has been successfully added.",
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

  // Update certificate mutation
  const updateCertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Certificate> }) => {
      const { error } = await supabase
        .from("certificates")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      setEditingCert(null);
      toast({
        title: "Certificate updated",
        description: "The certificate has been successfully updated.",
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

  // Delete certificate mutation
  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({
        title: "Certificate deleted",
        description: "The certificate has been successfully deleted.",
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

  // Predefined certificates data
  const predefinedCertificates = [
    {
      title: "C Programming",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/certificates/8cbed9814a163b91f00feac525839739085741dd84c32f2e3e6565c290c2420e?trk=share_certificate",
      issue_date: "2025-03-24",
      description: "Complete Guide to C Programming Foundations"
    },
    {
      title: "Master C++ Programming From Beginner To Advance 2025 Edition",
      issuer: "Udemy",
      verification_link: "https://www.udemy.com/certificate/UC-5f7e3c2a-9296-46a2-af0f-d3e7b7b2ccc1/",
      issue_date: "2025-03-24",
      description: "Comprehensive C++ programming course covering advanced concepts"
    },
    {
      title: "C Programming for Embedded Applications",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/certificates/446728be8710513dd52a7b731e6152e99033d17d30cdd82f2330ccf7a1344b9c?trk=share_certificate",
      issue_date: "2025-03-24",
      description: "Specialized course for embedded systems programming"
    },
    {
      title: "Getting Started with Linux",
      issuer: "LinkedIn Learning",
      verification_link: "https://www.linkedin.com/learning/paths/getting-started-with-linux",
      issue_date: "2025-03-16",
      description: "Learning Path for Linux System Administration"
    },
    {
      title: "Heterogeneous Parallel Programming using CUDA and OpenCL",
      issuer: "AstroMediComp",
      verification_link: "https://astromedicomp.org/Certificate/StudentCertificate.php?cuid=HPP-2025-ILTOCF649M",
      issue_date: "2025-03-16",
      description: "Certificate of Attendance for parallel programming seminar"
    },
    {
      title: "Introduction to Cybersecurity",
      issuer: "Cisco Networking Academy",
      verification_link: "https://www.credly.com/badges/c7ee13ea-2f69-4cae-815e-dd15b6e068ad/public_url",
      issue_date: "2023-12-29",
      description: "Cybersecurity Foundation course through Cisco program"
    }
  ];

  const handleAddPredefinedCertificates = async () => {
    try {
      for (const cert of predefinedCertificates) {
        await createCertMutation.mutateAsync(cert);
      }
      toast({
        title: "Success",
        description: "All predefined certificates have been added.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some certificates. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) {
      toast({
        title: "Validation Error",
        description: "Title and Issuer are required fields.",
        variant: "destructive"
      });
      return;
    }
    createCertMutation.mutate(newCert);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
  };

  const handleUpdate = () => {
    if (!editingCert) return;
    updateCertMutation.mutate({
      id: editingCert.id,
      data: editingCert
    });
  };

  if (isLoading) {
    return <div className="p-4">Loading certificates...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award size={20} />
            Certification Management
          </CardTitle>
          <div className="flex gap-2">
            {(!certificates || certificates.length === 0) && (
              <Button
                onClick={handleAddPredefinedCertificates}
                variant="outline"
                size="sm"
                disabled={createCertMutation.isPending}
              >
                Add Sample Certificates
              </Button>
            )}
            <Dialog open={isAddingCert} onOpenChange={setIsAddingCert}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Certificate</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Certificate Title *</Label>
                      <Input
                        id="title"
                        value={newCert.title}
                        onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                        placeholder="e.g., Master C++ Programming"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="issuer">Issuer *</Label>
                      <Input
                        id="issuer"
                        value={newCert.issuer}
                        onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                        placeholder="e.g., Udemy, LinkedIn Learning"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verification_link">Verification Link</Label>
                      <Input
                        id="verification_link"
                        type="url"
                        value={newCert.verification_link}
                        onChange={(e) => setNewCert({ ...newCert, verification_link: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="issue_date">Issue Date</Label>
                      <Input
                        id="issue_date"
                        type="date"
                        value={newCert.issue_date}
                        onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Certificate Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={newCert.image_url}
                      onChange={(e) => setNewCert({ ...newCert, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCert.description}
                      onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                      placeholder="Brief description of the certificate..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddingCert(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createCertMutation.isPending}>
                      {createCertMutation.isPending ? "Adding..." : "Add Certificate"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!certificates || certificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <p>No certificates added yet. Add your first certificate to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{cert.title}</h3>
                      {cert.verification_link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 px-2"
                        >
                          <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        {cert.issuer}
                      </div>
                      {cert.issue_date && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(cert.issue_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {cert.description && (
                      <p className="text-sm text-muted-foreground mb-2">{cert.description}</p>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{cert.issuer}</Badge>
                      {cert.verification_link && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <LinkIcon size={12} />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cert)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCertMutation.mutate(cert.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      disabled={deleteCertMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingCert} onOpenChange={() => setEditingCert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Certificate</DialogTitle>
            </DialogHeader>
            {editingCert && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Certificate Title</Label>
                    <Input
                      id="edit-title"
                      value={editingCert.title}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-issuer">Issuer</Label>
                    <Input
                      id="edit-issuer"
                      value={editingCert.issuer}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-verification">Verification Link</Label>
                    <Input
                      id="edit-verification"
                      type="url"
                      value={editingCert.verification_link || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, verification_link: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-date">Issue Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editingCert.issue_date || ""}
                      onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-image">Certificate Image URL</Label>
                  <Input
                    id="edit-image"
                    type="url"
                    value={editingCert.image_url || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, image_url: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCert.description || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingCert(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} disabled={updateCertMutation.isPending}>
                    {updateCertMutation.isPending ? "Updating..." : "Update Certificate"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CertificationManager;
