
import React, { useState, useEffect } from "react";
import { Menu, X, Home, User, Mail, BookOpen, Code, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Projects", href: "/projects", icon: Code },
  { label: "Education", href: "/education", icon: BookOpen },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 py-3 sm:py-4",
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background/70 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-lg sm:text-xl font-mono font-bold text-primary hover:text-primary/80 transition-colors duration-300 z-50 relative"
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                dev<span className="text-foreground">.portfolio</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "font-mono text-sm transition-all duration-300 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/70 relative group",
                      isActive(item.href) 
                        ? "text-primary font-bold bg-primary/10 shadow-sm" 
                        : "hover:text-primary"
                    )}
                  >
                    <item.icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden xl:inline group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                    
                    {/* Underline animation for active item */}
                    {isActive(item.href) && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-3"
                        layoutId="navbar-indicator"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Theme Switcher */}
            <motion.div 
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ThemeSwitcher />
            </motion.div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2 z-50 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeSwitcher />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 hover:bg-muted/80 transition-all duration-300"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X size={20} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-md lg:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed right-0 top-0 h-full w-72 bg-background border-l border-border lg:hidden z-40 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link 
                  to="/" 
                  className="text-lg font-mono font-bold text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  dev<span className="text-foreground">.portfolio</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 hover:bg-muted/80 transition-all duration-300"
                >
                  <X size={18} />
                </Button>
              </div>

              {/* Mobile Navigation Links with Animation */}
              <nav className="flex-1 py-6 px-4 overflow-y-auto">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg font-mono text-sm transition-all duration-300 w-full",
                          isActive(item.href) 
                            ? "text-primary font-bold bg-primary/10 shadow-sm border border-primary/20" 
                            : "hover:bg-muted/70 hover:translate-x-1 hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon size={20} className="text-primary" />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Mobile Footer */}
              <motion.div 
                className="p-4 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="text-xs text-muted-foreground text-center">
                  Portfolio by Abhishek Atole
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
