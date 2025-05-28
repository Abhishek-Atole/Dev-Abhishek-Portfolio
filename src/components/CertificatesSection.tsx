
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
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Award className="h-10 w-10 text-primary animate-pulse" />
            Featured Certifications
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Professional certifications and achievements that demonstrate my commitment to continuous learning and expertise in various technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {certificates.map((cert, index) => (
            <Card 
              key={cert.id} 
              className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-gradient-to-br from-background to-muted/50 overflow-hidden relative"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {cert.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <Building size={16} className="text-primary" />
                      <span className="font-medium">{cert.issuer}</span>
                    </div>
                  </div>
                  
                  {cert.verification_link && (
                    <div className="shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                        <ExternalLink size={16} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-4">
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

                  {cert.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors duration-300">
                      {cert.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <Badge 
                      variant="secondary" 
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 font-medium"
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

                  {/* Certificate Action Button */}
                  <div className="pt-2">
                    {cert.verification_link ? (
                      <Button 
                        asChild 
                        className="w-full group-hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-primary/25"
                      >
                        <a 
                          href={cert.verification_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`View ${cert.title} certificate`}
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View Certificate
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        disabled 
                        variant="outline" 
                        className="w-full opacity-60 cursor-not-allowed"
                      >
                        Link Not Provided
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Certificate number indicator */}
              <div className="absolute top-4 right-4 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {index + 1}
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="group relative overflow-hidden border-2 hover:border-primary px-8 py-3 text-lg font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Link to="/certificates">
              <span className="relative z-10 flex items-center gap-3">
                View All Certificates
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </Button>
        </div>

        {/* Certificates Count Badge */}
        {certificates.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-6 py-2 text-sm font-medium text-primary">
              <Award size={16} />
              {certificates.length} Professional Certifications Earned
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificatesSection;
