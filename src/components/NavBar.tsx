
import { useState, useEffect } from "react";
import { Menu, X, Home, User, Mail, BookOpen, Code, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

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

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 py-4",
        scrolled
          ? "bg-background/70 backdrop-blur-lg shadow-md"
          : "bg-background/30 backdrop-blur-sm"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-mono font-bold text-primary"
        >
          dev<span className="text-foreground">.portfolio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "font-mono text-sm transition-colors duration-200 flex items-center gap-2",
                isActive(item.href) 
                  ? "text-primary font-bold" 
                  : "hover:text-primary"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <ThemeSwitcher />
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-md md:hidden z-50">
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-lg font-mono transition-colors flex items-center gap-2",
                    isActive(item.href) 
                      ? "text-primary font-bold" 
                      : "hover:text-primary"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
