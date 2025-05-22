
import { Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProjectType = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  image: string;
};

const projects: ProjectType[] = [
  {
    title: "High-Performance Data Structure Library",
    description: "A C++ library implementing advanced data structures with a focus on performance optimization and memory efficiency. Includes concurrent hash maps, lock-free queues, and custom allocators.",
    tags: ["C++", "Data Structures", "Multithreading", "CMake"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Distributed Task Scheduler",
    description: "A Java-based distributed task scheduling system supporting job prioritization, failure recovery, and dynamic resource allocation. Built with Spring Boot and Apache Kafka.",
    tags: ["Java", "Spring Boot", "Kafka", "Microservices"],
    github: "https://github.com",
    demo: "https://example.com",
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1974&auto=format&fit=crop"
  },
  {
    title: "Custom Memory Allocator",
    description: "A specialized memory allocator designed for high-frequency allocation patterns in C++. Features include memory pooling, fragmentation reduction algorithms, and comprehensive performance metrics.",
    tags: ["C++", "Memory Management", "Systems Programming"],
    github: "https://github.com",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Parallel Processing Framework",
    description: "A modular framework for parallel data processing pipelines in Java, supporting work stealing, dynamic thread allocation, and adaptive execution strategies.",
    tags: ["Java", "Parallel Processing", "Threading", "Performance"],
    github: "https://github.com",
    demo: "https://example.com",
    image: "https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=2952&auto=format&fit=crop"
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-16 bg-secondary/30">
      <div className="container mx-auto">
        <h2 className="section-heading">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
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
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild className="font-mono">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github size={18} />
              See More on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
