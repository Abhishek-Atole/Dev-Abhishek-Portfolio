import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import EducationPage from "./pages/EducationPage";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import ModernCppBestPracticesPage from "./pages/blog/ModernCppBestPracticesPage";
import InMemoryFilesystemPage from "./pages/blog/InMemoryFilesystemPage";
import JavaJdbcBestPracticesPage from "./pages/blog/JavaJdbcBestPracticesPage";
import CppBasicsForBeginnersPage from "./pages/blog/CppBasicsForBeginnersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* Static blog post routes */}
          <Route path="/blog/modern-cpp-best-practices" element={<ModernCppBestPracticesPage />} />
          <Route path="/blog/in-memory-filesystem-implementation" element={<InMemoryFilesystemPage />} />
          <Route path="/blog/java-jdbc-best-practices" element={<JavaJdbcBestPracticesPage />} />
          <Route path="/blog/cpp-basics-for-beginners-part-1" element={<CppBasicsForBeginnersPage />} />
          {/* Keep the dynamic route as fallback for any other blog posts */}
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
