
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedDate: string;
  readTime: number;
  coverImage: string;
  tags: string[];
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with C++ Development",
    excerpt: "Learn the fundamentals of C++ programming and set up your development environment.",
    slug: "getting-started-cpp-development",
    publishedDate: "2024-01-15",
    readTime: 8,
    coverImage: "/placeholder.svg",
    tags: ["C++", "Programming", "Tutorial"],
    content: `
# Getting Started with C++ Development

C++ is a powerful programming language that has been a cornerstone of software development for decades...

## Setting Up Your Environment

Before you can start coding in C++, you'll need to set up your development environment...

## Your First C++ Program

Let's start with the classic "Hello, World!" program...

## Conclusion

This is just the beginning of your C++ journey...
    `
  }
];
