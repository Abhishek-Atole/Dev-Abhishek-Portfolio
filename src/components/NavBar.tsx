import React, { useState, useEffect } from "react";
import { Menu, X, Home, User, Mail, BookOpen, Code, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Projects", href: "/projects", icon: Code },
  { label: "Education", href: "/education", icon: BookOpen },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
  { label: "Notes", href: "/notes", icon: FileText },
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

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4
      }
    }
  };

  const logoVariants = {
    hover: { 
      scale: 1.05,
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 }
    }
  };

  const navItemVariants = {
    hover: { 
      scale: 1.05,
      backgroundColor: "hsl(var(--muted) / 0.5)",
      transition: { duration: 0.2 }
    }
  };

  const mobileMenuVariants = {
    closed: { 
      x: "100%",
      opacity: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileNavItemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 py-3 sm:py-4",
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/50"
            : "bg-background/70 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo */}
            <motion.div whileHover="hover" variants={logoVariants}>
              <Link 
                to="/" 
                className="text-lg sm:text-xl font-mono font-bold text-primary hover:text-primary/80 transition-colors duration-200 z-50 relative"
              >
                dev<span className="text-foreground">.portfolio</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  whileHover="hover"
                  variants={navItemVariants}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "font-mono text-sm transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-lg",
                      isActive(item.href) 
                        ? "text-primary font-bold bg-primary/10 shadow-sm" 
                        : "hover:text-primary"
                    )}
                  >
                    <item.icon size={16} />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Theme Switcher */}
            <div className="hidden lg:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-2 z-50 relative">
              <ThemeSwitcher />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{ 
          open: { opacity: 1 },
          closed: { opacity: 0 }
        }}
        className={cn(
          "fixed inset-0 bg-background/95 backdrop-blur-md lg:hidden z-40 transition-opacity duration-300",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={mobileMenuVariants}
        className={cn(
          "fixed right-0 top-0 h-full w-72 bg-background border-l border-border lg:hidden z-40 shadow-2xl"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <motion.div whileHover="hover" variants={logoVariants}>
              <Link 
                to="/" 
                className="text-lg font-mono font-bold text-primary"
                onClick={() => setIsOpen(false)}
              >
                dev<span className="text-foreground">.portfolio</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X size={18} />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                variants={mobileNavItemVariants}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg font-mono text-sm transition-all duration-200 w-full hover:bg-muted/70",
                    isActive(item.href) 
                      ? "text-primary font-bold bg-primary/10 shadow-sm border border-primary/20" 
                      : "hover:text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Portfolio by Abhishek Atole
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default NavBar;
