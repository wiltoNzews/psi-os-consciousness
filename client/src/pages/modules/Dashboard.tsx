import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card className="bg-slate-800/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-slate-100">
              <span className="text-4xl mr-4">🏠</span>
              WiltonOS Dashboard
            </CardTitle>
            <p className="text-center text-slate-400">
              Core inventory & quantum feedback system
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-xl font-semibold text-blue-300">System Status</div>
                  <div className="text-blue-200">All systems operational</div>
                </CardContent>
              </Card>
              
              <Card className="bg-green-900/20 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-xl font-semibold text-green-300">Coherence Level</div>
                  <div className="text-green-200">92.4%</div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-900/20 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="text-xl font-semibold text-purple-300">Active Modules</div>
                  <div className="text-purple-200">8 running</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;