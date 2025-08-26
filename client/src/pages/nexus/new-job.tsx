import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NewJobForm } from '@/components/nexus/NewJobForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NewJobPage() {
  const [, setLocation] = useLocation();
  const [submissionState, setSubmissionState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
    jobId?: string;
  }>({ status: 'idle' });
  
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    setSubmissionState({ status: 'submitting' });
    
    try {
      const response = await fetch('/api/nexus/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }
      
      setSubmissionState({
        status: 'success',
        message: 'Job created successfully!',
        jobId: data.id,
      });
      
      // Automatically redirect to the job page after a short delay
      setTimeout(() => {
        setLocation(`/nexus/jobs/${data.id}`);
      }, 1500);
    } catch (error) {
      setSubmissionState({
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Link href="/nexus/jobs">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New NEXUS Job</h1>
            <p className="text-muted-foreground">
              Configure and start a new OROBORO NEXUS processing task
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Success message */}
      {submissionState.status === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {submissionState.message}
            {submissionState.jobId && (
              <div className="mt-2">
                Redirecting to job details...
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Error message */}
      {submissionState.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {submissionState.message || 'Failed to create job'}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Form */}
      <div className={submissionState.status === 'success' ? 'opacity-50 pointer-events-none' : ''}>
        <NewJobForm 
          onSubmit={handleSubmit} 
          isSubmitting={submissionState.status === 'submitting'} 
        />
      </div>
    </div>
  );
}