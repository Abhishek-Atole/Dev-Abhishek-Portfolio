
import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import EducationSection from "@/components/EducationSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ResumeSection from "@/components/ResumeSection";
import CertificatesSection from "@/components/CertificatesSection";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  // Set meta tags for SEO
  useEffect(() => {
    document.title = "Abhishek Atole | C++ & Java Developer Portfolio";
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Portfolio of Abhishek Atole, specializing in C++ applications, virtual systems, and backend solutions with a passion for deep logic and clean architecture.");
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="w-full overflow-x-hidden">
        {/* Hero Section - Full viewport height */}
        <div id="home" className="min-h-screen">
          <HeroSection />
        </div>
        
        {/* About Section - Subtle background */}
        <div id="about" className="scroll-mt-20 bg-gradient-to-br from-background via-muted/10 to-background">
          <AboutSection />
        </div>
        
        {/* Projects Section - Enhanced background */}
        <div id="projects" className="scroll-mt-20 bg-gradient-to-br from-secondary/20 via-primary/5 to-secondary/20">
          <ProjectsSection />
        </div>
        
        {/* Skills Section - Distinctive background */}
        <div id="skills" className="scroll-mt-20 bg-gradient-to-br from-background via-accent/5 to-background relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
          </div>
          <SkillsSection />
        </div>
        
        {/* Resume Section - Clean background */}
        <div id="resume" className="scroll-mt-20 bg-gradient-to-br from-muted/5 via-background to-muted/5">
          <ResumeSection />
        </div>
        
        {/* Certificates Section - Accent background */}
        <div id="certificates" className="scroll-mt-20 bg-gradient-to-br from-secondary/10 via-background to-secondary/10">
          <CertificatesSection />
        </div>
        
        {/* Education Section - Subtle gradient */}
        <div id="education" className="scroll-mt-20 bg-gradient-to-br from-background via-primary/3 to-background">
          <EducationSection />
        </div>
        
        {/* Blog Section - Darker accent */}
        <div id="blog" className="scroll-mt-20 bg-gradient-to-br from-secondary/15 via-muted/10 to-secondary/15">
          <BlogSection />
        </div>
        
        {/* Contact Section - Final gradient */}
        <div id="contact" className="scroll-mt-20 bg-gradient-to-br from-background via-accent/8 to-primary/5">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
      
      {/* AI Chatbot for visitors */}
      <Chatbot position="bottom-right" />
    </div>
  );
};

export default Index;
