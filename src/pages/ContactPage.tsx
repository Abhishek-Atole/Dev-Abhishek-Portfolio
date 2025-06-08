import NavBar from "@/components/NavBar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      {/* Add proper top spacing */}
      <main className="pt-24 pb-16">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
