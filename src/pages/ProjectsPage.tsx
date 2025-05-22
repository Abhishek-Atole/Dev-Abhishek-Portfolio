
import NavBar from "@/components/NavBar";
import ProjectsSection from "@/components/ProjectsSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const ProjectsPage = () => {
  useEffect(() => {
    document.title = "Projects | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24">
        <ProjectsSection showAll={true} />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
