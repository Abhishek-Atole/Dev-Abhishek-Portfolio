const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      {/* Add top spacing for fixed navbar */}
      <div className="pt-20">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <ExperienceSection />
        <CertificatesSection />
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};