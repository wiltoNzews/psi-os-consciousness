import { useState } from "react";
import { DataPipelineLayout } from "@/components/layout/DataPipelineLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "@/lib/utils";
import { 
  Lightbulb,
  Plus,
  Search,
  MoreVertical,
  Trash,
  FileText,
  Eye,
  Filter,
  Star,
  Share2,
  Bookmark,
  LineChart,
  BarChart,
  Clock
} from "lucide-react";

export default function InsightsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch insights
  const { data: insights, isLoading } = useQuery({
    queryKey: ['/api/insights'],
    enabled: true,
  });

  const filteredInsights = insights?.filter(insight => 
    insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    insight.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DataPipelineLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover valuable insights from your data analyses
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/data-pipeline/insights/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Generate Insights
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search insights..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Insights</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              High Impact
            </DropdownMenuItem>
            <DropdownMenuItem>
              High Confidence
            </DropdownMenuItem>
            <DropdownMenuItem>
              Bookmarked
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Generated This Week
            </DropdownMenuItem>
            <DropdownMenuItem>
              Generated This Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Insights cards */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredInsights.length === 0 ? (
          // Empty state
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="pt-6 text-center">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No insights found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Generate insights from your analyses to discover meaningful patterns and trends.
              </p>
              <div className="mt-6">
                <Link href="/data-pipeline/insights/new">
                  <Button>Generate Insights</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Insights cards list
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInsights.map((insight) => (
              <Card key={insight.id} className="border-gray-200 dark:border-gray-700 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex gap-2 items-center">
                        <Lightbulb className="h-5 w-5 text-amber-500" />
                        {insight.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        From analysis: {insight.analysisName || `Analysis ${insight.analysisId}`}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/data-pipeline/insights/${insight.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/data-pipeline/reports/new?insightId=${insight.id}`}>
                          <DropdownMenuItem className="cursor-pointer">
                            <FileText className="mr-2 h-4 w-4" />
                            Add to Report
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Insight
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bookmark className="mr-2 h-4 w-4" />
                          Bookmark
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {insight.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Confidence
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={insight.confidence * 100} className="h-2" />
                        <span className="text-sm font-medium">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Impact
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={insight.impact * 100} className="h-2" />
                        <span className="text-sm font-medium">
                          {Math.round(insight.impact * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {insight.category || 'General'}
                    </Badge>
                    {insight.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {insight.tags && insight.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{insight.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(insight.createdAt))}
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.visualizationSuggestion && (
                      <div className="flex items-center gap-1">
                        {insight.visualizationSuggestion.type === 'bar' ? 
                          <BarChart className="h-3 w-3" /> : 
                          <LineChart className="h-3 w-3" />
                        }
                        <span>Visualization available</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DataPipelineLayout>
  );
}