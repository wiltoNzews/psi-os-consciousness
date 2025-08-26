import { useState, useEffect } from "react";
import { DataPipelineLayout } from "@/components/layout/DataPipelineLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useNavigation } from "@/hooks/use-navigation";
import { 
  BarChart,
  ChevronLeft,
  Database,
  LineChart,
  Lightbulb,
  Clock,
  ArrowRight,
  ZoomIn,
  PieChart,
  TrendingUp,
  Target,
  FileDown,
  Loader2
} from "lucide-react";

export default function NewAnalysisPage() {
  const [navigate, location] = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get datasetId from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const datasetIdParam = params.get('datasetId');
  
  // Form state
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(datasetIdParam ? parseInt(datasetIdParam) : null);
  const [analysisName, setAnalysisName] = useState("");
  const [analysisDescription, setAnalysisDescription] = useState("");
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [maxInsights, setMaxInsights] = useState(5);
  const [includeVisualizations, setIncludeVisualizations] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch datasets
  const { data: datasets, isLoading: datasetsLoading } = useQuery({
    queryKey: ['/api/datasets'],
    enabled: true,
  });
  
  // Fetch selected dataset details including columns
  const { data: selectedDataset, isLoading: datasetDetailsLoading } = useQuery({
    queryKey: ['/api/datasets', selectedDatasetId],
    enabled: !!selectedDatasetId,
  });

  // Generate a default analysis name based on the selected dataset
  useEffect(() => {
    if (selectedDataset && !analysisName) {
      const datasetName = selectedDataset.name || `Dataset ${selectedDataset.id}`;
      setAnalysisName(`${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis of ${datasetName}`);
    }
  }, [selectedDataset, analysisType, analysisName]);
  
  // Update analysis name when analysis type changes
  useEffect(() => {
    if (selectedDataset) {
      const datasetName = selectedDataset.name || `Dataset ${selectedDataset.id}`;
      setAnalysisName(`${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis of ${datasetName}`);
    }
  }, [analysisType, selectedDataset]);

  // Analysis creation mutation
  const createAnalysisMutation = useMutation({
    mutationFn: async (analysisData: any) => {
      setIsSubmitting(true);
      const response = await apiRequest("POST", "/api/analyses", analysisData);
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
      toast({
        title: "Analysis created successfully",
        description: "Your analysis is now processing. You can view the results once it completes.",
      });
      navigate(`/data-pipeline/analyses/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create analysis",
        description: error.message || "An error occurred while creating your analysis.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDatasetId) {
      toast({
        title: "Dataset required",
        description: "Please select a dataset to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    const analysisData = {
      datasetId: selectedDatasetId,
      name: analysisName,
      description: analysisDescription,
      analysisType,
      options: {
        confidenceThreshold: confidenceThreshold / 100, // Convert to 0-1 range
        maxInsights,
        includeVisualizations,
        focusColumns: selectedColumns.length > 0 ? selectedColumns : undefined,
      }
    };
    
    createAnalysisMutation.mutate(analysisData);
  };

  // Toggle column selection
  const toggleColumnSelection = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column) 
        : [...prev, column]
    );
  };

  // Analysis type options with descriptions and icons
  const analysisTypes = [
    {
      id: "comprehensive",
      name: "Comprehensive",
      description: "A complete analysis covering trends, patterns, and insights",
      icon: BarChart
    },
    {
      id: "summary",
      name: "Summary",
      description: "A high-level overview of the key data characteristics",
      icon: FileDown
    },
    {
      id: "trends",
      name: "Trends",
      description: "Identify trends and patterns over time periods",
      icon: LineChart
    },
    {
      id: "correlations",
      name: "Correlations",
      description: "Discover relationships between different data variables",
      icon: Target
    },
    {
      id: "clustering",
      name: "Clustering",
      description: "Group similar data points to identify segments",
      icon: PieChart
    },
    {
      id: "anomalies",
      name: "Anomalies",
      description: "Detect outliers and unusual patterns in your data",
      icon: TrendingUp
    },
  ];

  return (
    <DataPipelineLayout>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/data-pipeline/analyses")}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Analysis</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze your data to discover insights and patterns
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide details about your analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="dataset" className="text-gray-700 dark:text-gray-300">
                    Dataset
                  </Label>
                  <Select 
                    value={selectedDatasetId?.toString()} 
                    onValueChange={(value) => setSelectedDatasetId(parseInt(value))}
                    disabled={!!datasetIdParam}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a dataset to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      {datasetsLoading ? (
                        <div className="flex items-center justify-center py-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading datasets...
                        </div>
                      ) : datasets?.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">
                          No datasets available. Please import a dataset first.
                        </div>
                      ) : (
                        datasets?.map((dataset) => (
                          <SelectItem key={dataset.id} value={dataset.id.toString()}>
                            {dataset.name || `Dataset ${dataset.id}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Analysis Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter a name for your analysis"
                    value={analysisName}
                    onChange={(e) => setAnalysisName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose of this analysis"
                    value={analysisDescription}
                    onChange={(e) => setAnalysisDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Analysis Type */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Analysis Type</CardTitle>
                <CardDescription>
                  Select the type of analysis to perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={analysisType} 
                  onValueChange={setAnalysisType}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {analysisTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div key={type.id} className="relative">
                        <RadioGroupItem
                          value={type.id}
                          id={`type-${type.id}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`type-${type.id}`}
                          className={`flex flex-col border rounded-lg p-4 cursor-pointer transition-colors
                            ${analysisType === type.id 
                              ? "border-primary bg-primary/5" 
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full p-2 ${analysisType === type.id ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {type.name}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {type.description}
                          </p>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Analysis Options */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Analysis Options</CardTitle>
                <CardDescription>
                  Configure advanced settings for your analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Confidence Threshold
                    </Label>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {confidenceThreshold}%
                    </span>
                  </div>
                  <Slider
                    value={[confidenceThreshold]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setConfidenceThreshold(value[0])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only include insights with confidence above this threshold
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Maximum Insights
                    </Label>
                    <Input
                      type="number"
                      value={maxInsights}
                      onChange={(e) => setMaxInsights(parseInt(e.target.value) || 5)}
                      min={1}
                      max={20}
                      className="w-20 h-8"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The maximum number of insights to generate
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">
                      Include Visualizations
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generate charts and visualizations for insights
                    </p>
                  </div>
                  <Switch
                    checked={includeVisualizations}
                    onCheckedChange={setIncludeVisualizations}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Column Selection */}
            {selectedDataset && selectedDataset.columns && selectedDataset.columns.length > 0 && (
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle>Column Selection</CardTitle>
                  <CardDescription>
                    Select specific columns to focus on (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedColumns(selectedDataset.columns.map(col => col.name))}
                      >
                        Select All
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedColumns([])}
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedDataset.columns.map((column) => (
                        <div 
                          key={column.id} 
                          className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors
                            ${selectedColumns.includes(column.name) 
                              ? "border-primary bg-primary/5" 
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          onClick={() => toggleColumnSelection(column.name)}
                        >
                          <Checkbox 
                            checked={selectedColumns.includes(column.name)}
                            onCheckedChange={() => toggleColumnSelection(column.name)}
                            id={`column-${column.id}`}
                          />
                          <div className="grid gap-1">
                            <Label 
                              htmlFor={`column-${column.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {column.name}
                            </Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {column.type || 'string'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {selectedColumns.length === 0 
                        ? "Using all columns for analysis" 
                        : `Analyzing ${selectedColumns.length} selected columns`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle>Ready to Analyze</CardTitle>
                <CardDescription>
                  Start your data analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Dataset</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedDataset ? (selectedDataset.name || `Dataset ${selectedDataset.id}`) : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Analysis Type</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {analysisType}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Confidence</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {confidenceThreshold}%
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full flex items-center gap-2"
                    disabled={!selectedDatasetId || !analysisName || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">About OpenAI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                <p>
                  This analysis uses OpenAI's advanced models to uncover insights in your data. The analysis process:
                </p>
                <div className="pl-4 space-y-2">
                  <div className="flex gap-2">
                    <ZoomIn className="h-4 w-4 text-primary mt-0.5" />
                    <p>Examines data patterns and relationships</p>
                  </div>
                  <div className="flex gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <p>Generates actionable insights based on findings</p>
                  </div>
                  <div className="flex gap-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5" />
                    <p>Analysis time depends on dataset size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DataPipelineLayout>
  );
}