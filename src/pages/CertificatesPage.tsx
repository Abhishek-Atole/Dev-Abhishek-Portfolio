
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Building, Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";

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

const CertificatesPage = () => {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issue_date", { ascending: false });
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
      
      <main className="pt-24 pb-12">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Award className="h-10 w-10 text-primary" />
              Professional Certifications
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <Card key={cert.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-lg leading-tight">{cert.title}</CardTitle>
                      {cert.verification_link && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0 shrink-0"
                        >
                          <a href={cert.verification_link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Certificate Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building size={14} />
                          <span className="font-medium">{cert.issuer}</span>
                        </div>
                        
                        {cert.issue_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar size={14} />
                            <span>{new Date(cert.issue_date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {cert.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {cert.description}
                        </p>
                      )}

                      {/* Certificate Image */}
                      {cert.image_url && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={cert.image_url} 
                            alt={`${cert.title} certificate`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {cert.issuer}
                        </Badge>
                        {cert.verification_link && (
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <LinkIcon size={10} />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Action Button */}
                      {cert.verification_link && (
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
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
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-6 bg-muted/50 rounded-lg px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{certificates.length}</div>
                  <div className="text-sm text-muted-foreground">Total Certificates</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {new Set(certificates.map(cert => cert.issuer)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Issuing Organizations</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {certificates.filter(cert => cert.verification_link).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Verified Certificates</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CertificatesPage;
