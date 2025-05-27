
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { cn } from "@/lib/utils";

// 3D Text Component
const TextPlane = ({ text, position, rotation, color }: { text: string, position: [number, number, number], rotation?: [number, number, number], color?: string }) => {
  return (
    <Text
      position={position}
      rotation={rotation || [0, 0, 0]}
      fontSize={0.4}
      color={color || "#ffffff"}
      font="/fonts/JetBrainsMono-Bold.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  );
};

// 3D Tech Stack Cube
const TechStackCube = () => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.3 + Math.PI / 4;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* C++ - Front */}
      <TextPlane text="C++" position={[0, 0, 1.2]} color="#00599C" />
      
      {/* Java - Back */}
      <TextPlane text="Java" position={[0, 0, -1.2]} rotation={[0, Math.PI, 0]} color="#f89820" />
      
      {/* Linux - Top */}
      <TextPlane text="Linux" position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} color="#FCC624" />
      
      {/* Git - Bottom */}
      <TextPlane text="Git" position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]} color="#F05032" />
      
      {/* OOP - Right */}
      <TextPlane text="OOP" position={[1.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#61DBFB" />
      
      {/* STL - Left */}
      <TextPlane text="STL" position={[-1.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="#FF6B6B" />
    </group>
  );
};

// CubeScene Component
const CubeScene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <TechStackCube />
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        rotateSpeed={0.5}
      />
    </>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rotate-45 animate-float" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/30 rotate-45 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-accent/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto min-h-screen flex items-center relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Content - Enhanced */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 
              border border-primary/20 rounded-full px-6 py-3 backdrop-blur-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-mono text-sm font-medium text-foreground/80">Available for opportunities</span>
            </div>
            
            {/* Main Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-mono text-primary text-lg font-medium tracking-wide">Hi, I'm</p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent 
                    hover:from-primary hover:via-accent hover:to-primary transition-all duration-500">
                    Abhishek
                  </span>
                  <br />
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                    Atole
                  </span>
                </h1>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-muted-foreground leading-relaxed">
                <span className="text-primary">C++ Developer</span> &
                <br />
                <span className="text-accent">System Architect</span>
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Crafting high-performance applications and elegant system solutions with 
                <span className="text-primary font-semibold"> modern C++</span>, 
                <span className="text-accent font-semibold"> Java</span>, and 
                <span className="text-primary font-semibold"> Linux</span>. 
                Passionate about clean architecture and solving complex problems.
              </p>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                asChild 
                size="lg"
                className="group font-mono font-semibold text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent 
                  hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300 
                  hover:shadow-2xl hover:shadow-primary/25"
              >
                <a href="#projects" className="flex items-center gap-3">
                  <span>View My Work</span>
                  <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="group font-mono font-semibold text-lg px-8 py-4 border-2 border-border 
                  hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/10"
              >
                <a href="/Abhishek_Atole_Cpp_Developer_Resume.pdf" target="_blank" className="flex items-center gap-3">
                  <Download size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                  <span>Download CV</span>
                </a>
              </Button>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-6 pt-6">
              <span className="font-mono text-sm text-muted-foreground">Connect with me:</span>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Github size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Linkedin size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </a>
                <a 
                  href="#contact"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Mail size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            
            {/* Enhanced Professional Photo */}
            <div className="relative group">
              {/* Multiple glow layers */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-all duration-1000" />
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full blur-xl opacity-40 group-hover:opacity-80 transition-all duration-700" />
              
              {/* Photo container with enhanced styling */}
              <div className="relative w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden 
                border-4 border-background shadow-2xl group-hover:shadow-3xl 
                group-hover:shadow-primary/20 transition-all duration-500 group-hover:scale-105">
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                <img 
                  src="/lovable-uploads/c5dd3c17-c8a7-47a3-a576-a245e2a0a459.png" 
                  alt="Abhishek Atole - Professional Photo" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md 
                  px-3 py-1.5 rounded-full border border-primary/30 opacity-0 group-hover:opacity-100 
                  transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
                  <span className="text-xs font-mono font-semibold text-primary">Available</span>
                </div>
              </div>
            </div>

            {/* Enhanced 3D Tech Stack Cube */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl blur-xl" />
              <div className={cn(
                "relative h-[35vh] sm:h-[40vh] lg:h-[45vh] w-full rounded-2xl overflow-hidden",
                "border border-border/30 bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-sm",
                "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700"
              )}>
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <CubeScene />
                </Canvas>
                
                {/* Enhanced Tech stack label with details */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md 
                  px-4 py-3 rounded-xl border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-bold text-primary">Core Technologies</span>
                    <span className="text-xs text-muted-foreground">Click & Drag to Explore</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[#00599C] font-semibold">C++14/17/20</span>
                      <p className="text-muted-foreground">High-performance applications</p>
                    </div>
                    <div>
                      <span className="text-[#f89820] font-semibold">Java</span>
                      <p className="text-muted-foreground">Enterprise solutions</p>
                    </div>
                    <div>
                      <span className="text-[#FCC624] font-semibold">Linux</span>
                      <p className="text-muted-foreground">System programming</p>
                    </div>
                    <div>
                      <span className="text-[#F05032] font-semibold">Git</span>
                      <p className="text-muted-foreground">Version control</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Tech Stack Info */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-3 hover:border-primary/40 transition-colors">
                  <div className="text-xs font-mono font-semibold text-primary mb-1">Frameworks</div>
                  <div className="text-xs space-y-1">
                    <div className="text-muted-foreground">Qt6, STL, CGAL</div>
                    <div className="text-muted-foreground">Modern C++ Standards</div>
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-3 hover:border-primary/40 transition-colors">
                  <div className="text-xs font-mono font-semibold text-accent mb-1">Concepts</div>
                  <div className="text-xs space-y-1">
                    <div className="text-muted-foreground">File Systems, OOP</div>
                    <div className="text-muted-foreground">Memory Management</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full relative">
          <div className="w-1 h-3 bg-primary rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
        </div>
        <a 
          href="#about" 
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          Scroll Down
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
