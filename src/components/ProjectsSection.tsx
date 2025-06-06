
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FadeInSection from "./animations/FadeInSection";
import { useIsMobile } from "@/hooks/use-mobile";

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

const ProjectCard = ({ project, index }: { project: ProjectType; index: number }) => {
  const isMobile = useIsMobile();
  
  return (
    <FadeInSection
      direction="up"
      delay={index * 0.1}
      className="h-full"
    >
      <Card className="overflow-hidden group h-full flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 border-border hover:border-primary/30">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
        </div>
        
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors duration-300">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="font-mono text-xs group-hover:bg-primary/10 group-hover:border-primary/30 transition-all duration-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 border-t border-border/50 mt-auto">
          <Button variant="ghost" size="sm" asChild className="group/btn">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github size={16} className="group-hover/btn:text-primary transition-colors duration-300" />
              <span className="group-hover/btn:translate-x-1 transition-transform duration-300">Source</span>
            </a>
          </Button>
          
          {project.demo && (
            <Button variant="outline" size="sm" asChild className="group/demo">
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span className="group-hover/demo:translate-x-1 transition-transform duration-300">Demo</span>
                <ExternalLink size={16} className="group-hover/demo:text-primary transition-colors duration-300" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </FadeInSection>
  );
};

const ProjectsSection = ({ showAll = false }) => {
  const displayedProjects = showAll ? projects : projects.slice(0, 6);
  const isMobile = useIsMobile();
  
  return (
    <section id="projects" className="py-16 bg-secondary/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rotate-45 animate-float opacity-50" />
        <div className="absolute bottom-40 right-20 w-6 h-6 bg-accent/20 rounded-full animate-float opacity-50" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-8 h-8 border border-primary/30 rounded-full animate-pulse opacity-30" />
      </div>
      
      <div className="container mx-auto relative z-10">
        <FadeInSection direction="up">
          <h2 className="section-heading flex items-center justify-center md:justify-start gap-3 mb-8">
            <span className="bg-primary/10 text-primary p-2 rounded-lg">
              <Code size={24} />
            </span>
            Featured Projects
          </h2>
        </FadeInSection>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <FadeInSection direction="up" delay={0.3}>
            {!showAll ? (
              <Button asChild className="font-mono group relative overflow-hidden bg-gradient-to-r from-primary to-accent border-0 hover:from-primary/90 hover:to-accent/90 transition-all duration-500">
                <Link to="/projects" className="flex items-center gap-2 px-6 py-2">
                  <span className="group-hover:translate-x-1 transition-transform duration-300">See All Projects</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="font-mono group relative overflow-hidden bg-gradient-to-r from-muted/80 to-muted border-0 hover:from-muted hover:to-muted/80 transition-all duration-500">
                <a 
                  href="https://github.com/Abhishek-Atole" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2"
                >
                  <Github size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">See More on GitHub</span>
                </a>
              </Button>
            )}
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
