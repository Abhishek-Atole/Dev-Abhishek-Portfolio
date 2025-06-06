import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code } from "lucide-react";
import FadeInSection from "@/components/animations/FadeInSection";
import ResponsiveContainer from "@/components/ResponsiveContainer";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  codeUrl?: string;
}

const projects: Project[] = [
  {
    title: "Personal Portfolio Website",
    description:
      "A personal portfolio website built with React, TypeScript, and Tailwind CSS. Showcases my skills, projects, and experience.",
    image: "/portfolio.png",
    tags: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://abhishek-atole.vercel.app/",
    githubUrl: "https://github.com/abhishek-atole/abhishek-atole",
  },
  {
    title: "E-commerce Store",
    description:
      "A full-stack e-commerce store built with Next.js, TypeScript, and Stripe. Allows users to browse products, add them to a cart, and checkout.",
    image: "/ecommerce.png",
    tags: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    githubUrl: "https://github.com/abhishek-atole/nextjs-ecommerce",
  },
  {
    title: "Task Management App",
    description:
      "A task management app built with React, TypeScript, and Firebase. Allows users to create, assign, and track tasks.",
    image: "/task-management.png",
    tags: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/abhishek-atole/react-task-management",
  },
];

/**
 * A section that displays the projects
 */
const ProjectsSection = () => {
  return (
    <section id="projects" className="py-12">
      <ResponsiveContainer className="space-y-8">
        <FadeInSection direction="up">
          <h2 className="text-3xl font-semibold tracking-tight text-center">
            Projects
          </h2>
          <p className="text-muted-foreground text-center">
            Here are some of my favorite projects.
          </p>
        </FadeInSection>
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <FadeInSection key={index} direction="up" delay={0.1 * index}>
              <Card className="bg-card text-card-foreground shadow-md overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {project.description}
                  </CardDescription>
                  <div className="flex justify-end space-x-2">
                    {project.liveUrl && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          Live <ExternalLink className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          GitHub <Github className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {project.codeUrl && (
                      <Button asChild variant="ghost" size="sm">
                        <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          Code <Code className="ml-1 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
};

export default ProjectsSection;
