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
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "@/lib/utils";
import { 
  BarChart, 
  Plus,
  Search,
  MoreVertical,
  Lightbulb,
  Trash,
  Eye,
  Copy,
  FileText,
  Filter,
  PieChart,
  LineChart,
  ArrowDownUp,
  TrendingUp
} from "lucide-react";

export default function AnalysesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch analyses
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['/api/analyses'],
    enabled: true,
  });

  const filteredAnalyses = analyses?.filter(analysis => 
    analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Get appropriate icon for analysis type
  const getAnalysisIcon = (analysisType: string) => {
    switch (analysisType.toLowerCase()) {
      case 'summary':
        return FileText;
      case 'trends':
        return LineChart;
      case 'correlations':
        return ArrowDownUp;
      case 'clustering':
        return PieChart;
      case 'anomalies':
        return TrendingUp;
      default:
        return BarChart;
    }
  };

  return (
    <DataPipelineLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analyses</h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage your data analyses
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/data-pipeline/analyses/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search analyses..."
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
            <DropdownMenuLabel>Filter Analyses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Summary Analyses
            </DropdownMenuItem>
            <DropdownMenuItem>
              Trend Analyses
            </DropdownMenuItem>
            <DropdownMenuItem>
              Correlation Analyses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Created This Week
            </DropdownMenuItem>
            <DropdownMenuItem>
              Created This Month
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Analyses table */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your Analyses</CardTitle>
          <CardDescription>
            {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'analysis' : 'analyses'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAnalyses.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <BarChart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No analyses found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new analysis of your datasets.
              </p>
              <div className="mt-6">
                <Link href="/data-pipeline/analyses/new">
                  <Button>Create Analysis</Button>
                </Link>
              </div>
            </div>
          ) : (
            // Analyses table
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnalyses.map((analysis) => {
                    const AnalysisIcon = getAnalysisIcon(analysis.analysisType);
                    return (
                      <TableRow key={analysis.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <AnalysisIcon className="h-4 w-4 text-gray-500" />
                            <span>{analysis.name}</span>
                          </div>
                          {analysis.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                              {analysis.description}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{analysis.analysisType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/data-pipeline/datasets/${analysis.datasetId}`}>
                            <span className="text-primary cursor-pointer hover:underline">
                              {analysis.datasetName || `Dataset ${analysis.datasetId}`}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDistanceToNow(new Date(analysis.createdAt))}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={analysis.status === 'completed' ? "default" : analysis.status === 'running' ? "secondary" : "outline"}
                            className={
                              analysis.status === 'completed' 
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" 
                                : analysis.status === 'running'
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                : analysis.status === 'failed'
                                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                                : ""
                            }
                          >
                            {analysis.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
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
                              <Link href={`/data-pipeline/analyses/${analysis.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Results
                                </DropdownMenuItem>
                              </Link>
                              <Link href={`/data-pipeline/insights/new?analysisId=${analysis.id}`}>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Lightbulb className="mr-2 h-4 w-4" />
                                  Generate Insights
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate Analysis
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredAnalyses.length > 0 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredAnalyses.length} of {analyses?.length || 0} analyses
            </div>
          </CardFooter>
        )}
      </Card>
    </DataPipelineLayout>
  );
}