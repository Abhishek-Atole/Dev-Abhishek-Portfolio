
import { Download, FileText, Briefcase, Calendar, MapPin, GitBranch, Database, FileCode, Network, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ExperienceItem = {
  title: string;
  company: string;
  type: string;
  location: string;
  duration: string;
  timeframe: string;
  description: string[];
  skills: string[];
};

const experiences: ExperienceItem[] = [
  {
    title: "C++ Developer Intern",
    company: "CodSoft",
    type: "Internship",
    location: "Karnataka, India · Remote",
    duration: "May 2025 – Present",
    timeframe: "1 mo",
    description: [
      "Selected as a C++ Developer Intern for the May Batch B28 at CodSoft, contributing to real-world software development projects remotely.",
      "Working on performance-oriented C++17/20 projects focused on data structures, file systems, and modular design.",
      "Collaborating in an Agile environment using Git and GitHub for version control and task management.",
      "Sharing deliverables through a dedicated GitHub repo (CODSOFT) and demo videos on LinkedIn.",
      "Following best practices in documentation, versioning, and modern C++ engineering."
    ],
    skills: ["C++", "Git", "Data Structures", "File Systems", "Agile", "Remote Work"]
  },
  {
    title: "Infosec Intern",
    company: "Babli IT Consulting",
    type: "Internship",
    location: "Pune, Maharashtra, India · Remote",
    duration: "Mar 2025 – Apr 2025",
    timeframe: "2 mos",
    description: [
      "Assisted in penetration testing and vulnerability assessments of company networks.",
      "Gained hands-on experience with SIEM tools, threat monitoring, and incident response procedures.",
      "Conducted research on best practices in cybersecurity strategy, helping strengthen network defenses."
    ],
    skills: ["Infosec", "VirtualBox", "Cybersecurity", "SIEM", "Network Security"]
  },
  {
    title: "Software Engineering Intern (Virtual)",
    company: "EA Sports (Forage)",
    type: "Job Simulation",
    location: "Virtual · Remote",
    duration: "Feb 2025 – Feb 2025",
    timeframe: "1 mo",
    description: [
      "Developed a weather simulation module for a sports game, enhancing realism and increasing engagement by 15%.",
      "Authored modern C++ specifications to optimize load times by 20%.",
      "Collaborated with cross-functional teams to integrate features and ensure a smooth user experience."
    ],
    skills: ["C++ (C++17/20)", "Game Logic", "System Design", "Cross-Team Collaboration"]
  }
];

const getIconForSkill = (skill: string) => {
  const lowerSkill = skill.toLowerCase();
  if (lowerSkill.includes("c++")) return <FileCode className="h-4 w-4" />;
  if (lowerSkill.includes("git")) return <GitBranch className="h-4 w-4" />;
  if (lowerSkill.includes("data structure")) return <Database className="h-4 w-4" />;
  if (lowerSkill.includes("network") || lowerSkill.includes("security") || lowerSkill.includes("infosec")) return <Network className="h-4 w-4" />;
  return <Computer className="h-4 w-4" />;
};

const ResumeSection = () => {
  return (
    <section id="resume" className="py-16 bg-secondary/30">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Resume & Experience</h2>
          
          <Button asChild className="font-mono">
            <a 
              href="/Abhishek_Atole_Cpp_Developer_Resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
          </Button>
        </div>
        
        <div className="space-y-8">
          <h3 className="text-2xl font-bold flex items-center gap-2 pb-2 border-b">
            <Briefcase size={22} className="text-primary" />
            Work Experience
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiences.map((exp, idx) => (
              <Card key={idx} className="relative overflow-hidden border-l-4 border-l-primary animate-fade-in">
                <div className="absolute w-2 h-2 rounded-full bg-primary top-6 -left-[5px]"></div>
                
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xl font-bold">{exp.title}</h4>
                    <div className="flex items-center gap-1 text-primary">
                      <Briefcase size={16} />
                      <span className="font-medium">{exp.company} · {exp.type}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{exp.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{exp.duration} · {exp.timeframe}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-sm">{item}</li>
                    ))}
                  </ul>
                  
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      <TooltipProvider>
                        {exp.skills.map((skill, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground">
                                {getIconForSkill(skill)}
                                {skill}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{skill}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
