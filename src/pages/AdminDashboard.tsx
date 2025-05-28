
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminBlogEditor from "@/components/admin/AdminBlogEditor";
import AdminBlogList from "@/components/admin/AdminBlogList";
import CertificationManager from "@/components/admin/CertificationManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Tag, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type View = "dashboard" | "editor" | "list" | "certificates";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Admin Dashboard | Blog Management";
  }, []);

  // Fetch stats for dashboard
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [postsResult, categoriesResult, tagsResult, certificatesResult] = await Promise.all([
        supabase.from("admin_blog_posts").select("status", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("tags").select("*", { count: "exact" }),
        supabase.from("certificates").select("*", { count: "exact" })
      ]);

      const totalPosts = postsResult.count || 0;
      const publishedPosts = postsResult.data?.filter(p => p.status === "published").length || 0;
      const draftPosts = postsResult.data?.filter(p => p.status === "draft").length || 0;

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories: categoriesResult.count || 0,
        totalTags: tagsResult.count || 0,
        totalCertificates: certificatesResult.count || 0
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

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your blog posts, categories, and content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">{stats?.publishedPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{stats?.draftPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats?.totalCategories || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats?.totalTags || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.totalCertificates || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText size={20} />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks for managing your blog and portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button onClick={handleNewPost} className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Plus size={20} className="sm:w-6 sm:h-6" />
              <span>Create New Post</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("list")} className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Eye size={20} className="sm:w-6 sm:h-6" />
              <span>View All Posts</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("certificates")} className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Award size={20} className="sm:w-6 sm:h-6" />
              <span>Manage Certificates</span>
            </Button>
            <Button variant="outline" className="h-auto p-3 sm:p-4 flex flex-col items-center gap-2 text-sm">
              <Tag size={20} className="sm:w-6 sm:h-6" />
              <span>Manage Tags</span>
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
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
