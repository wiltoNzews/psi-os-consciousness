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
import { 
  Database, 
  Plus,
  Search,
  MoreVertical,
  BarChart,
  Trash,
  Download,
  Eye,
  Edit,
  FileDown,
  Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "@/lib/utils";

export default function DatasetsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch datasets
  const { data: datasets, isLoading } = useQuery({
    queryKey: ['/api/datasets'],
    enabled: true,
  });

  const filteredDatasets = datasets?.filter(dataset => 
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <DataPipelineLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Datasets</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your datasets and data sources
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/data-pipeline/import">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Import Dataset
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search datasets..."
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
            <DropdownMenuLabel>Filter Datasets</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Public Datasets
            </DropdownMenuItem>
            <DropdownMenuItem>
              Private Datasets
            </DropdownMenuItem>
            <DropdownMenuItem>
              Created by Me
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

      {/* Datasets table */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Your Datasets</CardTitle>
          <CardDescription>
            {filteredDatasets.length} {filteredDatasets.length === 1 ? 'dataset' : 'datasets'} available
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
          ) : filteredDatasets.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No datasets found</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by importing a new dataset or creating one from scratch.
              </p>
              <div className="mt-6">
                <Link href="/data-pipeline/import">
                  <Button>Import Dataset</Button>
                </Link>
              </div>
            </div>
          ) : (
            // Datasets table
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Name</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDatasets.map((dataset) => (
                    <TableRow key={dataset.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-500" />
                          <span>{dataset.name}</span>
                        </div>
                        {dataset.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[280px]">
                            {dataset.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dataset.format || 'CSV'}</Badge>
                      </TableCell>
                      <TableCell>
                        {dataset.rowCount || 0} rows
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDistanceToNow(new Date(dataset.createdAt))}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={dataset.isPublic ? "default" : "secondary"}
                          className={dataset.isPublic ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100" : ""}
                        >
                          {dataset.isPublic ? "Public" : "Private"}
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
                            <Link href={`/data-pipeline/datasets/${dataset.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <Link href={`/data-pipeline/analyses/new?datasetId=${dataset.id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <BarChart className="mr-2 h-4 w-4" />
                                Create Analysis
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Dataset
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileDown className="mr-2 h-4 w-4" />
                              Export Data
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredDatasets.length > 0 && (
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredDatasets.length} of {datasets?.length || 0} datasets
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </CardFooter>
        )}
      </Card>
    </DataPipelineLayout>
  );
}