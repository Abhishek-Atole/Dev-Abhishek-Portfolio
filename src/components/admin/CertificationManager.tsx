
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Award, ExternalLink, Edit, Trash2, 
  Calendar, Building, Link as LinkIcon, ArrowLeft 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CertificateForm from "./CertificateForm";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  verification_link?: string;
  issue_date?: string;
  description?: string;
  image_url?: string;
  certificate_id?: string;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
}

const CertificationManager = () => {
  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">("list");
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch certificates with proper typing
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
    mutationFn: async (certData: any) => {
      const { data, error } = await supabase
        .from("certificates")
        .insert({
          title: certData.title,
          issuer: certData.issuer,
          verification_link: certData.verification_link || null,
          issue_date: certData.issue_date || null,
          description: certData.description || null,
          image_url: certData.image_url || null,
          certificate_id: certData.certificate_id || null,
          expiration_date: certData.expiration_date || null
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-home"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-all"] });
      setCurrentView("list");
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
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from("certificates")
        .update({
          title: data.title,
          issuer: data.issuer,
          verification_link: data.verification_link || null,
          issue_date: data.issue_date || null,
          description: data.description || null,
          image_url: data.image_url || null,
          certificate_id: data.certificate_id || null,
          expiration_date: data.expiration_date || null
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-home"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-all"] });
      setCurrentView("list");
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
      queryClient.invalidateQueries({ queryKey: ["certificates-home"] });
      queryClient.invalidateQueries({ queryKey: ["certificates-all"] });
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

  const handleEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setCurrentView("edit");
  };

  const handleFormSubmit = (formData: any) => {
    if (currentView === "edit" && editingCert) {
      updateCertMutation.mutate({ id: editingCert.id, data: formData });
    } else {
      createCertMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setCurrentView("list");
    setEditingCert(null);
  };

  if (currentView === "add") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to List
          </Button>
          <h2 className="text-2xl font-bold">Add New Certificate</h2>
        </div>
        <CertificateForm
          onSubmit={handleFormSubmit}
          isLoading={createCertMutation.isPending}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  if (currentView === "edit" && editingCert) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to List
          </Button>
          <h2 className="text-2xl font-bold">Edit Certificate</h2>
        </div>
        <CertificateForm
          onSubmit={handleFormSubmit}
          isLoading={updateCertMutation.isPending}
          initialData={editingCert}
          onCancel={handleCancel}
        />
      </div>
    );
  }

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
          <Button
            onClick={() => setCurrentView("add")}
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            Add Certificate
          </Button>
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

                    {cert.certificate_id && (
                      <p className="text-xs text-muted-foreground mb-2">
                        ID: {cert.certificate_id}
                      </p>
                    )}

                    {cert.image_url && (
                      <div className="mb-3">
                        <img 
                          src={cert.image_url} 
                          alt={`${cert.title} certificate`}
                          className="w-32 h-24 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{cert.issuer}</Badge>
                      {cert.verification_link && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <LinkIcon size={12} />
                          Verified
                        </Badge>
                      )}
                      {cert.expiration_date && (
                        <Badge variant="outline" className="text-xs">
                          Expires: {new Date(cert.expiration_date).toLocaleDateString()}
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
      </CardContent>
    </Card>
  );
};

export default CertificationManager;
