
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
      { name: "C++", level: 95 },
      { name: "Java", level: 90 },
      { name: "Python", level: 80 },
      { name: "JavaScript/TypeScript", level: 75 },
    ],
  },
  {
    name: "Systems & Backend",
    skills: [
      { name: "Multithreading", level: 90 },
      { name: "Memory Management", level: 85 },
      { name: "Systems Design", level: 80 },
      { name: "Database Optimization", level: 75 },
    ],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      { name: "STL (C++)", level: 95 },
      { name: "Spring Boot", level: 85 },
      { name: "Boost", level: 80 },
      { name: "React", level: 70 },
    ],
  },
  {
    name: "Tools & Technologies",
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 85 },
      { name: "Linux", level: 90 },
      { name: "CI/CD", level: 80 },
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
                title: "High-Performance Computing",
                description: "Optimization techniques, parallel algorithms, and efficient memory usage for maximum performance."
              },
              {
                title: "Systems Programming",
                description: "Low-level system interfaces, device drivers, and operating system interaction."
              },
              {
                title: "Backend Development",
                description: "Scalable services, API design, and distributed systems architecture."
              },
              {
                title: "Algorithm Design",
                description: "Implementation of complex algorithms with a focus on efficiency and correctness."
              },
              {
                title: "Concurrency & Threading",
                description: "Thread synchronization, lock-free programming, and concurrent data structures."
              },
              {
                title: "Software Architecture",
                description: "Designing maintainable, scalable, and robust software systems."
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
