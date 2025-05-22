
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
    title: "Senior C++ Developer",
    company: "Tech Innovations Inc.",
    duration: "2020 - Present",
    description: [
      "Lead the development of a high-performance data processing system that handles over 1M transactions per second",
      "Optimized critical code paths reducing memory usage by 40% and improving throughput by 25%",
      "Designed and implemented a custom memory allocator for specialized workloads",
      "Mentored junior developers and conducted code reviews to ensure code quality"
    ]
  },
  {
    title: "Java Backend Engineer",
    company: "Enterprise Solutions Ltd.",
    duration: "2017 - 2020",
    description: [
      "Developed and maintained microservices using Spring Boot and Java 11",
      "Built a distributed task scheduling system supporting dynamic resource allocation",
      "Improved system reliability by implementing comprehensive error handling and recovery mechanisms",
      "Collaborated with cross-functional teams to design and implement RESTful APIs"
    ]
  },
  {
    title: "Software Developer",
    company: "StartApp Solutions",
    duration: "2015 - 2017",
    description: [
      "Developed and maintained backend services using Java and Python",
      "Implemented efficient algorithms for data processing tasks",
      "Participated in full software development lifecycle from design to deployment",
      "Worked in an Agile environment with 2-week sprint cycles"
    ]
  }
];

const education: EducationItem[] = [
  {
    degree: "M.S. in Computer Science",
    institution: "University of Technology",
    duration: "2013 - 2015",
    details: "Specialization in Systems Programming and Distributed Computing"
  },
  {
    degree: "B.S. in Computer Science",
    institution: "State University",
    duration: "2009 - 2013",
    details: "Graduated with Honors, Minor in Mathematics"
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
              href="/John-Doe-CV.pdf" 
              download 
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
                  { name: "Oracle Certified Professional, Java SE 11 Developer", year: "2019" },
                  { name: "AWS Certified Solutions Architect", year: "2021" },
                  { name: "Linux Foundation Certified Engineer", year: "2020" }
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
