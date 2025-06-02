import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AnalyticsPanel = () => {
  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ["analytics-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*");
      if (error) throw error;
      return data || [];
    }
  });

  const totalPosts = posts?.length || 0;
  const publishedPosts = posts?.filter(p => p.status === "published").length || 0;
  const draftPosts = posts?.filter(p => p.status === "draft").length || 0;
  const totalReadTime = posts?.reduce((acc, p) => acc + (p.read_time || 0), 0) || 0;

  // Calculate top tags
  const tagCounts: Record<string, number> = {};
  (posts || []).forEach(post => {
    (typeof post.tags === "string" ? post.tags.split(",") : post.tags || []).forEach(tag => {
      tagCounts[tag.trim()] = (tagCounts[tag.trim()] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate posts per month
  const postsPerMonth: Record<string, number> = {};
  (posts || []).forEach(post => {
    const month = format(new Date(post.published_date || post.created_at), "yyyy-MM");
    postsPerMonth[month] = (postsPerMonth[month] || 0) + 1;
  });
  const months = Object.keys(postsPerMonth).sort();
  const counts = months.map(month => postsPerMonth[month]);

  if (loadingPosts) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }
  if (!posts) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{publishedPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">{draftPosts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Read Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalReadTime} min</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {topTags.length === 0 ? (
            <div className="text-muted-foreground">No tags found.</div>
          ) : (
            <ul>
              {topTags.map(([tag, count]) => (
                <li key={tag} className="flex justify-between">
                  <span>{tag}</span>
                  <span className="font-mono">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Posts Per Month</CardTitle>
        </CardHeader>
        <CardContent>
          {months.length === 0 ? (
            <div className="text-muted-foreground">No data yet.</div>
          ) : (
            <div style={{ height: 300 }}>
              <Bar
                data={{
                  labels: months,
                  datasets: [{ label: "Posts", data: counts, backgroundColor: "#6366f1" }]
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, precision: 0 } }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;