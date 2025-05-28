
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AdminBlogEditor from "@/components/admin/AdminBlogEditor";
import AdminBlogList from "@/components/admin/AdminBlogList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type View = "dashboard" | "editor" | "list";

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
      const [postsResult, categoriesResult, tagsResult] = await Promise.all([
        supabase.from("admin_blog_posts").select("status", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("tags").select("*", { count: "exact" })
      ]);

      const totalPosts = postsResult.count || 0;
      const publishedPosts = postsResult.data?.filter(p => p.status === "published").length || 0;
      const draftPosts = postsResult.data?.filter(p => p.status === "draft").length || 0;

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalCategories: categoriesResult.count || 0,
        totalTags: tagsResult.count || 0
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
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your blog posts, categories, and content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.publishedPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.draftPosts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCategories || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTags || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks for managing your blog</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleNewPost} className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus size={24} />
              <span>Create New Post</span>
            </Button>
            <Button variant="outline" onClick={() => setCurrentView("list")} className="h-auto p-4 flex flex-col items-center gap-2">
              <Eye size={24} />
              <span>View All Posts</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Tag size={24} />
              <span>Manage Tags & Categories</span>
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
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
