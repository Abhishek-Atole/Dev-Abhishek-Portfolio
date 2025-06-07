
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
        <div id="home">
          <HeroSection />
        </div>
        
        <div id="about" className="scroll-mt-20">
          <AboutSection />
        </div>
        
        <div id="projects" className="scroll-mt-20">
          <ProjectsSection />
        </div>
        
        <div id="resume" className="scroll-mt-20">
          <ResumeSection />
        </div>
        
        <div id="skills" className="scroll-mt-20">
          <SkillsSection />
        </div>
        
        <div id="certificates" className="scroll-mt-20">
          <CertificatesSection />
        </div>
        
        <div id="education" className="scroll-mt-20">
          <EducationSection />
        </div>
        
        <div id="blog" className="scroll-mt-20">
          <BlogSection />
        </div>
        
        <div id="contact" className="scroll-mt-20">
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
