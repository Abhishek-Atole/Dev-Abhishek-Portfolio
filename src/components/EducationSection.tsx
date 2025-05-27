
import { GraduationCap, Calendar, MapPin, Award, BookOpen, Users, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const educationData = [
  {
    institution: "Shri Sant Gajanan Maharaj College of Engineering",
    location: "Shegaon",
    degree: "B.E. in Electronics & Telecommunication",
    duration: "2020–2024",
    description: "Specialized in electronics & telecommunication engineering while focusing on programming and systems development.",
    highlights: [
      "Advanced C++ Programming & Data Structures",
      "System Design & Architecture",
      "Digital Signal Processing",
      "Embedded Systems Development"
    ],
    gpa: "8.2/10.0",
    type: "undergraduate"
  },
  {
    institution: "The New Era High School",
    location: "Jalgaon Jamod",
    degree: "12th, General Science",
    duration: "2019–2020",
    description: "Completed higher secondary education with focus on science subjects including Physics, Chemistry, and Mathematics.",
    highlights: [
      "Mathematics - Advanced Calculus & Statistics",
      "Physics - Mechanics & Electromagnetic Theory", 
      "Chemistry - Organic & Inorganic Chemistry",
      "Computer Science - Programming Fundamentals"
    ],
    gpa: "92.5%",
    type: "secondary"
  }
];

const EducationSection = () => {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-background via-background/98 to-background/95 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 
            border border-primary/20 rounded-full px-6 py-2 backdrop-blur-sm mb-4">
            <GraduationCap className="text-primary" size={20} />
            <span className="font-mono text-sm font-medium text-primary">Academic Journey</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Education
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            My academic foundation in engineering and computer science, building the technical expertise for modern software development.
          </p>
        </div>
        
        <div className="space-y-8 max-w-5xl mx-auto">
          {educationData.map((item, index) => (
            <Card 
              key={index} 
              className="group border-l-4 border-l-primary bg-card/50 backdrop-blur-sm hover:bg-card/80 
                transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10
                hover:border-l-accent relative overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="flex items-start gap-3 text-2xl lg:text-3xl mb-3 group-hover:text-primary transition-colors duration-300">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        {item.type === 'undergraduate' ? (
                          <GraduationCap className="text-primary" size={28} />
                        ) : (
                          <BookOpen className="text-primary" size={28} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold leading-tight">{item.institution}</div>
                        <div className="text-lg font-semibold text-primary mt-1">{item.degree}</div>
                      </div>
                    </CardTitle>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <span className="font-mono font-medium">{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-accent" />
                        <span className="font-mono font-medium">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-primary" />
                        <span className="font-mono font-bold text-primary">{item.gpa}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Institution Type Badge */}
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 
                      border border-primary/20 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Trophy size={14} className="text-primary" />
                      <span className="text-xs font-mono font-semibold text-primary capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-base">{item.description}</p>
                
                {/* Key Highlights */}
                <div>
                  <h4 className="font-mono font-bold text-primary mb-4 flex items-center gap-2">
                    <Users size={16} />
                    Key Areas of Study
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.highlights.map((highlight, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/30 
                          hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 group/item"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full group-hover/item:scale-125 transition-transform duration-300" />
                        <span className="text-sm font-medium text-foreground/90 group-hover/item:text-foreground transition-colors duration-300">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Performance Indicator */}
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-muted-foreground">Academic Performance</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 group-hover:animate-pulse"
                          style={{ 
                            width: item.type === 'undergraduate' ? '82%' : '92%' 
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-primary">{item.gpa}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Education Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-primary" size={24} />
            </div>
            <div className="text-2xl font-bold text-primary mb-2">4 Years</div>
            <div className="text-sm text-muted-foreground font-mono">Engineering Degree</div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/10">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-accent" size={24} />
            </div>
            <div className="text-2xl font-bold text-accent mb-2">50+</div>
            <div className="text-sm text-muted-foreground font-mono">Technical Courses</div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl p-6 text-center hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={24} />
            </div>
            <div className="text-2xl font-bold text-primary mb-2">8.2</div>
            <div className="text-sm text-muted-foreground font-mono">Overall CGPA</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
