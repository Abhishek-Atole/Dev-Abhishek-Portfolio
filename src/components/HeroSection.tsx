
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import { Group } from "three";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
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

  const techStack = ["C++", "Java", "Linux", "Git", "OOP", "STL"];

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
    <section id="home" className="min-h-screen relative flex flex-col justify-center items-center pt-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="z-10 flex flex-col justify-center animate-fade-in">
          <p className="font-mono text-primary mb-2">Hi, my name is</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            John Doe
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground mb-6">
            C++ & Java Developer
          </h2>
          <p className="text-muted-foreground max-w-md mb-8">
            I build high-performance software systems, backend services, and applications using C++, Java, and related technologies.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="font-mono">
              <a href="#projects">View My Projects</a>
            </Button>
            <Button variant="outline" asChild className="font-mono">
              <a href="#contact">Get In Touch</a>
            </Button>
          </div>
        </div>
        <div className={cn(
          "h-[40vh] sm:h-[50vh] md:h-[60vh] w-full order-first md:order-last",
          "animate-fade-in transition-all duration-700 ease-out"
        )}>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <CubeScene />
          </Canvas>
        </div>
      </div>
      
      <a 
        href="#about" 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} className="text-primary" />
      </a>
    </section>
  );
};

export default HeroSection;
