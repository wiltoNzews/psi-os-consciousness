import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Define NexusProfile locally to avoid import issues
enum NexusProfile {
  BALANCED = 'balanced',
  MAXIMUM_PERFORMANCE = 'maximum_performance',
  MAXIMUM_QUALITY = 'maximum_quality',
  MAXIMUM_SAVINGS = 'maximum_savings'
}

// Function to map form cost optimization values to NexusProfile enum values
function mapCostOptimizationToProfile(optimization: string): NexusProfile {
  switch (optimization) {
    case 'balanced':
      return NexusProfile.BALANCED;
    case 'speed':
      return NexusProfile.MAXIMUM_PERFORMANCE;
    case 'quality':
      return NexusProfile.MAXIMUM_QUALITY;
    case 'economy':
      return NexusProfile.MAXIMUM_SAVINGS;
    default:
      return NexusProfile.BALANCED;
  }
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

// Define form schema
const formSchema = z.object({
  jobType: z.enum(["chain-of-thought", "agent-collaboration", "creative-generation", "data-analysis", "custom"]),
  prompt: z.string().min(10, "Prompt must be at least 10 characters long"),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().min(100).max(100000).default(4000),
  temperature: z.number().min(0).max(2).default(0.7),
  topP: z.number().min(0).max(1).default(1),
  batchProcessing: z.boolean().default(false),
  costOptimization: z.enum(["balanced", "speed", "quality", "economy"]).default("balanced"),
  adaptiveSplitting: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export function NewJobForm() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  
  // Default form values
  const defaultValues: Partial<FormValues> = {
    jobType: "chain-of-thought",
    maxTokens: 4000,
    temperature: 0.7,
    topP: 1,
    batchProcessing: false,
    costOptimization: "balanced",
    adaptiveSplitting: true,
  };
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform the form data to match the expected server schema
      const serverData = {
        input: {
          jobType: data.jobType,
          prompt: data.prompt,
          systemPrompt: data.systemPrompt || undefined,
          modelPreference: data.model || 'auto'
        },
        options: {
          // Map the form value to NexusProfile enum values
          profile: mapCostOptimizationToProfile(data.costOptimization),
          batchable: data.batchProcessing,
          priority: 'normal',
          maxTokens: data.maxTokens,
          temperature: data.temperature,
          topP: data.topP,
          adaptiveSplitting: data.adaptiveSplitting
        }
      };
      
      console.log('Submitting job data:', JSON.stringify(serverData));
      
      return apiRequest("/api/nexus/jobs", serverData);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/nexus/jobs"] });
      toast({
        title: "Job created successfully",
        description: "Your job has been submitted to OROBORO NEXUS",
      });
      navigate(`/nexus/jobs/${response.data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to create job",
        description: error.message || "An error occurred while creating the job",
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: FormValues) => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    
    createJobMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Create New NEXUS Job</CardTitle>
              <CardDescription>
                Define the core parameters for your OROBORO NEXUS job
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="chain-of-thought">Chain of Thought</SelectItem>
                        <SelectItem value="agent-collaboration">Agent Collaboration</SelectItem>
                        <SelectItem value="creative-generation">Creative Generation</SelectItem>
                        <SelectItem value="data-analysis">Data Analysis</SelectItem>
                        <SelectItem value="custom">Custom Processing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of job will determine the processing flow and optimization techniques
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you want NEXUS to accomplish..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide clear instructions for what you want the system to do
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Define system behavior and constraints..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Advanced: Define system context and behavioral guidelines
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        )}
        
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>
                Fine-tune model parameters and processing options
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Model (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auto-select optimal model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="auto">Auto-select optimal model</SelectItem>
                        <SelectItem value="gpt-4-0125-preview">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-4-vision-preview">GPT-4 Vision</SelectItem>
                        <SelectItem value="gpt-4-1106-preview">GPT-4 (November 2023)</SelectItem>
                        <SelectItem value="gpt-4">GPT-4 (Classic)</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet-20240229">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty to let NEXUS automatically select the most cost-effective model
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="maxTokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Tokens: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={100}
                          max={100000}
                          step={100}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum output tokens to generate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature: {field.value.toFixed(1)}</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={2}
                          step={0.1}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Higher values increase creativity, lower values improve accuracy
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Optimization Options</h3>
                
                <FormField
                  control={form.control}
                  name="costOptimization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Optimization Profile</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="balanced">Balanced (Default)</SelectItem>
                          <SelectItem value="speed">Speed Priority</SelectItem>
                          <SelectItem value="quality">Quality Priority</SelectItem>
                          <SelectItem value="economy">Economy Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select how NEXUS should prioritize cost optimization
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="batchProcessing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Batch Processing</FormLabel>
                          <FormDescription>
                            Optimize costs with batch API calls (up to 50% savings)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="adaptiveSplitting"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-3 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel>Adaptive Splitting</FormLabel>
                          <FormDescription>
                            Automatically split complex tasks for optimal processing
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={createJobMutation.isPending}
            className="ml-auto"
          >
            {createJobMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : step < 2 ? "Next" : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
}