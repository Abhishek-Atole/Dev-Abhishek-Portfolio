
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, Terminal, Cpu, Globe, Wrench } from "lucide-react";

type SkillCategory = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  skills: {
    name: string;
    level: number; // 0-100
  }[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    icon: Code2,
    skills: [
      { name: "C++14/17/20", level: 95 },
      { name: "Java", level: 85 },
      { name: "C", level: 80 },
      { name: "Python", level: 75 },
      { name: "SQL", level: 70 },
    ],
  },
  {
    name: "Development Tools",
    icon: Wrench,
    skills: [
      { name: "STL", level: 90 },
      { name: "Qt6", level: 85 },
      { name: "CGAL", level: 80 },
      { name: "Git", level: 90 },
      { name: "CMake", level: 85 },
    ],
  },
  {
    name: "Operating Systems",
    icon: Terminal,
    skills: [
      { name: "Linux (Ubuntu)", level: 90 },
      { name: "Linux (Kali)", level: 80 },
      { name: "Linux (Arch)", level: 75 },
      { name: "Windows", level: 85 },
    ],
  },
  {
    name: "Core Concepts",
    icon: Cpu,
    skills: [
      { name: "File Systems", level: 90 },
      { name: "Memory Management", level: 85 },
      { name: "OOP", level: 90 },
      { name: "Modular Design", level: 85 },
    ],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-mono">
            Technical Expertise
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive technical skills across multiple domains, with deep expertise in 
            modern C++ development and system-level programming.
          </p>
        </div>
        
        {/* Skills Grid with Enhanced Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {skillCategories.map((category, idx) => {
            const IconComponent = category.icon;
            return (
              <Card key={idx} className="group bg-card/50 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {category.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm font-medium">{skill.name}</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {skill.level}%
                        </Badge>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={skill.level} 
                          className="h-2 bg-muted/50" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Enhanced Expertise Section */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Areas of Specialization
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Deep expertise in cutting-edge technologies and methodologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: "Modern C++ Development",
                description: "Advanced C++14/17/20 applications with focus on performance optimization, RAII, and clean architecture patterns.",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Cpu,
                title: "System Programming",
                description: "Low-level system interfaces, file systems, memory management, and kernel-level programming expertise.",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Database,
                title: "Data Structures & Algorithms",
                description: "Implementation of efficient, reusable data structures with optimal time and space complexity analysis.",
                gradient: "from-green-500/20 to-emerald-500/20"
              },
              {
                icon: Globe,
                title: "Cross-Platform Development",
                description: "Qt6-based desktop applications with seamless deployment across Windows, Linux, and macOS platforms.",
                gradient: "from-orange-500/20 to-red-500/20"
              },
              {
                icon: Terminal,
                title: "Linux Ecosystem",
                description: "Advanced Linux system administration, shell scripting, and development environment optimization.",
                gradient: "from-yellow-500/20 to-orange-500/20"
              },
              {
                icon: Wrench,
                title: "Software Architecture",
                description: "Designing maintainable, modular, and scalable software systems with emphasis on clean code principles.",
                gradient: "from-indigo-500/20 to-blue-500/20"
              }
            ].map((expertise, idx) => {
              const IconComponent = expertise.icon;
              return (
                <Card key={idx} className="group relative overflow-hidden bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${expertise.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardContent className="relative p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-mono text-lg font-bold text-primary group-hover:text-accent transition-colors duration-300">
                        {expertise.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                      {expertise.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Technology Stack Visualization */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-muted/20 to-muted/10 backdrop-blur-sm border border-border/30 rounded-full px-8 py-4">
            <span className="font-mono text-sm text-muted-foreground">Tech Stack:</span>
            <div className="flex items-center gap-2">
              {["C++", "Java", "Linux", "Git", "Qt6", "STL"].map((tech, idx) => (
                <Badge key={idx} variant="outline" className="font-mono text-xs hover:bg-primary/10 transition-colors duration-200">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
