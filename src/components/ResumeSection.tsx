
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  description: string[];
};

type EducationItem = {
  degree: string;
  institution: string;
  duration: string;
  details: string;
};

const experiences: ExperienceItem[] = [
  {
    title: "C++ Developer Intern",
    company: "Tech Solutions Inc.",
    duration: "2022 - 2023",
    description: [
      "Developed CGAL-based polygon visualization tools with Qt6 frontend",
      "Implemented Boolean operations for 2D polygons with real-time rendering",
      "Created and maintained cross-platform build systems using CMake",
      "Collaborated with senior developers on code reviews and performance optimization"
    ]
  },
  {
    title: "Software Engineering Intern",
    company: "Data Systems Ltd.",
    duration: "2021 - 2022",
    description: [
      "Built a Java-based inventory management system with MySQL backend",
      "Designed and implemented normalized database schema for efficient queries",
      "Developed JDBC connection layer with transaction support",
      "Created comprehensive documentation and conducted user training"
    ]
  },
  {
    title: "Open Source Contributor",
    company: "Various Projects",
    duration: "2020 - Present",
    description: [
      "Contributed to open-source C++ libraries focusing on data structures",
      "Implemented test suites and continuous integration workflows",
      "Fixed memory leaks and performance bottlenecks in existing codebases",
      "Collaborated with global teams through distributed version control"
    ]
  }
];

const education: EducationItem[] = [
  {
    degree: "B.E. in Computer Engineering",
    institution: "University of Engineering",
    duration: "2018 - 2022",
    details: "Specialization in Systems Programming and Data Structures"
  },
  {
    degree: "Advanced Diploma in Programming",
    institution: "Technical Institute",
    duration: "2016 - 2018",
    details: "Focus on C++ and Java application development"
  }
];

const ResumeSection = () => {
  return (
    <section id="resume" className="py-16 bg-secondary/30">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold">Resume & Experience</h2>
          
          <Button asChild className="font-mono">
            <a 
              href="https://drive.google.com/file/d/17AdJbXxt9pAo8MnmPqG4RFWx0Mdjeut8/view?usp=drive_link" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Download size={18} />
              Download Resume
            </a>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold flex items-center gap-2 pb-2 border-b">
                <FileText size={22} className="text-primary" />
                Work Experience
              </h3>
              
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-primary/30 pb-6">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
                  
                  <h4 className="text-xl font-bold">{exp.title}</h4>
                  <div className="flex flex-wrap justify-between mb-2">
                    <span className="font-medium text-primary">{exp.company}</span>
                    <span className="text-sm text-muted-foreground font-mono">{exp.duration}</span>
                  </div>
                  
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 pb-2 border-b">
                <FileText size={22} className="text-primary" />
                Education
              </h3>
              
              <div className="space-y-6 mt-6">
                {education.map((edu, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-primary/30 pb-6">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
                    
                    <h4 className="font-bold">{edu.degree}</h4>
                    <div className="flex flex-wrap justify-between mb-1">
                      <span className="text-sm text-primary">{edu.institution}</span>
                      <span className="text-xs text-muted-foreground font-mono">{edu.duration}</span>
                    </div>
                    <p className="text-sm">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2 pb-2 border-b">
                <FileText size={22} className="text-primary" />
                Certifications
              </h3>
              
              <div className="space-y-3 mt-6">
                {[
                  { name: "Advanced C++ Programming", year: "2022" },
                  { name: "Data Structures and Algorithms", year: "2021" },
                  { name: "Linux System Administration", year: "2020" }
                ].map((cert, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span>{cert.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResumeSection;
