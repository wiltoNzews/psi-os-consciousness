import { useState } from "react";
import { DataPipelineLayout } from "@/components/layout/DataPipelineLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useNavigation } from "@/hooks/use-navigation";
import { 
  Upload, 
  Database, 
  FileText, 
  CloudUpload, 
  CheckCircle2,
  Info,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function ImportDataPage() {
  const [navigate] = useNavigation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState(1);
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      const file = files[0];
      setSelectedFile(file);
      
      // Auto populate name from filename
      const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
      if (!datasetName) {
        setDatasetName(nameWithoutExtension);
      }
    }
  };

  // Import data mutation
  const importMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/datasets/import", formData, null, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      setPreviewData(data.previewData || []);
      setColumnTypes(data.columnTypes || {});
      setUploadStep(2);
      toast({
        title: "Dataset uploaded successfully",
        description: "Your data has been uploaded. Please configure your dataset.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your dataset.",
        variant: "destructive",
      });
    },
  });

  // Configure dataset mutation
  const configureMutation = useMutation({
    mutationFn: async (configData: any) => {
      const response = await apiRequest("POST", `/api/datasets/${configData.datasetId}/configure`, configData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/datasets'] });
      toast({
        title: "Dataset configured successfully",
        description: "Your dataset has been configured and is ready to use.",
      });
      navigate("/data-pipeline/datasets");
    },
    onError: (error) => {
      toast({
        title: "Configuration failed",
        description: error.message || "An error occurred while configuring your dataset.",
        variant: "destructive",
      });
    },
  });

  // Initial upload handler
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', datasetName);
    formData.append('description', datasetDescription);
    formData.append('isPublic', isPublic.toString());

    importMutation.mutate(formData);
  };

  // Handle configuring dataset after upload
  const handleConfigure = (datasetId: number) => {
    configureMutation.mutate({
      datasetId,
      columnTypes,
      columnMappings,
    });
  };

  // Update column type
  const handleColumnTypeChange = (columnName: string, type: string) => {
    setColumnTypes({
      ...columnTypes,
      [columnName]: type,
    });
  };

  // Update column mapping (rename)
  const handleColumnMappingChange = (originalName: string, newName: string) => {
    setColumnMappings({
      ...columnMappings,
      [originalName]: newName,
    });
  };

  // Get file format from name
  const getFileFormat = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return extension || '';
  };

  return (
    <DataPipelineLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Dataset</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Upload and configure your data sources
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-center space-x-2">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${uploadStep >= 1 ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
            1
          </div>
          <div className={`flex-1 h-1 ${uploadStep >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${uploadStep >= 2 ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
            2
          </div>
          <div className={`flex-1 h-1 ${uploadStep >= 3 ? 'bg-primary' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${uploadStep >= 3 ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-10 text-center">Upload</div>
          <div className="w-10 text-center">Configure</div>
          <div className="w-10 text-center">Complete</div>
        </div>
      </div>

      {uploadStep === 1 && (
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Upload Dataset</CardTitle>
            <CardDescription>
              Upload a file to begin. We support CSV, JSON, Excel, and other standard formats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="file">File Upload</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
                <TabsTrigger value="copy">Copy & Paste</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="py-4">
                <div className="grid w-full gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-file" className="text-gray-700 dark:text-gray-300">
                      Select File
                    </Label>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-center">
                      <div className="flex flex-col items-center justify-center">
                        {selectedFile ? (
                          <div className="text-center">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 dark:text-green-400" />
                            <p className="mt-2 text-sm font-semibold">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {getFileFormat(selectedFile.name).toUpperCase()}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedFile(null)}
                              className="mt-2"
                            >
                              Change File
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              CSV, JSON, XLSX up to 50MB
                            </p>
                          </>
                        )}
                        <Input
                          id="dataset-file"
                          type="file"
                          className="hidden"
                          accept=".csv,.json,.xlsx,.xls"
                          onChange={handleFileChange}
                        />
                        {!selectedFile && (
                          <Label 
                            htmlFor="dataset-file" 
                            className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                          >
                            Select File
                          </Label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-name" className="text-gray-700 dark:text-gray-300">
                      Dataset Name
                    </Label>
                    <Input
                      id="dataset-name"
                      placeholder="Enter a name for your dataset"
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-description" className="text-gray-700 dark:text-gray-300">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="dataset-description"
                      placeholder="Enter a description for your dataset"
                      value={datasetDescription}
                      onChange={(e) => setDatasetDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <Label htmlFor="is-public" className="text-gray-700 dark:text-gray-300">
                      Make this dataset public
                    </Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="url" className="py-4">
                <div className="grid w-full gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-url" className="text-gray-700 dark:text-gray-300">
                      Data URL
                    </Label>
                    <Input
                      id="dataset-url"
                      placeholder="https://example.com/data.csv"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the URL of a publicly accessible data file
                    </p>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-name-url" className="text-gray-700 dark:text-gray-300">
                      Dataset Name
                    </Label>
                    <Input
                      id="dataset-name-url"
                      placeholder="Enter a name for your dataset"
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-description-url" className="text-gray-700 dark:text-gray-300">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="dataset-description-url"
                      placeholder="Enter a description for your dataset"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="is-public-url" />
                    <Label htmlFor="is-public-url" className="text-gray-700 dark:text-gray-300">
                      Make this dataset public
                    </Label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="copy" className="py-4">
                <div className="grid w-full gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-content" className="text-gray-700 dark:text-gray-300">
                      Paste Data
                    </Label>
                    <Textarea
                      id="dataset-content"
                      placeholder="Paste CSV, JSON, or tabular data here"
                      rows={10}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Paste data from a spreadsheet or text file
                    </p>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-name-paste" className="text-gray-700 dark:text-gray-300">
                      Dataset Name
                    </Label>
                    <Input
                      id="dataset-name-paste"
                      placeholder="Enter a name for your dataset"
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="dataset-description-paste" className="text-gray-700 dark:text-gray-300">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="dataset-description-paste"
                      placeholder="Enter a description for your dataset"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="is-public-paste" />
                    <Label htmlFor="is-public-paste" className="text-gray-700 dark:text-gray-300">
                      Make this dataset public
                    </Label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/data-pipeline/datasets")}>Cancel</Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || !datasetName || importMutation.isPending}
              className="flex items-center gap-2"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> 
                  Uploading ({uploadProgress}%)
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4" /> 
                  Upload Dataset
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {uploadStep === 2 && previewData.length > 0 && (
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Configure Dataset</CardTitle>
            <CardDescription>
              Preview your data and configure column types and mappings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-800">
                        {Object.keys(previewData[0] || {}).map((column) => (
                          <th key={column} className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                            <div className="flex flex-col space-y-1">
                              <Input 
                                className="h-8 text-xs" 
                                defaultValue={column}
                                placeholder="Column name" 
                                onChange={(e) => handleColumnMappingChange(column, e.target.value)}
                              />
                              <select 
                                className="text-xs h-8 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1"
                                defaultValue={columnTypes[column] || 'string'}
                                onChange={(e) => handleColumnTypeChange(column, e.target.value)}
                              >
                                <option value="string">Text</option>
                                <option value="number">Number</option>
                                <option value="boolean">Boolean</option>
                                <option value="date">Date</option>
                                <option value="json">JSON</option>
                              </select>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-200 dark:border-gray-700">
                          {Object.entries(row).map(([key, value], colIndex) => (
                            <td key={`${rowIndex}-${colIndex}`} className="px-4 py-2 text-gray-700 dark:text-gray-300">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Showing preview of first 5 rows out of {previewData.length} total rows
                </div>
              </div>

              <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Column Configuration</p>
                  <p className="mt-1">
                    You can rename columns by modifying the input fields and set the appropriate data type for each column.
                    The system has automatically detected the data types, but you can change them if needed.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setUploadStep(1)}>Back</Button>
            <Button 
              onClick={() => setUploadStep(3)} 
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> 
              Save Configuration
            </Button>
          </CardFooter>
        </Card>
      )}

      {uploadStep === 3 && (
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Dataset Import Complete
            </CardTitle>
            <CardDescription>
              Your dataset has been successfully imported and configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-green-800 dark:text-green-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Import Successful</p>
                  <p className="mt-1 text-sm">
                    Your dataset "{datasetName}" has been successfully imported with {previewData.length} rows and {Object.keys(previewData[0] || {}).length} columns.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dataset Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-gray-900 dark:text-white">{datasetName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Format</p>
                  <p className="text-gray-900 dark:text-white">{selectedFile ? getFileFormat(selectedFile.name).toUpperCase() : 'CSV'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rows</p>
                  <p className="text-gray-900 dark:text-white">{previewData.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Columns</p>
                  <p className="text-gray-900 dark:text-white">{Object.keys(previewData[0] || {}).length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</p>
                  <p className="text-gray-900 dark:text-white">{isPublic ? 'Public' : 'Private'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date Imported</p>
                  <p className="text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Next Steps</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <BarChart className="h-5 w-5 text-primary" />
                  Create an analysis with your new dataset
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Database className="h-5 w-5 text-primary" />
                  View and manage all your datasets
                </li>
                <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FileText className="h-5 w-5 text-primary" />
                  Generate a report from your insights
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/data-pipeline/datasets")}>
              View All Datasets
            </Button>
            <Button onClick={() => navigate("/data-pipeline/analyses/new")}>
              Create Analysis
            </Button>
          </CardFooter>
        </Card>
      )}
    </DataPipelineLayout>
  );
}