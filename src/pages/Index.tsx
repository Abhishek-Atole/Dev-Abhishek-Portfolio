
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ResumeSection from "@/components/ResumeSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const Index = () => {
  // Set meta tags for SEO
  useEffect(() => {
    document.title = "John Doe | C++ & Java Developer Portfolio";
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Portfolio of John Doe, a specialized C++ and Java developer focused on high-performance systems and backend development.");
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ResumeSection />
        <ContactSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
