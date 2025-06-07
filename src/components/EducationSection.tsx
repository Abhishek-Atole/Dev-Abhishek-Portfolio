
import { GraduationCap, Calendar, MapPin, Trophy, BookOpen, Star, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const educationData = [
  {
    institution: "Shri Sant Gajanan Maharaj College of Engineering",
    location: "Shegaon",
    degree: "B.E. in Electronics & Telecommunication",
    duration: "2020–2024",
    description: "Specialized in electronics & telecommunication engineering while focusing on programming and systems development.",
    achievements: [
      "Programming Excellence", 
      "System Architecture", 
      "Technical Innovation",
      "Google Developer Program (2x participant)",
      "C/C++ Programming Proficiency",
      "Project Development & Implementation"
    ],
    grade: "CGPA: 6.79/10",
    displayGrade: "6.79/10",
    icon: <GraduationCap className="text-primary" size={24} />,
    specialHighlight: "Google Developer Program"
  },
  {
    institution: "The New Era High School",
    location: "Jalgaon Jamod",
    degree: "12th, General Science",
    duration: "2019–2020",
    description: "Completed higher secondary education with focus on science subjects including Physics, Chemistry, and Mathematics.",
    achievements: [
      "Science Excellence", 
      "Mathematics Proficiency", 
      "Academic Merit",
      "Strong Foundation in PCM"
    ],
    grade: "Percentage: 66.62%",
    displayGrade: "66.62%",
    icon: <BookOpen className="text-accent" size={24} />
  },
  {
    institution: "The New Era High School",
    location: "Jalgaon Jamod",
    degree: "10th Standard",
    duration: "2017–2018",
    description: "Completed secondary education with strong academic performance and secured prestigious NMMS scholarship for higher studies.",
    achievements: [
      "NMMS Scholarship Recipient (8th-12th Standard)",
      "Academic Excellence",
      "Strong Foundation Building",
      "Merit-based Recognition"
    ],
    grade: "Percentage: 83.20%",
    displayGrade: "83.20%",
    icon: <Award className="text-green-600" size={24} />,
    specialHighlight: "NMMS Scholar"
  }
];

const EducationSection = () => {
  return (
    <section id="education" className="py-20 bg-gradient-to-br from-background via-background/95 to-muted/5 relative overflow-hidden group">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/8 transition-all duration-1000" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/8 transition-all duration-1000" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-primary/20 rotate-45 animate-float group-hover:bg-primary/30 transition-colors duration-500" />
        <div className="absolute top-60 right-20 w-4 h-4 bg-accent/20 rounded-full animate-float group-hover:bg-accent/30 transition-colors duration-500" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-primary/25 rotate-45 animate-float group-hover:bg-primary/35 transition-colors duration-500" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 
            border border-primary/20 rounded-full px-6 py-3 backdrop-blur-sm hover:border-primary/40 
            hover:bg-gradient-to-r hover:from-primary/15 hover:to-accent/15 transition-all duration-300">
            <Trophy className="text-primary" size={20} />
            <span className="font-mono text-sm font-medium text-foreground/80">Academic Journey</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Education
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A comprehensive academic journey from secondary education through engineering, marked by consistent excellence and recognition.
          </p>
        </div>
        
        {/* Education Timeline */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {educationData.map((item, index) => (
            <Card 
              key={index} 
              className="group/card border-l-4 border-l-primary hover:border-l-accent
                bg-gradient-to-r from-card/80 to-muted/20 backdrop-blur-sm
                hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02] 
                transition-all duration-500 hover:bg-gradient-to-r hover:from-card/90 hover:to-muted/30
                cursor-pointer overflow-hidden relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover/card:opacity-100 transition-all duration-500" />
              
              {/* Special Highlight Badge */}
              {item.specialHighlight && (
                <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/card:translate-y-0">
                  <div className="bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-md 
                    px-3 py-1.5 rounded-full border border-primary/30 flex items-center gap-2">
                    <Star className="text-primary" size={14} />
                    <span className="text-xs font-semibold text-primary">{item.specialHighlight}</span>
                  </div>
                </div>
              )}

              <CardHeader className="relative z-10">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-4 text-xl lg:text-2xl group-hover/card:text-primary transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 
                      group-hover/card:border-primary/40 group-hover/card:bg-gradient-to-r group-hover/card:from-primary/20 group-hover/card:to-accent/20 
                      transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="group-hover/card:translate-x-1 transition-transform duration-300">
                      {item.institution}
                    </span>
                  </div>
                </CardTitle>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mt-4">
                  <div className="flex items-center gap-2 group-hover/card:text-primary transition-colors duration-300">
                    <Calendar size={16} className="group-hover/card:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 group-hover/card:text-accent transition-colors duration-300">
                    <MapPin size={16} className="group-hover/card:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 group-hover/card:text-green-600 transition-colors duration-300">
                    <Trophy size={16} className="group-hover/card:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.displayGrade}</span>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-accent/10 
                      border border-primary/20 rounded-full px-3 py-1 backdrop-blur-sm
                      group-hover/card:border-primary/40 group-hover/card:bg-gradient-to-r group-hover/card:from-primary/20 group-hover/card:to-accent/20 
                      transition-all duration-300">
                      <span className="text-xs font-mono font-semibold">{item.grade}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                {/* Degree Title */}
                <h3 className="font-bold text-xl lg:text-2xl mb-4 text-foreground group-hover/card:text-primary transition-colors duration-300">
                  {item.degree}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed group-hover/card:text-foreground/80 transition-colors duration-300">
                  {item.description}
                </p>
                
                {/* Achievements */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-primary uppercase tracking-wide">Key Achievements</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.achievements.map((achievement, achievementIndex) => (
                      <div 
                        key={achievementIndex}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 
                          border border-border/50 rounded-lg px-3 py-2 text-sm font-medium
                          hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
                          hover:scale-105 transition-all duration-300 cursor-pointer"
                        style={{ animationDelay: `${achievementIndex * 100}ms` }}
                      >
                        <Star size={14} className="text-primary flex-shrink-0" />
                        <span className="text-xs lg:text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary 
                scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left" />
            </Card>
          ))}
        </div>

        {/* Timeline Connector */}
        <div className="absolute left-1/2 top-32 bottom-32 w-0.5 bg-gradient-to-b from-primary/20 via-accent/20 to-primary/20 
          transform -translate-x-1/2 hidden lg:block opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Timeline Dots */}
        {educationData.map((_, index) => (
          <div 
            key={index}
            className="absolute left-1/2 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full 
              transform -translate-x-1/2 border-4 border-background shadow-lg hidden lg:block
              hover:scale-125 transition-transform duration-300"
            style={{ 
              top: `${30 + (index * 20)}%`,
            }}
          />
        ))}

        {/* Call to Action for Notes */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-muted/20 to-muted/10 
            backdrop-blur-sm border border-border/30 rounded-full px-6 py-3
            hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
            transition-all duration-300 cursor-pointer group/cta">
            <BookOpen className="text-primary group-hover/cta:scale-110 transition-transform duration-300" size={20} />
            <span className="font-mono text-sm text-muted-foreground group-hover/cta:text-foreground transition-colors duration-300">
              Study Notes & Resources - Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
