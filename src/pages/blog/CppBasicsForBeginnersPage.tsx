
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Bookmark, ExternalLink, ChevronRight, Code2, Lightbulb, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const CppBasicsForBeginnersPage = () => {
  useEffect(() => {
    document.title = "Basics of C++ Programming for Beginners - Part 1 | Abhishek Atole";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-40" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <NavBar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Enhanced Back Button */}
          <Button 
            variant="ghost" 
            asChild 
            className="mb-8 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
              hover:scale-105 transition-all duration-300 group border border-border/50 
              hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 animate-fade-in"
          >
            <Link to="/blog" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-mono font-medium">Back to all posts</span>
            </Link>
          </Button>
          
          {/* Article Header */}
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-12 not-prose relative animate-fade-in">
              {/* Floating decorative elements */}
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-lg opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-foreground 
                bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent 
                font-mono tracking-tight hover:tracking-wide transition-all duration-500">
                Basics of C++ Programming for Beginners - Part 1
              </h1>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8 text-muted-foreground 
                border border-border/30 rounded-2xl p-6 bg-gradient-to-r from-card/50 to-muted/20 
                backdrop-blur-sm hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 
                transition-all duration-500 hover:-translate-y-1 group">
                
                <div className="flex items-center gap-4 group/author">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 
                    flex items-center justify-center group-hover/author:scale-110 transition-transform duration-300 
                    group-hover/author:shadow-2xl group-hover/author:shadow-primary/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover/author:opacity-100 transition-opacity duration-300" />
                    <User size={24} className="text-primary relative z-10" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground group-hover/author:text-primary transition-colors duration-300 font-mono">
                      Abhishek Atole
                    </p>
                    <p className="text-sm text-muted-foreground group-hover/author:text-foreground/80 transition-colors duration-300">
                      Software Developer & Technical Writer
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 
                    hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-md group/date">
                    <Calendar size={16} className="text-primary group-hover/date:animate-pulse" />
                    <span className="font-mono font-medium">Dec 29, 2024</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 
                    hover:from-primary/10 hover:to-accent/10 transition-all duration-300 hover:scale-105 hover:shadow-md group/time">
                    <Clock size={16} className="text-primary group-hover/time:animate-pulse" />
                    <span className="font-mono font-medium">8 min read</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                      hover:text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg 
                      hover:shadow-primary/20 border border-border/50 hover:border-primary/40 group/share"
                  >
                    <Share2 size={16} className="group-hover/share:animate-bounce" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                      hover:text-primary transition-all duration-300 hover:scale-110 hover:shadow-lg 
                      hover:shadow-primary/20 border border-border/50 hover:border-primary/40 group/bookmark"
                  >
                    <Bookmark size={16} className="group-hover/bookmark:animate-bounce" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-10">
                {["C++", "Programming", "Beginners", "Tutorial", "Software Development"].map((tag, index) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="font-mono text-sm px-4 py-2 bg-gradient-to-r from-muted/40 to-muted/60 
                      hover:from-primary/15 hover:to-accent/15 hover:text-primary hover:scale-110 
                      transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-primary/20 
                      border border-border/50 hover:border-primary/40 group relative overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Tag size={12} className="mr-2 relative z-10 group-hover:animate-spin" />
                    <span className="relative z-10 font-semibold">{tag}</span>
                  </Badge>
                ))}
              </div>
            </header>
            
            {/* Featured Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 not-prose group shadow-2xl shadow-black/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=600&fit=crop" 
                alt="C++ Programming Basics" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl border border-white/20">
                  <p className="text-sm font-mono font-medium">Featured Tutorial</p>
                </div>
              </div>
            </div>

            {/* Table of Contents - Animated */}
            <Card className="mb-12 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6 group-hover:gap-4 transition-all duration-300">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <BookOpen size={20} className="text-primary group-hover:animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold font-mono group-hover:text-primary transition-colors duration-300">Table of Contents</h2>
                </div>
                <nav className="space-y-3">
                  {[
                    "What is C++ Programming?",
                    "Why Learn C++?",
                    "Setting Up Your Development Environment",
                    "Your First C++ Program",
                    "Understanding Basic Syntax",
                    "Variables and Data Types",
                    "Basic Input and Output",
                    "Next Steps"
                  ].map((item, index) => (
                    <a 
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[?]/g, '')}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                        transition-all duration-300 hover:translate-x-2 group/item border border-transparent hover:border-primary/20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ChevronRight size={16} className="text-primary group-hover/item:translate-x-1 transition-transform duration-300" />
                      <span className="font-mono group-hover/item:text-primary transition-colors duration-300">{item}</span>
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
            
            {/* Article Content with Medium-style structure */}
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none relative
              prose-headings:font-mono prose-headings:font-bold prose-headings:text-foreground
              prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
              prose-h1:mb-8 prose-h2:mb-6 prose-h2:mt-16 prose-h3:mb-4 prose-h3:mt-12 prose-h4:mb-3 prose-h4:mt-8
              prose-p:text-foreground/90 prose-p:leading-8 prose-p:mb-8 prose-p:text-lg
              prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-primary
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:bg-gradient-to-r prose-blockquote:from-muted/30 prose-blockquote:to-transparent prose-blockquote:py-4 prose-blockquote:rounded-r-lg
              prose-ul:mb-8 prose-ol:mb-8 prose-li:mb-3 prose-li:text-lg
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary/80 prose-a:font-medium
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:shadow-black/10">
              
              <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-primary/2 to-transparent rounded-3xl -z-10" />

              {/* Introduction Section */}
              <div className="mb-12 p-8 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 group not-prose">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <Lightbulb size={20} className="text-primary group-hover:animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold font-mono group-hover:text-primary transition-colors duration-300">Introduction</h2>
                </div>
                <p className="text-lg leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                  Welcome to the exciting world of C++ programming! Whether you're a complete beginner or coming from another programming language, 
                  this comprehensive guide will take you through the fundamentals of C++ programming step by step. C++ is one of the most powerful 
                  and widely-used programming languages in the world, powering everything from operating systems to game engines.
                </p>
              </div>

              <h2 id="what-is-c-programming">What is C++ Programming?</h2>
              
              <p>
                C++ is a general-purpose programming language that was developed by Bjarne Stroustrup at Bell Labs starting in 1979. 
                It's an extension of the C programming language, which is why it was originally called "C with Classes." 
                The "++" in the name refers to the increment operator in programming, symbolizing an enhanced version of C.
              </p>

              <div className="not-prose mb-8">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Target size={20} className="text-primary group-hover:animate-pulse" />
                      </div>
                      <h3 className="text-xl font-bold font-mono group-hover:text-primary transition-colors duration-300">Key Characteristics of C++</h3>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Object-Oriented Programming (OOP) support",
                        "Low-level memory manipulation capabilities",
                        "High performance and efficiency",
                        "Platform independence",
                        "Rich library support"
                      ].map((item, index) => (
                        <li key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-all duration-300 hover:translate-x-2" style={{ animationDelay: `${index * 100}ms` }}>
                          <ChevronRight size={16} className="text-primary" />
                          <span className="text-foreground/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <h2 id="why-learn-c">Why Learn C++?</h2>
              
              <p>
                C++ is an incredibly versatile language that offers several advantages for both beginners and experienced programmers:
              </p>

              <h3>Performance and Efficiency</h3>
              <p>
                C++ is known for its exceptional performance. It compiles to native machine code, making it one of the fastest programming languages available. 
                This makes it ideal for applications where performance is critical, such as game development, system programming, and real-time applications.
              </p>

              <h3>Industry Demand</h3>
              <p>
                C++ consistently ranks among the top programming languages in industry surveys. Major companies like Google, Microsoft, Amazon, 
                and Facebook use C++ extensively in their core systems and applications.
              </p>

              <h2 id="setting-up-your-development-environment">Setting Up Your Development Environment</h2>

              <p>
                Before we start coding, we need to set up a development environment. Here are the most popular options:
              </p>

              <div className="not-prose mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Code::Blocks",
                      description: "Free, cross-platform IDE with built-in compiler",
                      icon: Code2
                    },
                    {
                      title: "Visual Studio",
                      description: "Microsoft's comprehensive development environment",
                      icon: Code2
                    },
                    {
                      title: "Dev-C++",
                      description: "Lightweight IDE perfect for beginners",
                      icon: Code2
                    },
                    {
                      title: "Online Compilers",
                      description: "No installation required, code in your browser",
                      icon: Code2
                    }
                  ].map((option, index) => (
                    <Card key={option.title} className="border-primary/20 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 group" style={{ animationDelay: `${index * 150}ms` }}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                            <option.icon size={20} className="text-primary group-hover:animate-pulse" />
                          </div>
                          <h4 className="font-bold font-mono group-hover:text-primary transition-colors duration-300">{option.title}</h4>
                        </div>
                        <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{option.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <h2 id="your-first-c-program">Your First C++ Program</h2>

              <p>
                Let's start with the traditional "Hello, World!" program. This simple program will help you understand the basic structure of a C++ program:
              </p>

              <div className="relative group mb-8">
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                    cpp
                  </span>
                  <button
                    className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy code"
                  >
                    <ExternalLink size={14} />
                  </button>
                </div>
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto font-mono text-sm hover:border-primary/40 transition-colors duration-300">
                  <code className="language-cpp">
{`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`}
                  </code>
                </pre>
              </div>

              <h3>Understanding the Code</h3>
              <p>Let's break down this simple program line by line:</p>

              <ul>
                <li><strong>#include &lt;iostream&gt;</strong> - This is a preprocessor directive that includes the input/output stream library</li>
                <li><strong>using namespace std;</strong> - This allows us to use standard library functions without prefixing them with "std::"</li>
                <li><strong>int main()</strong> - This is the main function where program execution begins</li>
                <li><strong>cout &lt;&lt; "Hello, World!" &lt;&lt; endl;</strong> - This outputs the text to the console</li>
                <li><strong>return 0;</strong> - This indicates successful program termination</li>
              </ul>

              <h2 id="understanding-basic-syntax">Understanding Basic Syntax</h2>

              <p>
                C++ syntax might seem intimidating at first, but it follows logical patterns. Here are the key elements:
              </p>

              <h3>Case Sensitivity</h3>
              <p>C++ is case-sensitive, meaning "Hello" and "hello" are treated as different identifiers.</p>

              <h3>Semicolons</h3>
              <p>Every statement in C++ must end with a semicolon (;). This tells the compiler where one statement ends and another begins.</p>

              <h3>Comments</h3>
              <p>Comments are used to explain code and are ignored by the compiler:</p>

              <div className="relative group mb-8">
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto font-mono text-sm hover:border-primary/40 transition-colors duration-300">
                  <code className="language-cpp">
{`// This is a single-line comment

/* This is a
   multi-line comment */`}
                  </code>
                </pre>
              </div>

              <h2 id="variables-and-data-types">Variables and Data Types</h2>

              <p>
                Variables are containers that store data values. In C++, you must declare the type of data a variable will hold:
              </p>

              <div className="relative group mb-8">
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto font-mono text-sm hover:border-primary/40 transition-colors duration-300">
                  <code className="language-cpp">
{`int age = 25;           // Integer
float height = 5.9;     // Floating point
char grade = 'A';       // Character
string name = "John";   // String
bool isStudent = true;  // Boolean`}
                  </code>
                </pre>
              </div>

              <h2 id="basic-input-and-output">Basic Input and Output</h2>

              <p>
                C++ uses cin for input and cout for output:
              </p>

              <div className="relative group mb-8">
                <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto font-mono text-sm hover:border-primary/40 transition-colors duration-300">
                  <code className="language-cpp">
{`#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    
    cout << "Enter your name: ";
    getline(cin, name);
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello " << name << ", you are " << age << " years old!" << endl;
    
    return 0;
}`}
                  </code>
                </pre>
              </div>

              <h2 id="next-steps">Next Steps</h2>

              <p>
                Congratulations! You've taken your first steps into C++ programming. In this tutorial, we've covered:
              </p>

              <ul>
                <li>What C++ is and why it's important</li>
                <li>Setting up a development environment</li>
                <li>Writing your first program</li>
                <li>Understanding basic syntax</li>
                <li>Working with variables and data types</li>
                <li>Basic input and output operations</li>
              </ul>

              <div className="not-prose mt-12">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1 group">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Target size={20} className="text-primary group-hover:animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-bold font-mono group-hover:text-primary transition-colors duration-300">What's Next?</h3>
                    </div>
                    <p className="text-lg mb-6 text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      In Part 2 of this series, we'll dive deeper into control structures, functions, and object-oriented programming concepts. 
                      Stay tuned for more advanced C++ programming techniques!
                    </p>
                    <Button className="group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                      Continue Learning
                      <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </article>
          
          {/* Related Posts Section */}
          <div className="mt-20 pt-12 border-t border-gradient-to-r from-transparent via-border to-transparent relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-primary to-accent" />
            
            <h3 className="text-3xl font-bold mb-12 font-mono bg-gradient-to-r from-foreground via-primary to-foreground 
              bg-clip-text text-transparent text-center hover:tracking-wide transition-all duration-300">
              Continue Reading
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Modern C++ Best Practices",
                  excerpt: "Learn the essential best practices for writing clean, efficient, and maintainable C++ code in modern development.",
                  image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=300&fit=crop",
                  slug: "modern-cpp-best-practices",
                  date: "Dec 25, 2024",
                  readTime: "12 min"
                },
                {
                  title: "Java JDBC Best Practices",
                  excerpt: "Master database connectivity in Java with these comprehensive JDBC best practices and optimization techniques.",
                  image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=600&h=300&fit=crop",
                  slug: "java-jdbc-best-practices",
                  date: "Dec 20, 2024",
                  readTime: "10 min"
                }
              ].map((relatedPost, index) => (
                <Link 
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="block group hover:bg-gradient-to-br hover:from-muted/30 hover:to-muted/10 
                    rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 
                    hover:-translate-y-2 border border-border/30 hover:border-primary/40 relative overflow-hidden
                    bg-gradient-to-br from-card/50 to-muted/20 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative shadow-lg">
                    <img 
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-95 group-hover:brightness-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <div className="bg-black/80 backdrop-blur-sm text-white p-2 rounded-full">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors duration-300 font-mono
                    group-hover:tracking-wide leading-tight relative z-10">
                    {relatedPost.title}
                  </h4>
                  <p className="text-muted-foreground text-base line-clamp-2 mb-4 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed relative z-10">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground relative z-10">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 group-hover:bg-muted/60 transition-colors duration-300">
                      <Calendar size={12} className="text-primary" />
                      <span className="font-mono">{relatedPost.date}</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 group-hover:bg-muted/60 transition-colors duration-300">
                      <Clock size={12} className="text-primary" />
                      <span className="font-mono">{relatedPost.readTime}</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CppBasicsForBeginnersPage;
