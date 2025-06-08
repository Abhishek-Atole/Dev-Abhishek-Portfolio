import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminBlogEditor from "@/components/admin/AdminBlogEditor";
import AdminBlogList from "@/components/admin/AdminBlogList";
import CertificationManager from "@/components/admin/CertificationManager";
import CategoriesManager from "@/components/admin/CategoriesManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import WorkExperienceManager from "@/components/admin/WorkExperienceManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Tag, Award, Folder, FolderOpen, Building2, Terminal, Code2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import MediaLibrary from "@/components/admin/MediaLibrary";
import TagsManager from "@/components/admin/TagsManager";
import { Badge } from "@/components/ui/badge";
import NotesDashboard from "@/components/admin/NotesDashboard";

type View = "dashboard" | "editor" | "list" | "certificates" | "categories" | "projects" | "work-experience" | "analytics" | "media" | "tags" | "notes";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const { toast } = useToast();
  const { adminUser, logout } = useAdminAuth();

  useEffect(() => {
    document.title = "Admin Dashboard | Content Management";
  }, []);

  // Fetch stats for dashboard
  const { data: stats, error: statsError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [postsResult, categoriesResult, tagsResult, certificatesResult, projectsResult, workExperiencesResult] = await Promise.all([
        supabase.from("admin_blog_posts").select("status", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("tags").select("*", { count: "exact" }),
        supabase.from("certificates").select("*", { count: "exact" }),
        supabase.from("projects").select("status", { count: "exact" }),
        supabase.from("work_experiences").select("status", { count: "exact" })
      ]);

      const totalPosts = postsResult.count || 0;
      const publishedPosts = postsResult.data?.filter(p => p.status === "published").length || 0;
      const draftPosts = postsResult.data?.filter(p => p.status === "draft").length || 0;

      const totalProjects = projectsResult.count || 0;
      const publishedProjects = projectsResult.data?.filter(p => p.status === "published").length || 0;

      const totalWorkExperiences = workExperiencesResult.count || 0;
      const publishedWorkExperiences = workExperiencesResult.data?.filter(p => p.status === "published").length || 0;

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories: categoriesResult.count || 0,
        totalTags: tagsResult.count || 0,
        totalCertificates: certificatesResult.count || 0,
        totalProjects,
        publishedProjects,
        totalWorkExperiences,
        publishedWorkExperiences
      };
    }
  });

  const handleNewPost = () => {
    setEditingPostId(null);
    setCurrentView("editor");
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setCurrentView("editor");
  };

  const handleBackToDashboard = () => setCurrentView("dashboard");

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingPostId(null);
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-8 rounded-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Terminal size={16} className="text-primary" />
                <span>Admin Interface</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Content Management
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Welcome back, <span className="font-semibold text-primary">{adminUser?.username}</span>! 
              Manage your portfolio content, blog posts, and projects from this centralized dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="text-xs px-3 py-1">
              <Code2 size={12} className="mr-1" />
              Admin Panel
            </Badge>
            <Button variant="outline" onClick={handleLogout} size="sm" className="font-mono">
              <Settings size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Code2 size={20} className="text-primary" />
          <h2 className="text-2xl font-bold font-mono">Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats?.totalPosts || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 font-mono">{stats?.publishedPosts || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 font-mono">{stats?.draftPosts || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats?.totalCategories || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats?.totalTags || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 font-mono">{stats?.totalProjects || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Work Exp.</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 font-mono">{stats?.totalWorkExperiences || 0}</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary font-mono">{stats?.totalCertificates || 0}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="border-border bg-gradient-to-r from-card to-primary/5 shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="flex items-center gap-3 text-xl">
            <Terminal size={20} className="text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-base">
            Manage your blog, projects, and portfolio content with these shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Content Management Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-primary" />
              <h3 className="font-semibold text-lg font-mono">Content Management</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button 
                onClick={handleNewPost} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium shadow-sm bg-primary hover:bg-primary/90 font-mono"
              >
                <Plus size={24} />
                <span>Create New Post</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("list")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Eye size={24} />
                <span>View All Posts</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("notes")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <FileText size={24} />
                <span>Manage Notes</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("projects")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <FolderOpen size={24} />
                <span>Manage Projects</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("work-experience")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Building2 size={24} />
                <span>Work Experience</span>
              </Button>
            </div>
          </div>

          {/* Portfolio Management Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-primary" />
              <h3 className="font-semibold text-lg font-mono">Portfolio Management</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("certificates")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Award size={24} />
                <span>Manage Certificates</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("categories")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Folder size={24} />
                <span>Manage Categories</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("tags")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Tag size={24} />
                <span>Manage Tags</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("media")} 
                className="h-auto p-6 flex flex-col items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
              >
                <Eye size={24} />
                <span>Media Library</span>
              </Button>
            </div>
          </div>

          {/* Analytics Action */}
          <div className="pt-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView("analytics")} 
              className="w-full sm:w-auto h-auto p-6 flex items-center gap-3 text-sm font-medium hover:bg-muted/50 font-mono"
            >
              <FileText size={24} />
              <span>View Analytics Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "editor":
        return (
          <AdminBlogEditor
            postId={editingPostId || undefined}
            onBack={currentView === "editor" && editingPostId ? handleBackToList : handleBackToDashboard}
          />
        );
      case "list":
        return (
          <AdminBlogList
            onEditPost={handleEditPost}
            onNewPost={handleNewPost}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case "notes":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText size={16} className="text-primary" />
                    <span>Content Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Notes Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <NotesDashboard onBack={handleBackToDashboard} />
          </div>
        );
      case "certificates":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award size={16} className="text-primary" />
                    <span>Portfolio Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Certificate Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <CertificationManager />
          </div>
        );
      case "categories":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Folder size={16} className="text-primary" />
                    <span>Content Organization</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Categories Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <CategoriesManager />
          </div>
        );
      case "projects":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderOpen size={16} className="text-primary" />
                    <span>Portfolio Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Projects Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <ProjectsManager />
          </div>
        );
      case "work-experience":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 size={16} className="text-primary" />
                    <span>Career Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Work Experience Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <WorkExperienceManager />
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText size={16} className="text-primary" />
                    <span>Data Insights</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Analytics Dashboard</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <AnalyticsPanel />
          </div>
        );
      case "media":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye size={16} className="text-primary" />
                    <span>Asset Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Media Library</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <MediaLibrary />
          </div>
        );
      case "tags":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag size={16} className="text-primary" />
                    <span>Content Organization</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Tags Management</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <TagsManager />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  if (statsError) {
    return (
      <div className="p-8 text-red-600 font-mono">
        Failed to load dashboard stats: {statsError.message}
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <NavBar />
      <main className="container py-8 min-h-[80vh]">
        {renderContent()}
      </main>
      <Footer />
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
