
import { Github, ExternalLink, ArrowRight, Star, GitFork } from "lucide-react";
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
  featured?: boolean;
  stats?: {
    stars: number;
    forks: number;
  };
};

export const projects: ProjectType[] = [
  {
    title: "Polygon Boolean Operations Visualizer",
    description: "A sophisticated GUI tool for visualizing 2D polygon Boolean operations with real-time rendering, cross-platform support, and comprehensive test coverage including 50+ edge cases.",
    tags: ["C++", "Qt6", "CGAL", "CMake"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    stats: { stars: 42, forks: 8 }
  },
  {
    title: "Generalized Data Structures Library",
    description: "A modular, header-only library of templated data structures built with modern C++ best practices, featuring extensive documentation and performance benchmarks.",
    tags: ["C++17", "Templates", "OOP", "Header-only"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1974&auto=format&fit=crop",
    featured: true,
    stats: { stars: 35, forks: 12 }
  },
  {
    title: "Custom Virtual File System",
    description: "An in-memory file system simulation supporting 15+ shell commands, detailed permission handling, and complete POSIX-like interface implementation.",
    tags: ["C++", "Memory Management", "File Systems"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop",
    featured: true,
    stats: { stars: 28, forks: 6 }
  },
  {
    title: "SQL Inventory Management System",
    description: "A comprehensive CRUD-enabled CLI inventory system built with JDBC, featuring normalized relational schema and advanced query optimization.",
    tags: ["Java", "MySQL", "JDBC", "SQL"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=2952&auto=format&fit=crop",
    stats: { stars: 19, forks: 4 }
  },
  {
    title: "Network Protocol Analyzer",
    description: "A high-performance packet sniffing and analysis tool built with C++ and pcap library for real-time network traffic monitoring and security analysis.",
    tags: ["C++", "Networking", "Pcap", "Security"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop",
    stats: { stars: 31, forks: 7 }
  },
  {
    title: "Memory Management Toolkit",
    description: "Custom allocators and memory management utilities for performance-critical C++ applications with detailed profiling and optimization tools.",
    tags: ["C++", "Memory Management", "Optimization"],
    github: "https://github.com/Abhishek-Atole",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?q=80&w=2070&auto=format&fit=crop",
    stats: { stars: 24, forks: 5 }
  }
];

const ProjectCard = ({ project }: { project: ProjectType }) => {
  return (
    <Card className={`group overflow-hidden hover:-translate-y-2 transition-all duration-500 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 ${project.featured ? 'ring-2 ring-primary/20' : ''}`}>
      {/* Image Container with Enhanced Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Stats Overlay */}
        {project.stats && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Star className="w-3 h-3 mr-1" />
              {project.stats.stars}
            </Badge>
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <GitFork className="w-3 h-3 mr-1" />
              {project.stats.forks}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-4">
        <CardTitle className="group-hover:text-primary transition-colors duration-300">
          {project.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="font-mono text-xs hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4 border-t border-border/30">
        <Button variant="ghost" size="sm" asChild className="group/btn">
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
          >
            <Github size={16} className="group-hover/btn:rotate-12 transition-transform duration-200" />
            Source Code
          </a>
        </Button>
        
        {project.demo && (
          <Button variant="outline" size="sm" asChild className="group/btn">
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
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
  const featuredProjects = projects.filter(p => p.featured);
  
  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-mono">
            Portfolio Showcase
          </Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A selection of projects showcasing expertise in C++ development, system programming, 
            and modern software architecture. Each project demonstrates different aspects of 
            technical proficiency and problem-solving capabilities.
          </p>
        </div>

        {/* Featured Projects Highlight */}
        {!showAll && featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Highlighted Work
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div className="mb-12">
          {!showAll && featuredProjects.length > 0 && (
            <h3 className="text-2xl font-bold mb-8 text-center text-muted-foreground">
              Additional Projects
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(showAll ? displayedProjects : projects.filter(p => !p.featured)).map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
        
        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            {!showAll ? (
              <Button asChild size="lg" className="group font-mono font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300">
                <Link to="/projects" className="flex items-center gap-3">
                  <span>Explore All Projects</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="group font-mono font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300">
                <a 
                  href="https://github.com/Abhishek-Atole" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  <Github size={20} />
                  <span>View GitHub Profile</span>
                  <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Button>
            )}
            
            <div className="text-sm text-muted-foreground font-mono">
              <span className="text-primary font-semibold">{projects.length}</span> projects • 
              <span className="text-accent font-semibold"> Open Source</span> • 
              <span className="text-primary font-semibold"> Modern C++</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
