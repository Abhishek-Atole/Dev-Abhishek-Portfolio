
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import EducationSection from "@/components/EducationSection";

const EducationPage = () => {
  useEffect(() => {
    document.title = "Education | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24">
        <EducationSection />
      </main>
      <Footer />
    </div>
  );
};

export default EducationPage;
