import NavBar from "@/components/NavBar";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      {/* Add proper top spacing */}
      <main className="pt-24 pb-16">
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
