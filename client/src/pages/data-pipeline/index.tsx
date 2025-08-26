import { DataPipelineLayout } from "@/components/layout/DataPipelineLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Database, 
  BarChart,
  Lightbulb,
  FileText,
  Upload,
  ArrowRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function DataPipelineDashboard() {
  // Fetch summary statistics for the dashboard
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['/api/datasets/stats'],
    enabled: true,
  });

  const { data: analyses, isLoading: analysesLoading } = useQuery({
    queryKey: ['/api/analyses/stats'],
    enabled: true,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['/api/insights/stats'],
    enabled: true,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/reports/stats'],
    enabled: true,
  });

  const statsCards = [
    {
      title: "Datasets",
      value: datasets?.count || 0,
      description: "Total datasets in your library",
      icon: Database,
      href: "/data-pipeline/datasets",
      loading: datasetsLoading,
    },
    {
      title: "Analyses",
      value: analyses?.count || 0,
      description: "Total data analyses performed",
      icon: BarChart,
      href: "/data-pipeline/analyses",
      loading: analysesLoading,
    },
    {
      title: "Insights",
      value: insights?.count || 0,
      description: "Generated insights from analyses",
      icon: Lightbulb,
      href: "/data-pipeline/insights",
      loading: insightsLoading,
    },
    {
      title: "Reports",
      value: reports?.count || 0, 
      description: "Compiled reports",
      icon: FileText,
      href: "/data-pipeline/reports",
      loading: reportsLoading,
    },
  ];
  
  return (
    <DataPipelineLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SAAD DataPipeline Dashboard</h1>
        <Link href="/data-pipeline/import">
          <Button className="flex items-center gap-2">
            <Upload size={16} />
            Import Data
          </Button>
        </Link>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Welcome to the SAAD DataPipeline platform. Analyze your datasets, generate insights, and create reports.
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card) => (
          <Card key={card.title} className="border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <card.icon className="h-8 w-8 text-primary" />
                {card.loading ? (
                  <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <CardTitle className="text-lg mb-1">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Link href={card.href}>
                <Button variant="link" className="p-0 h-auto text-primary flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/data-pipeline/import">
          <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-gray-200 dark:border-gray-700">
            <CardHeader>
              <Upload className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Import Data</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Import new datasets from CSV, JSON, or other formats</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/data-pipeline/analyses/new">
          <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-gray-200 dark:border-gray-700">
            <CardHeader>
              <BarChart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Create Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Start a new analysis on your datasets</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/data-pipeline/reports/new">
          <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-gray-200 dark:border-gray-700">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Generate Report</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create a new report from your analyses and insights</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent activity section would go here */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="mr-4 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {index === 0 ? "Created a new analysis" : index === 1 ? "Imported dataset" : "Generated insight"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {index === 0 ? "Sales Trend Analysis" : index === 1 ? "Customer Demographics" : "Market Expansion Recommendation"}
                  </div>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {index === 0 ? "2 hours ago" : index === 1 ? "Yesterday" : "3 days ago"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Activity</Button>
        </CardFooter>
      </Card>
    </DataPipelineLayout>
  );
}