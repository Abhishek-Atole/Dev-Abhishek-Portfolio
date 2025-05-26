
import { useState } from "react";
import { Loader2, Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.subject.trim()) {
      toast({
        title: "Subject is required",
        description: "Please enter a subject for your message.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.message.trim()) {
      toast({
        title: "Message is required",
        description: "Please enter your message.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulate form submission - replace with actual EmailJS implementation when ready
      console.log("Form data:", formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      toast({
        title: "Message sent successfully!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Message failed to send",
        description: "Please try again or reach out directly via email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        <h2 className="section-heading">Get In Touch</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg mb-6 leading-relaxed">
              I'm always open to discussing new projects, opportunities, or collaborations. Feel free to reach out!
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card/50 to-muted/20 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Mail size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium font-mono text-lg">Email</h4>
                  <a 
                    href="mailto:abhiatole03@gmail.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-mono"
                  >
                    abhiatole03@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card/50 to-muted/20 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Phone size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium font-mono text-lg">Phone</h4>
                  <a 
                    href="tel:+11234567890" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-mono"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-card/50 to-muted/20 border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium font-mono text-lg">Location</h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <h4 className="text-lg font-bold mb-4 font-mono">Connect with me</h4>
              <div className="flex gap-4">
                {[
                  { name: "GitHub", href: "https://github.com/Abhishek-Atole" },
                  { name: "LinkedIn", href: "https://linkedin.com/in/abhishekatole" }
                ].map((social, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    asChild 
                    size="sm"
                    className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/40 hover:text-primary transition-all duration-300 hover:scale-105 font-mono"
                  >
                    <a 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {social.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-gradient-to-br from-card/80 to-muted/40 rounded-2xl p-8 shadow-2xl border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                <Send size={20} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-mono">Send a Message</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium font-mono">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium font-mono">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                    className="bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 font-mono"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium font-mono">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium font-mono">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={6}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 hover:border-primary/30 font-mono resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full font-mono bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
