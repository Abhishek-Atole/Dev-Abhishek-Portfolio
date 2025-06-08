import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import NotesContent from '@/components/NotesContent'; // Move your notes content to a separate component

const NotesPage = () => {
  useEffect(() => {
    document.title = "Technical Notes | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16"> {/* Proper spacing for fixed navbar */}
        <NotesContent />
      </main>
      <Footer />
    </div>
  );
};

export default NotesPage;