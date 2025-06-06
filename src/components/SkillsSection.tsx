
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const SkillsSection = () => {
  return (
    <section id="skills" className="py-16">
      <div className="container mx-auto">
        <h2 className="section-heading">Skills & Expertise</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((category, idx) => (
            <Card key={idx} className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div key={skillIdx}>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-sm">{skill.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Key Areas of Expertise</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                title: "C++ Development",
                description: "Modern C++14/17/20 applications with a focus on performance optimization and clean architecture."
              },
              {
                title: "System Programming",
                description: "File systems, memory management, and low-level system interfaces."
              },
              {
                title: "Data Structures",
                description: "Implementation of efficient, reusable data structures and algorithms."
              },
              {
                title: "GUI Applications",
                description: "Cross-platform desktop applications using Qt6 and visualization frameworks."
              },
              {
                title: "Linux Environment",
                description: "Development in Linux ecosystems with shell scripting and system tools."
              },
              {
                title: "Software Architecture",
                description: "Designing maintainable, modular, and robust software systems."
              }
            ].map((expertise, idx) => (
              <div key={idx} className="bg-card rounded-lg p-6 shadow-lg">
                <h4 className="font-mono text-lg font-bold text-primary mb-3">{expertise.title}</h4>
                <p className="text-sm text-muted-foreground">{expertise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
