
import { Code, FileText, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto">
        <h2 className="section-heading">About Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="space-y-4">
              <p>
                Hello! I'm a passionate software developer specializing in C++ and Java development with a strong focus on high-performance computing, systems programming, and backend development. I thrive on solving complex technical challenges and building reliable, efficient software systems.
              </p>
              
              <p>
                With a solid foundation in computer science principles and extensive experience in object-oriented design, data structures, and algorithms, I create robust applications that meet the highest standards of quality and performance.
              </p>
              
              <p>
                I'm particularly interested in:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Systems programming and low-level optimization</li>
                <li>High-performance computing and parallel processing</li>
                <li>Backend service architecture and design</li>
                <li>Open-source contribution and collaboration</li>
              </ul>
              
              <p>
                When I'm not coding, you'll find me exploring the latest advancements in technology, contributing to open-source projects, and continuously expanding my knowledge through research and experimentation.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <Button variant="outline" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Github size={18} />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Linkedin size={18} />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#resume" className="flex items-center gap-2">
                    <FileText size={18} />
                    Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Code size={20} className="text-primary" />
              Tech Stack
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-primary mb-2">Programming Languages</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">C++</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Java</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Python</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Bash</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-primary mb-2">Frameworks & Libraries</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">STL</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Spring Boot</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">JUnit</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Boost</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-primary mb-2">Tools & Platforms</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Git</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Docker</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Linux</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">CMake</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-primary mb-2">Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">OOP</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Multithreading</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">Algorithms</span>
                  <span className="bg-secondary px-3 py-1 rounded-full text-sm">System Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
