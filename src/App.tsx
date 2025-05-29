import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import AboutPage from "@/pages/AboutPage";
import ProjectsPage from "@/pages/ProjectsPage";
import EducationPage from "@/pages/EducationPage";
import CertificatesPage from "@/pages/CertificatesPage";
import ContactPage from "@/pages/ContactPage";
import BlogPage from "@/pages/BlogPage";
import BlogPost from "@/pages/BlogPost";
import CppBasicsForBeginnersPage from "@/pages/blog/CppBasicsForBeginnersPage";
import ModernCppBestPracticesPage from "@/pages/blog/ModernCppBestPracticesPage";
import JavaJdbcBestPracticesPage from "@/pages/blog/JavaJdbcBestPracticesPage";
import InMemoryFilesystemPage from "@/pages/blog/InMemoryFilesystemPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <Toaster />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/cpp-basics-for-beginners" element={<CppBasicsForBeginnersPage />} />
            <Route path="/blog/modern-cpp-best-practices" element={<ModernCppBestPracticesPage />} />
            <Route path="/blog/java-jdbc-best-practices" element={<JavaJdbcBestPracticesPage />} />
            <Route path="/blog/in-memory-filesystem" element={<InMemoryFilesystemPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
