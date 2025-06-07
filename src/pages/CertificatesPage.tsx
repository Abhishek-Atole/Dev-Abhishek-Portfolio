import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Building, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const CertificatesPage = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issue_date", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as Certificate[];
    }
  });

  useEffect(() => {
    document.title = "Certifications | Abhishek Atole";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Professional certifications and achievements of Abhishek Atole in C++, Java, cybersecurity, and other technologies.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              Professional Certifications
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base sm:text-lg">
              A comprehensive collection of my professional certifications and achievements, 
              demonstrating continuous learning and expertise in various technologies.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading certificates...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!certificates || certificates.length === 0) && (
            <div className="text-center py-12">
              <Award size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Certificates Found</h3>
              <p className="text-muted-foreground">Check back later for updates on professional certifications.</p>
            </div>
          )}

          {/* Certificates Grid */}
          {certificates && certificates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {certificates.map((cert) => (
                <Card key={cert.id} className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {cert.title}
                      </CardTitle>
                      {cert.verification_link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 shrink-0 hover:bg-primary/10"
                        >
                          <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Certificate Image */}
                    {cert.image_url && (
                      <div className="relative group/image">
                        <div 
                          className="aspect-video rounded-lg overflow-hidden bg-muted border cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => setSelectedImage(cert.image_url!)}
                        >
                          <img 
                            src={cert.image_url} 
                            alt={`${cert.title} certificate`}
                            className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
                          <ImageIcon className="text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" size={24} />
                        </div>
                      </div>
                    )}

                    {/* Certificate Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building size={14} className="text-primary" />
                        <span className="font-medium">{cert.issuer}</span>
                      </div>
                      
                      {cert.issue_date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar size={14} className="text-primary" />
                          <span>{new Date(cert.issue_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      )}

                      {cert.certificate_id && (
                        <div className="text-xs font-mono text-muted-foreground bg-muted/50 p-2 rounded">
                          ID: {cert.certificate_id}
                        </div>
                      )}

                      {/* Description */}
                      {cert.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {cert.description}
                        </p>
                      )}

                      {/* Badges */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {cert.issuer}
                          </Badge>
                          {cert.verification_link && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <LinkIcon size={10} />
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

                      {/* Action Button */}
                      {cert.verification_link && (
                        <Button 
                          asChild 
                          className="w-full mt-4 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300"
                        >
                          <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} className="mr-2" />
                            View Certificate
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {certificates && certificates.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold text-primary">{certificates.length}</div>
                    <div className="text-sm sm:text-base text-muted-foreground">Total Certificates</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold text-primary">
                      {new Set(certificates.map(cert => cert.issuer)).size}
                    </div>
                    <div className="text-sm sm:text-base text-muted-foreground">Issuing Organizations</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl sm:text-4xl font-bold text-primary">
                      {certificates.filter(cert => cert.verification_link).length}
                    </div>
                    <div className="text-sm sm:text-base text-muted-foreground">Verified Certificates</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Certificate Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Certificate Image</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-0">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Certificate"
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificatesPage;
