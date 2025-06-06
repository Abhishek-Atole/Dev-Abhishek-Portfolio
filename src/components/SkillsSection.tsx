
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import FadeInSection from "./animations/FadeInSection";

type SkillCategory = {
  name: string;
  skills: {
    name: string;
    level: number; // 0-100
  }[];
};

const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      { name: "C++14/17/20", level: 95 },
      { name: "Java", level: 85 },
      { name: "C", level: 80 },
      { name: "Python", level: 75 },
      { name: "SQL", level: 70 },
    ],
  },
  {
    name: "Tools",
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
    skills: [
      { name: "Linux (Ubuntu)", level: 90 },
      { name: "Linux (Kali)", level: 80 },
      { name: "Linux (Arch)", level: 75 },
      { name: "Windows", level: 85 },
    ],
  },
  {
    name: "Concepts",
    skills: [
      { name: "File Systems", level: 90 },
      { name: "Memory Management", level: 85 },
      { name: "OOP", level: 90 },
      { name: "Modular Design", level: 85 },
    ],
  },
];

const AnimatedProgress = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [progress, setProgress] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useState(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        setProgress(value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  });
  
  return (
    <div ref={ref}>
      <Progress value={isInView ? value : 0} className="h-2 transition-all duration-1000" />
    </div>
  );
};

const SkillsSection = () => {
  const isMobile = useIsMobile();

  return (
    <section id="skills" className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-[5%] w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto relative z-10">
        <FadeInSection direction="up">
          <h2 className="section-heading mb-12 text-center">Skills & Expertise</h2>
        </FadeInSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {skillCategories.map((category, idx) => (
            <FadeInSection key={idx} direction="up" delay={idx * 0.1}>
              <Card className="bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 h-full">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center gap-3">
                    <span className="bg-primary/10 p-2 rounded-lg inline-block">
                      {idx === 0 && <Code size={20} />}
                      {idx === 1 && <Tool size={20} />}
                      {idx === 2 && <Terminal size={20} />}
                      {idx === 3 && <Settings size={20} />}
                    </span>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {category.skills.map((skill, skillIdx) => (
                    <div key={skillIdx}>
                      <div className="flex justify-between mb-1.5">
                        <span className="font-mono text-sm font-medium">{skill.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                      </div>
                      <AnimatedProgress value={skill.level} delay={0.2 + (skillIdx * 0.1)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
        
        <div className="mt-16">
          <FadeInSection direction="up" delay={0.3}>
            <h3 className="text-2xl font-bold mb-6 text-center">Key Areas of Expertise</h3>
          </FadeInSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "C++ Development",
                description: "Modern C++14/17/20 applications with a focus on performance optimization and clean architecture.",
                icon: <FileCode size={24} />
              },
              {
                title: "System Programming",
                description: "File systems, memory management, and low-level system interfaces.",
                icon: <Server size={24} />
              },
              {
                title: "Data Structures",
                description: "Implementation of efficient, reusable data structures and algorithms.",
                icon: <Database size={24} />
              },
              {
                title: "GUI Applications",
                description: "Cross-platform desktop applications using Qt6 and visualization frameworks.",
                icon: <LayoutGrid size={24} />
              },
              {
                title: "Linux Environment",
                description: "Development in Linux ecosystems with shell scripting and system tools.",
                icon: <Terminal size={24} />
              },
              {
                title: "Software Architecture",
                description: "Designing maintainable, modular, and robust software systems.",
                icon: <Layers size={24} />
              }
            ].map((expertise, idx) => (
              <FadeInSection key={idx} direction="up" delay={0.2 + (idx * 0.1)}>
                <Card className="bg-card rounded-lg shadow-lg h-full group hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="p-6">
                    <div className="bg-primary/10 p-3 rounded-lg inline-block mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      {expertise.icon}
                    </div>
                    <h4 className="font-mono text-lg font-bold text-primary mb-3 group-hover:translate-x-1 transition-transform duration-300">
                      {expertise.title}
                    </h4>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                      {expertise.description}
                    </p>
                  </div>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
