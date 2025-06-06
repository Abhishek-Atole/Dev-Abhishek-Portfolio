
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export type ProjectType = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  image: string;
};

export const projects: ProjectType[] = [
  {
    title: "Polygon Boolean Operations Visualizer",
    description: "A GUI tool for visualizing 2D polygon Boolean operations. Cross-platform support and 50+ test cases with real-time rendering.",
    tags: ["C++", "Qt6", "CGAL", "CMake"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Generalized Data Structures Library",
    description: "A modular, header-only library of linked lists built with modern C++ best practices.",
    tags: ["C++17", "Templates", "OOP", "Header-only"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Custom Virtual File System",
    description: "An in-memory file system simulation supporting 15+ shell commands and detailed permission handling.",
    tags: ["C++", "Memory Management", "File Systems"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "SQL Inventory App",
    description: "A CRUD-enabled CLI inventory system built with JDBC and normalized relational schema.",
    tags: ["Java", "MySQL", "JDBC", "SQL"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=2952&auto=format&fit=crop"
  },
  {
    title: "Network Protocol Analyzer",
    description: "A packet sniffing and analysis tool built with C++ and pcap library for monitoring network traffic.",
    tags: ["C++", "Networking", "Pcap", "Analysis"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
  },
  {
    title: "Memory Management Toolkit",
    description: "Custom allocators and memory management utilities for performance-critical C++ applications.",
    tags: ["C++", "Memory Management", "Optimization"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop"
  }
];

const ProjectCard = ({ project }: { project: ProjectType }) => {
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map(tag => (
            <Badge key={tag} variant="outline" className="font-mono text-xs">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" asChild>
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Github size={16} />
            Source Code
          </a>
        </Button>
        
        {project.demo && (
          <Button variant="outline" size="sm" asChild>
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const ProjectsSection = ({ showAll = false }) => {
  const displayedProjects = showAll ? projects : projects.slice(0, 6);
  
  return (
    <section id="projects" className="py-16 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="section-heading">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          {!showAll ? (
            <Button asChild className="font-mono">
              <Link to="/projects" className="flex items-center gap-2">
                See All Projects
                <ArrowRight size={16} />
              </Link>
            </Button>
          ) : (
            <Button asChild className="font-mono">
              <a 
                href="https://github.com/Abhishek-Atole" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github size={18} />
                See More on GitHub
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
