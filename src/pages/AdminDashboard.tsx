
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
import { Plus, FileText, Eye, Tag, Award, Folder, FolderOpen, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import MediaLibrary from "@/components/admin/MediaLibrary";
import TagsManager from "@/components/admin/TagsManager";

type View = "dashboard" | "editor" | "list" | "certificates" | "categories" | "projects" | "work-experience" | "analytics" | "media" | "tags";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const { toast } = useToast();
  const { adminUser, logout } = useAdminAuth();

  useEffect(() => {
    document.title = "Admin Dashboard | Content Management";
  }, []);

  // Fetch stats for dashboard
  const { data: stats } = useQuery({
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

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setEditingPostId(null);
  };

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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-base">
            Welcome back, <span className="font-semibold">{adminUser?.username}</span>! Manage your content, projects, and portfolio.
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} size="sm">
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.publishedPosts || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.draftPosts || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTags || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalProjects || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Work Exp.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.totalWorkExperiences || 0}</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium">Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalCertificates || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText size={20} />
            Quick Actions
          </CardTitle>
          <CardDescription>Manage your blog, projects, and portfolio content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button onClick={handleNewPost} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium shadow-sm">
              <Plus size={22} />
              <span>Create New Post</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("list")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Eye size={22} />
              <span>View All Posts</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("projects")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <FolderOpen size={22} />
              <span>Manage Projects</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("work-experience")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Building2 size={22} />
              <span>Work Experience</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => setCurrentView("certificates")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Award size={22} />
              <span>Manage Certificates</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("categories")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Folder size={22} />
              <span>Manage Categories</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("tags")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Tag size={22} />
              <span>Manage Tags</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("analytics")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <FileText size={22} />
              <span>Analytics</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button variant="outline" onClick={() => setCurrentView("media")} className="h-auto p-4 flex flex-col items-center gap-2 text-sm font-medium">
              <Eye size={22} />
              <span>Media Library</span>
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
      case "certificates":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Certificate Management</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <CertificationManager />
          </div>
        );
      case "categories":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Categories Management</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <CategoriesManager />
          </div>
        );
      case "projects":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Projects Management</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <ProjectsManager />
          </div>
        );
      case "work-experience":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Work Experience Management</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <WorkExperienceManager />
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <AnalyticsPanel />
          </div>
        );
      case "media":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <MediaLibrary />
          </div>
        );
      case "tags":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-bold">Tags Management</h1>
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
            <TagsManager />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
          <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
