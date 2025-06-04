
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface PostsData {
  postsByMonth: Record<string, number>;
  statusCounts: Record<string, number>;
  totalPosts: number;
}

const AnalyticsPanel = () => {
  // Fetch blog posts analytics
  const { data: postsData } = useQuery({
    queryKey: ["analytics-posts"],
    queryFn: async (): Promise<PostsData> => {
      const { data, error } = await supabase
        .from("admin_blog_posts")
        .select("*")
        .order("created_at");
      
      if (error) throw error;
      
      // Process data to count posts by month and calculate total tags usage
      const postsByMonth = data.reduce((acc: Record<string, number>, post) => {
        const month = new Date(post.created_at).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      const statusCounts = data.reduce((acc: Record<string, number>, post) => {
        acc[post.status] = (acc[post.status] || 0) + 1;
        return acc;
      }, {});

      return {
        postsByMonth,
        statusCounts,
        totalPosts: data.length
      };
    }
  });

  // Fetch categories analytics
  const { data: categoriesData = [] } = useQuery({
    queryKey: ["analytics-categories"],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("id, name");
      
      if (catError) throw catError;

      const { data: posts, error: postsError } = await supabase
        .from("admin_blog_posts")
        .select("category_id")
        .not("category_id", "is", null);
      
      if (postsError) throw postsError;

      const categoryCounts = posts.reduce((acc: Record<string, number>, post) => {
        if (post.category_id) {
          acc[post.category_id] = (acc[post.category_id] || 0) + 1;
        }
        return acc;
      }, {});

      return categories.map(cat => ({
        name: cat.name,
        count: categoryCounts[cat.id] || 0
      }));
    }
  });

  // Default data structure
  const defaultPostsData: PostsData = {
    postsByMonth: {},
    statusCounts: {},
    totalPosts: 0
  };

  const currentPostsData = postsData || defaultPostsData;

  // Posts over time chart
  const postsOverTimeData = {
    labels: Object.keys(currentPostsData.postsByMonth).sort(),
    datasets: [
      {
        label: "Posts Created",
        data: Object.keys(currentPostsData.postsByMonth)
          .sort()
          .map(month => currentPostsData.postsByMonth[month]),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const postsOverTimeOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Blog Posts Created Over Time",
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "month" as const,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Status distribution chart
  const statusData = {
    labels: Object.keys(currentPostsData.statusCounts),
    datasets: [
      {
        label: "Posts by Status",
        data: Object.values(currentPostsData.statusCounts),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(251, 191, 36)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Categories distribution chart
  const categoriesChartData = {
    labels: categoriesData.map(cat => cat.name),
    datasets: [
      {
        label: "Posts per Category",
        data: categoriesData.map(cat => cat.count),
        backgroundColor: "rgba(168, 85, 247, 0.8)",
        borderColor: "rgb(168, 85, 247)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Posts Distribution",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPostsData.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentPostsData.statusCounts?.published || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {currentPostsData.statusCounts?.draft || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesData.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={postsOverTimeData} options={postsOverTimeOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={statusData} options={barChartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={categoriesChartData} options={barChartOptions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
