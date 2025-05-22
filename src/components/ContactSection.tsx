
import { useState } from "react";
import { send } from "emailjs-com";
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Replace these with your actual EmailJS service, template, and user IDs
    const serviceId = "service_id";
    const templateId = "template_id";
    const userId = "user_id";
    
    try {
      setLoading(true);
      
      // When ready to connect to EmailJS, uncomment this block
      /*
      await send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        userId
      );
      */
      
      // For demo purposes, we'll simulate the email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      
      toast({
        title: "Message sent!",
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
    <section id="contact" className="py-16">
      <div className="container mx-auto">
        <h2 className="section-heading">Get In Touch</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <p className="text-lg mb-6">
              I'm always open to discussing new projects, opportunities, or collaborations. Feel free to reach out!
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <a 
                    href="mailto:abhiatole03@gmail.com" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    abhiatole03@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Phone size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <a 
                    href="tel:+11234567890" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (123) 456-7890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-full">
                  <MapPin size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-muted-foreground">
                    Mumbai, India
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <h4 className="text-lg font-bold mb-4">Connect with me</h4>
              <div className="flex gap-4">
                {[
                  { name: "GitHub", href: "https://github.com/Abhishek-Atole" },
                  { name: "LinkedIn", href: "https://linkedin.com/in/abhishekatole" }
                ].map((social, idx) => (
                  <Button key={idx} variant="outline" asChild size="sm">
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
          
          <div className="md:col-span-3 bg-card rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 font-mono">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows={5}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full font-mono"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
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
