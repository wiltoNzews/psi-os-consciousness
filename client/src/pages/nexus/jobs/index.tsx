import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Plus, 
  RefreshCw, 
  Filter, 
  ArrowLeft,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JobsTable } from '@/components/nexus/JobsTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function JobsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  
  // Fetch jobs data
  const { 
    data, 
    isLoading,
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['/api/nexus/jobs'],
    refetchInterval: 30000, // 30 seconds
  });
  
  // Filter and sort jobs based on user selections
  const getFilteredJobs = () => {
    if (!data?.jobs) return [];
    
    let filteredJobs = [...data.jobs];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === statusFilter);
    }
    
    // Apply search query filter (case insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.name.toLowerCase().includes(query) || 
        job.description?.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filteredJobs.sort((a, b) => {
      // Ensure we have valid dates to compare
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      
      // Sort by date
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    return filteredJobs;
  };
  
  // Handle refresh action
  const handleRefresh = () => {
    refetch();
  };
  
  // Get job statistics
  const getJobStats = () => {
    if (!data?.jobs) return { total: 0, completed: 0, pending: 0, failed: 0 };
    
    return {
      total: data.jobs.length,
      completed: data.jobs.filter(job => job.status === 'completed').length,
      pending: data.jobs.filter(job => job.status === 'pending' || job.status === 'in_progress').length,
      failed: data.jobs.filter(job => job.status === 'failed').length
    };
  };
  
  const stats = getJobStats();
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/nexus">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NEXUS Jobs</h1>
            <p className="text-muted-foreground">
              Manage and monitor your OROBORO NEXUS processing tasks
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Link href="/nexus/new-job">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Job Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Pending/Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortOrder}
            onValueChange={setSortOrder}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0 sm:p-6">
          <JobsTable
            jobs={getFilteredJobs()}
            isLoading={isLoading}
            showPagination={true}
          />
          
          {isError && (
            <div className="p-6 text-center text-red-500">
              <p>Error loading jobs: {error instanceof Error ? error.message : 'Unknown error'}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
          
          {data?.jobs && data.jobs.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>No jobs found. Create your first NEXUS job to get started.</p>
              <Link href="/nexus/new-job">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </Link>
            </div>
          )}
          
          {data?.jobs && data.jobs.length > 0 && getFilteredJobs().length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>No jobs match your search criteria. Adjust filters or try a different search term.</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}