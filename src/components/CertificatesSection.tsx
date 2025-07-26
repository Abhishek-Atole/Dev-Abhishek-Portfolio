
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ExternalLink, Calendar, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const CertificatesSection = () => {
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

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Certifications</h2>
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Certifications</h2>
            <p className="text-muted-foreground">No certificates available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Award className="h-8 w-8 lg:h-10 lg:w-10 text-primary animate-pulse" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Featured Certifications
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-base lg:text-lg leading-relaxed">
            Professional certifications and achievements that demonstrate my commitment to continuous learning and expertise in various technologies.
          </p>
          
          {/* Enhanced decorative line */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent w-20"></div>
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent w-20"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 mb-12">
          {certificates.map((cert, index) => (
            <Card 
              key={cert.id} 
              className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-3 border-2 hover:border-primary/50 bg-gradient-to-br from-background to-muted/50 overflow-hidden relative h-full flex flex-col"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-lg lg:text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                      {cert.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <Building size={16} className="text-primary shrink-0" />
                      <span className="font-medium line-clamp-1">{cert.issuer}</span>
                    </div>
                  </div>
                  
                  {cert.verification_link && (
                    <div className="shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <ExternalLink size={18} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>

                {cert.issue_date && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} className="text-primary shrink-0" />
                    <span className="line-clamp-1">{new Date(cert.issue_date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="relative z-10 flex-1 flex flex-col pt-0">
                {/* Content area that expands to fill available space */}
                <div className="flex-1 flex flex-col justify-between min-h-0">
                  <div className="space-y-4">
                    {cert.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors duration-300">
                        {cert.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <Badge 
                        variant="secondary" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-medium text-xs"
                      >
                        {cert.issuer}
                      </Badge>
                      {cert.verification_link && (
                        <Badge 
                          variant="outline" 
                          className="text-xs flex items-center gap-1 group-hover:border-primary group-hover:text-primary transition-all duration-300"
                        >
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Certificate Action Button - Fixed at bottom with consistent spacing */}
                  <div className="pt-6 mt-auto">
                    {cert.verification_link ? (
                      <Button 
                        asChild 
                        className="w-full group-hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25 h-10"
                        size="sm"
                      >
                        <a 
                          href={cert.verification_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`View ${cert.title} certificate`}
                          className="flex items-center justify-center"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View Certificate
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full opacity-60 cursor-not-allowed h-10"
                        size="sm"
                      >
                        <span className="flex items-center justify-center">
                          Link Not Provided
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Certificate number indicator */}
              <div className="absolute top-4 right-4 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 z-20">
                {String(index + 1).padStart(2, '0')}
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center">
          <Link to="/certificates">
            <Button 
              variant="outline" 
              size="lg"
              className="group relative overflow-hidden border-2 hover:border-primary px-8 py-3 text-base lg:text-lg font-semibold hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 bg-background/50 backdrop-blur-sm"
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              
              {/* Content with proper z-index */}
              <span className="relative z-10 flex items-center gap-3">
                View All Certificates
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Certificates Count Badge - Enhanced */}
        {certificates.length > 0 && (
          <div className="text-center mt-8 lg:mt-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-full px-6 py-3 text-sm lg:text-base font-medium text-primary border border-primary/20 backdrop-blur-sm">
              <Award size={18} className="animate-pulse" />
              <span className="font-semibold">{certificates.length}</span>
              <span>Professional Certifications Earned</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;
