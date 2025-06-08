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
import NotesDashboard from "@/components/admin/NotesDashboard";
import AdminAnalytics from "@/components/admin/AnalyticsPanel"; // Add this back
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Eye, Tag, Award, Folder, FolderOpen, Building2, Terminal, Code2, Settings, BookOpen, ExternalLink, BarChart3, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { getNotes } from '@/utils/notesStorage'; // Add for notes stats

type ViewType = "dashboard" | "editor" | "list" | "notes" | "certificates" | "categories" | "projects" | "work-experience" | "analytics";

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [notesStats, setNotesStats] = useState({
    total: 0,
    recentNotes: [] as any[]
  });
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  // Load notes stats
  const loadNotesStats = async () => {
    try {
      const notes = await getNotes();
      const recentNotes = notes.slice(0, 3); // Get last 3 notes
      setNotesStats({
        total: notes.length,
        recentNotes
      });
    } catch (error) {
      console.error('Error loading notes stats:', error);
    }
  };

  useEffect(() => {
    loadNotesStats();
  }, []);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        postsResult,
        categoriesResult,
        tagsResult,
        certificatesResult,
        projectsResult,
        workExperiencesResult
      ] = await Promise.all([
        supabase.from("admin_blog_posts").select("*", { count: "exact" }),
        supabase.from("categories").select("*", { count: "exact" }),
        supabase.from("tags").select("*", { count: "exact" }),
        supabase.from("certificates").select("*", { count: "exact" }),
        supabase.from("projects").select("status", { count: "exact" }),
        supabase.from("work_experiences").select("status", { count: "exact" })
      ]);

      const totalPosts = postsResult.count || 0;
      const publishedPosts = postsResult.data?.filter(p => p.status === "published").length || 0;

      // Get recent posts
      const { data: recentPosts } = await supabase
        .from("admin_blog_posts")
        .select("id, title, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      return {
        totalPosts,
        publishedPosts,
        totalCategories: categoriesResult.count || 0,
        totalTags: tagsResult.count || 0,
        totalCertificates: certificatesResult.count || 0,
        totalProjects: projectsResult.count || 0,
        totalWorkExperiences: workExperiencesResult.count || 0,
        recentPosts: recentPosts || []
      };
    }
  });

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setEditingPostId(null);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setEditingPostId(null);
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setCurrentView("editor");
  };

  const handleNewPost = () => {
    setEditingPostId(null);
    setCurrentView("editor");
  };

  const renderDashboard = () => {
    const quickActions = [
      {
        title: "Write New Post",
        description: "Create a new blog post",
        icon: <Plus size={20} />,
        action: () => handleNewPost(),
        color: "bg-blue-500"
      },
      {
        title: "Manage Posts",
        description: "View and edit existing posts",
        icon: <FileText size={20} />,
        action: () => setCurrentView("list"),
        color: "bg-green-500"
      },
      {
        title: "Manage Notes",
        description: "Create and organize technical notes",
        icon: <BookOpen size={20} />,
        action: () => setCurrentView("notes"),
        color: "bg-purple-500"
      },
      {
        title: "Analytics",
        description: "View site analytics and metrics",
        icon: <BarChart3 size={20} />,
        action: () => setCurrentView("analytics"),
        color: "bg-pink-500"
      },
      {
        title: "Categories & Tags",
        description: "Organize content taxonomy",
        icon: <Tag size={20} />,
        action: () => setCurrentView("categories"),
        color: "bg-orange-500"
      },
      {
        title: "Certificates",
        description: "Manage certifications",
        icon: <Award size={20} />,
        action: () => setCurrentView("certificates"),
        color: "bg-yellow-500"
      },
      {
        title: "Projects",
        description: "Showcase your work",
        icon: <Code2 size={20} />,
        action: () => setCurrentView("projects"),
        color: "bg-red-500"
      },
      {
        title: "Work Experience",
        description: "Professional background",
        icon: <Building2 size={20} />,
        action: () => setCurrentView("work-experience"),
        color: "bg-indigo-500"
      }
    ];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold font-mono mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {adminUser?.username || 'Admin'}! Manage your portfolio content from here.
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards with Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Posts</p>
                      <p className="text-2xl font-bold text-blue-900">{stats?.totalPosts || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">Published blog posts</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 mb-1">Notes</p>
                      <p className="text-2xl font-bold text-purple-900">{notesStats.total}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">Technical notes</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Published</p>
                      <p className="text-2xl font-bold text-green-900">{stats?.publishedPosts || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
                      <Eye className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Live content</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Categories</p>
                      <p className="text-2xl font-bold text-orange-900">{stats?.totalCategories || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
                      <Folder className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-2">Content categories</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-pink-600 mb-1">Projects</p>
                      <p className="text-2xl font-bold text-pink-900">{stats?.totalProjects || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-pink-200 rounded-lg flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-pink-600" />
                    </div>
                  </div>
                  <p className="text-xs text-pink-600 mt-2">Portfolio projects</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal size={20} />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and content management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-md ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Blog Posts</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats?.recentPosts && stats.recentPosts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentPosts.map((post: any) => (
                    <div key={post.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No blog posts yet</p>
                  <Button variant="outline" className="mt-2" onClick={() => setCurrentView("list")}>
                    Create First Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Notes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("notes")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notesStats.recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {notesStats.recentNotes.map((note: any) => (
                    <div key={note.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/notes/${note.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notes yet</p>
                  <Button variant="outline" className="mt-2" onClick={() => setCurrentView("notes")}>
                    Create First Note
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-900">Blog System</p>
                  <p className="text-xs text-green-600">Operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-900">Notes System</p>
                  <p className="text-xs text-green-600">Operational</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Database</p>
                  <p className="text-xs text-blue-600">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-900">Analytics</p>
                  <p className="text-xs text-green-600">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Links - Simple and safe approach */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink size={20} />
              External Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button 
                variant="outline" 
                onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
              >
                View Portfolio
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open("/blog", "_blank", "noopener,noreferrer")}
              >
                View Blog
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.open("/notes", "_blank", "noopener,noreferrer")}
              >
                View Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
                    <BookOpen size={16} className="text-primary" />
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
      case "analytics":
        return (
          <div className="space-y-8">
            <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6 py-6 rounded-lg">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 size={16} className="text-primary" />
                    <span>Performance Tracking</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Analytics Dashboard</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <AdminAnalytics />
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
                    <span>Content Management</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Certificates Management</h1>
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
                    <Tag size={16} className="text-primary" />
                    <span>Content Organization</span>
                  </div>
                  <h1 className="text-3xl font-bold font-mono">Categories & Tags</h1>
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
                    <Code2 size={16} className="text-primary" />
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
                  <h1 className="text-3xl font-bold font-mono">Work Experience</h1>
                </div>
                <Button variant="outline" onClick={handleBackToDashboard} size="sm" className="font-mono">
                  Back to Dashboard
                </Button>
              </div>
            </div>
            <WorkExperienceManager />
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <AdminProtectedRoute>
      <NavBar />
      {/* Add proper top margin/padding for the fixed navbar */}
      <div className="pt-24 pb-16">
        <main className="container py-8 min-h-[80vh]">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </AdminProtectedRoute>
  );
};

export default AdminDashboard;
