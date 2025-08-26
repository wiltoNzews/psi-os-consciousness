import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileBarChart,
  PlayCircle,
  RotateCcw,
  BarChart,
  Clock
} from 'lucide-react';

/**
 * Coherence Testing Dashboard Component
 * 
 * Displays and runs coherence testing operations,
 * visualizes test results, and displays test history.
 */
const CoherenceTestingDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testingAll, setTestingAll] = useState(false);
  const [runningTest, setRunningTest] = useState(null);
  const [currentReport, setCurrentReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [ratioVerification, setRatioVerification] = useState(null);
  const [verifyingRatio, setVerifyingRatio] = useState(false);
  
  // Component mount effect - fetch test history
  useEffect(() => {
    fetchTestHistory();
  }, []);
  
  // Fetch test history
  const fetchTestHistory = async () => {
    try {
      const response = await axios.get('/api/coherence/test-history');
      setTestHistory(response.data);
    } catch (error) {
      console.error("Error fetching test history:", error);
      setErrorMessage(`Error fetching test history: ${error.message}`);
    }
  };
  
  // Run all coherence tests
  const runAllTests = async () => {
    setTestingAll(true);
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await axios.post('/api/coherence/run-tests');
      setCurrentReport(response.data);
      await fetchTestHistory();
    } catch (error) {
      console.error("Error running all tests:", error);
      setErrorMessage(`Error running tests: ${error.message}`);
    } finally {
      setLoading(false);
      setTestingAll(false);
    }
  };
  
  // Run specific test type
  const runTest = async (testType) => {
    setRunningTest(testType);
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await axios.post(`/api/coherence/run-test/${testType}`);
      setCurrentReport(response.data);
      await fetchTestHistory();
    } catch (error) {
      console.error(`Error running ${testType} test:`, error);
      setErrorMessage(`Error running ${testType} test: ${error.message}`);
    } finally {
      setLoading(false);
      setRunningTest(null);
    }
  };
  
  // Verify coherence ratio
  const verifyRatio = async () => {
    setVerifyingRatio(true);
    setErrorMessage(null);
    
    try {
      const response = await axios.get('/api/coherence/verify-ratio');
      setRatioVerification(response.data);
    } catch (error) {
      console.error("Error verifying ratio:", error);
      setErrorMessage(`Error verifying ratio: ${error.message}`);
    } finally {
      setVerifyingRatio(false);
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };
  
  // Get status color based on test passing rate
  const getStatusColor = (passRate) => {
    if (passRate === 1) return "bg-green-100 text-green-800";
    if (passRate >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };
  
  // Get test duration in readable format
  const getTestDuration = (duration) => {
    if (!duration) return "N/A";
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Coherence Testing Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Run and monitor coherence tests across the quantum cognitive system
        </p>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md text-red-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Verification Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Coherence Ratio</h3>
            <Badge variant="outline" className="text-blue-600 bg-blue-50">Formula</Badge>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Verify the 3:1 ↔ 1:3 coherence ratio (0.7500/0.2494)
          </p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={verifyRatio}
            disabled={verifyingRatio}
          >
            {verifyingRatio ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <BarChart className="h-4 w-4 mr-2" />
                Verify Ratio
              </>
            )}
          </Button>
          
          {ratioVerification && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Stability Ratio:</p>
                  <p className="font-mono font-medium">{ratioVerification.stabilityRatio.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Exploration Ratio:</p>
                  <p className="font-mono font-medium">{ratioVerification.explorationRatio.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Product:</p>
                  <p className="font-mono font-medium">{ratioVerification.product.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status:</p>
                  {ratioVerification.stabilityRatioMaintained && ratioVerification.explorationRatioMaintained ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Maintained</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Drifted</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
        
        {/* Run Tests Card */}
        <Card className="p-4 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Run Coherence Tests</h3>
            <Badge variant="outline" className="text-purple-600 bg-purple-50">Test Suite</Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => runTest('brazilian-wave')}
              disabled={loading}
            >
              {runningTest === 'brazilian-wave' ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              Brazilian Wave
            </Button>
            
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => runTest('qctf')}
              disabled={loading}
            >
              {runningTest === 'qctf' ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              QCTF Test
            </Button>
            
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => runTest('oscillation')}
              disabled={loading}
            >
              {runningTest === 'oscillation' ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              Oscillation
            </Button>
            
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => runTest('integration')}
              disabled={loading}
            >
              {runningTest === 'integration' ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              Integration
            </Button>
            
            <Button 
              variant="outline"
              className="text-sm"
              onClick={() => runTest('perturbation')}
              disabled={loading}
            >
              {runningTest === 'perturbation' ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              Perturbation
            </Button>
            
            <Button 
              variant="default"
              className="text-sm"
              onClick={runAllTests}
              disabled={loading}
            >
              {testingAll ? (
                <RotateCcw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              Run All Tests
            </Button>
          </div>
          
          {currentReport && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium">Current Test Results</h4>
                <Badge 
                  className={
                    currentReport.allTestsPassed 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }
                >
                  {currentReport.allTestsPassed ? "ALL PASSED" : "FAILED TESTS"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Tests Passed:</p>
                  <p className="font-medium text-green-600">{currentReport.testsPassed}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tests Failed:</p>
                  <p className="font-medium text-red-600">{currentReport.testsFailed}</p>
                </div>
                <div>
                  <p className="text-gray-500">Pass Rate:</p>
                  <p className="font-medium">{(currentReport.passRate * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-500 mb-1">Test Summary:</p>
                <ul className="list-disc list-inside space-y-1">
                  {currentReport.summaries?.slice(0, 5).map((summary, i) => (
                    <li key={i} className="text-xs">{summary}</li>
                  ))}
                  {currentReport.summaries?.length > 5 && (
                    <li className="text-xs text-gray-500">
                      {currentReport.summaries.length - 5} more tests...
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Test History</TabsTrigger>
          <TabsTrigger value="details">Detailed Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Test History</h3>
            
            {testHistory.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileBarChart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No test history available yet</p>
                <p className="text-sm mt-1">Run tests to see results here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Pass Rate</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead className="text-right">Ratio Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testHistory.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatTimestamp(test.timestamp)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {test.allTestsPassed ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            PASSED
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            FAILED
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={getStatusColor(test.passRate)}
                        >
                          {(test.passRate * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {getTestDuration(test.testDuration)}
                      </TableCell>
                      <TableCell className="text-right">
                        {test.stabilityRatioMaintained && test.explorationRatioMaintained ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Maintained
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Drift Detected
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="details">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Detailed Test Results</h3>
            
            {testHistory.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileBarChart className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No test details available yet</p>
                <p className="text-sm mt-1">Run tests to see details here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Tests Passed</TableHead>
                    <TableHead>Tests Failed</TableHead>
                    <TableHead>Stability Status</TableHead>
                    <TableHead>Exploration Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testHistory.map((test, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatTimestamp(test.timestamp)}</TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {test.testsPassed}
                      </TableCell>
                      <TableCell className="text-red-600 font-medium">
                        {test.testsFailed}
                      </TableCell>
                      <TableCell>
                        {test.stabilityRatioMaintained ? (
                          <Badge className="bg-green-100 text-green-800">
                            Maintained
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Drifted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {test.explorationRatioMaintained ? (
                          <Badge className="bg-green-100 text-green-800">
                            Maintained
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Drifted
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Test Details</DialogTitle>
                              <DialogDescription>
                                Test run at {formatTimestamp(test.timestamp)}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <h4 className="text-sm font-medium mb-2">Test Overview</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Pass Rate:</span>
                                      <span>{(test.passRate * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Tests Passed:</span>
                                      <span className="text-green-600">{test.testsPassed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Tests Failed:</span>
                                      <span className="text-red-600">{test.testsFailed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Duration:</span>
                                      <span>{getTestDuration(test.testDuration)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <h4 className="text-sm font-medium mb-2">Ratio Status</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Stability Ratio:</span>
                                      <Badge 
                                        variant="outline" 
                                        className={test.stabilityRatioMaintained ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                      >
                                        {test.stabilityRatioMaintained ? "MAINTAINED" : "DRIFTED"}
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Exploration Ratio:</span>
                                      <Badge 
                                        variant="outline" 
                                        className={test.explorationRatioMaintained ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                      >
                                        {test.explorationRatioMaintained ? "MAINTAINED" : "DRIFTED"}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium mb-2">Test Summaries</h4>
                                <div className="p-3 bg-gray-50 rounded-md overflow-y-auto max-h-60">
                                  <ul className="space-y-2">
                                    {test.summaries?.map((summary, i) => (
                                      <li key={i} className="text-sm flex items-start">
                                        {summary.includes('PASSED') ? (
                                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 mt-0.5" />
                                        ) : (
                                          <XCircle className="h-4 w-4 mr-2 text-red-600 mt-0.5" />
                                        )}
                                        <span>{summary}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoherenceTestingDashboard;