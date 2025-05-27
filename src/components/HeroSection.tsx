
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail, Download, Sparkles, Code2, Database, Cpu } from "lucide-react";
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
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-accent/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rotate-45 animate-float" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-accent/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-primary/30 rotate-45 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-accent/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-32 left-1/3 w-2 h-2 bg-primary/40 animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-accent/30 rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-grid-pattern bg-[length:40px_40px] animate-pulse" />
      </div>
      
      <div className="container mx-auto min-h-screen flex items-center relative z-10 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Content - Enhanced */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            
            {/* Status Badge with enhanced styling */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 
              border border-primary/20 rounded-full px-6 py-3 backdrop-blur-sm hover:bg-gradient-to-r 
              hover:from-primary/15 hover:via-accent/10 hover:to-primary/15 transition-all duration-500 
              shadow-lg shadow-primary/5">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-30" />
              </div>
              <span className="font-mono text-sm font-medium text-foreground/80 flex items-center gap-2">
                <Sparkles size={16} className="text-primary animate-pulse" />
                Available for opportunities
              </span>
            </div>
            
            {/* Main Content with enhanced animations */}
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-mono text-primary text-lg font-medium tracking-wide animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Hi, I'm
                </p>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent 
                    hover:from-primary hover:via-accent hover:to-primary transition-all duration-500 relative">
                    Abhishek
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </span>
                  <br />
                  <span className="text-muted-foreground hover:text-foreground transition-colors duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    Atole
                  </span>
                </h1>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-muted-foreground leading-relaxed animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <span className="text-primary flex items-center gap-2">
                  <Code2 size={32} className="text-primary animate-pulse" />
                  C++ Developer
                </span> &
                <br />
                <span className="text-accent flex items-center gap-2 mt-2">
                  <Cpu size={32} className="text-accent animate-pulse" />
                  System Architect
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: '1s' }}>
                Crafting high-performance applications and elegant system solutions with 
                <span className="text-primary font-semibold bg-gradient-to-r from-primary/10 to-transparent px-2 py-1 rounded"> modern C++</span>, 
                <span className="text-accent font-semibold bg-gradient-to-r from-accent/10 to-transparent px-2 py-1 rounded"> Java</span>, and 
                <span className="text-primary font-semibold bg-gradient-to-r from-primary/10 to-transparent px-2 py-1 rounded"> Linux</span>. 
                Passionate about clean architecture and solving complex problems.
              </p>
            </div>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <Button 
                asChild 
                size="lg"
                className="group font-mono font-semibold text-lg px-8 py-4 bg-gradient-to-r from-primary to-accent 
                  hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300 
                  hover:shadow-2xl hover:shadow-primary/25 relative overflow-hidden"
              >
                <a href="#projects" className="flex items-center gap-3 relative z-10">
                  <span>View My Work</span>
                  <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="group font-mono font-semibold text-lg px-8 py-4 border-2 border-border 
                  hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300
                  hover:shadow-xl hover:shadow-primary/10 relative overflow-hidden"
              >
                <a href="/Abhishek_Atole_Cpp_Developer_Resume.pdf" target="_blank" className="flex items-center gap-3 relative z-10">
                  <Download size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
                  <span>Download CV</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </a>
              </Button>
            </div>
            
            {/* Enhanced Social Links */}
            <div className="flex items-center gap-6 pt-6 animate-fade-in" style={{ animationDelay: '1.4s' }}>
              <span className="font-mono text-sm text-muted-foreground">Connect with me:</span>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden"
                >
                  <Github size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden"
                >
                  <Linkedin size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </a>
                <a 
                  href="#contact"
                  className="group p-3 rounded-full bg-gradient-to-r from-muted/30 to-muted/20 border border-border/50 
                    hover:border-primary/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                    hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden"
                >
                  <Mail size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            
            {/* Enhanced Professional Photo */}
            <div className="relative group">
              {/* Multiple glow layers with enhanced effects */}
              <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-full blur-3xl opacity-20 group-hover:opacity-60 transition-all duration-1000 animate-pulse" />
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/40 to-primary/40 rounded-full blur-2xl opacity-30 group-hover:opacity-80 transition-all duration-700" />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 to-accent/50 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-all duration-500" />
              
              {/* Photo container with enhanced styling */}
              <div className="relative w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden 
                border-4 border-background shadow-2xl group-hover:shadow-3xl 
                group-hover:shadow-primary/20 transition-all duration-500 group-hover:scale-105">
                
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                
                <img 
                  src="/lovable-uploads/c5dd3c17-c8a7-47a3-a576-a245e2a0a459.png" 
                  alt="Abhishek Atole - Professional Photo" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Enhanced floating badge */}
                <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-md 
                  px-3 py-1.5 rounded-full border border-primary/30 opacity-0 group-hover:opacity-100 
                  transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20
                  shadow-lg shadow-primary/10">
                  <span className="text-xs font-mono font-semibold text-primary flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Available
                  </span>
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
                
                {/* Enhanced Tech stack display - Split into two halves */}
                <div className="absolute inset-x-4 bottom-4 grid grid-cols-2 gap-3">
                  {/* Left Half - Core Technologies */}
                  <div className="bg-background/95 backdrop-blur-md px-3 py-3 rounded-xl border border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-primary flex items-center gap-1">
                        <Code2 size={12} />
                        Core Tech
                      </span>
                      <span className="text-[10px] text-muted-foreground">Interactive</span>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#00599C] font-semibold">C++14/17/20</span>
                        <div className="w-8 h-1 bg-[#00599C]/20 rounded-full">
                          <div className="w-7 h-full bg-[#00599C] rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#f89820] font-semibold">Java</span>
                        <div className="w-8 h-1 bg-[#f89820]/20 rounded-full">
                          <div className="w-6 h-full bg-[#f89820] rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#FCC624] font-semibold">Linux</span>
                        <div className="w-8 h-1 bg-[#FCC624]/20 rounded-full">
                          <div className="w-7 h-full bg-[#FCC624] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Half - Frameworks & Tools */}
                  <div className="bg-background/95 backdrop-blur-md px-3 py-3 rounded-xl border border-border/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-accent flex items-center gap-1">
                        <Database size={12} />
                        Tools
                      </span>
                      <span className="text-[10px] text-muted-foreground">Drag to Explore</span>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-accent font-semibold">Qt6</span>
                        <div className="w-8 h-1 bg-accent/20 rounded-full">
                          <div className="w-6 h-full bg-accent rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-semibold">STL</span>
                        <div className="w-8 h-1 bg-primary/20 rounded-full">
                          <div className="w-7 h-full bg-primary rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#F05032] font-semibold">Git</span>
                        <div className="w-8 h-1 bg-[#F05032]/20 rounded-full">
                          <div className="w-7 h-full bg-[#F05032] rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Additional Tech Stack Info */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-3 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
                  <div className="text-xs font-mono font-semibold text-primary mb-2 flex items-center gap-1">
                    <Code2 size={12} />
                    Frameworks
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Qt6, STL, CGAL</span>
                      <div className="w-4 h-1 bg-primary/30 rounded-full" />
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Modern C++</span>
                      <div className="w-5 h-1 bg-primary/30 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-3 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/10">
                  <div className="text-xs font-mono font-semibold text-accent mb-2 flex items-center gap-1">
                    <Cpu size={12} />
                    Concepts
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>File Systems</span>
                      <div className="w-5 h-1 bg-accent/30 rounded-full" />
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Memory Mgmt</span>
                      <div className="w-4 h-1 bg-accent/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full relative overflow-hidden">
          <div className="w-1 h-3 bg-primary rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent opacity-50" />
        </div>
        <a 
          href="#about" 
          className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-1"
        >
          <ArrowDown size={12} className="animate-bounce" />
          Scroll Down
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
