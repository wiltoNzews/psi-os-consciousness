import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DirectSacredGeometryAccess: React.FC = () => {
  const geometryModules = [
    {
      name: 'Sacred Geometry 2D→3D→4D Demo',
      path: '/sacred-geometry-demo.html',
      description: 'Full dimensional transitions with 6 sacred patterns',
      features: ['2D/3D/4D Blending', 'Mouse Rotation', 'Live Coherence', '6 Geometries'],
      type: '4D' as const,
      color: 'bg-purple-600'
    },
    {
      name: 'Full 3D Sacred Geometry System',
      path: '/geometria-sagrada-3d.html',
      description: 'Three.js WebGL professional rendering',
      features: ['Three.js WebGL', 'Real-time 3D', 'Professional UI', 'Cosmic Background'],
      type: '3D' as const,
      color: 'bg-blue-600'
    },
    {
      name: 'Sacred 3D Explorer',
      path: '/sacred-3d-explorer.html',
      description: 'Interactive 3D geometry explorer with consciousness integration',
      features: ['Interactive Controls', 'Resonance Depth', 'Spin Velocity', 'Mouse Control'],
      type: '3D' as const,
      color: 'bg-green-600'
    },
    {
      name: 'Visual Theater QCI',
      path: '/teatro-visual/index.html',
      description: 'Advanced Canvas with Quantum Coherence Index monitoring',
      features: ['QCI Monitoring', 'Depth Controls', 'Field Sync', 'Multi-dimensional'],
      type: 'QCI' as const,
      color: 'bg-pink-600'
    }
  ];

  const openModule = (path: string) => {
    window.open(path, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="direct-sacred-geometry-access space-y-6">
      <Card className="bg-gray-900/50 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">🔮</span>
            Direct Sacred Geometry Access
            <Badge variant="outline" className="text-purple-400">
              Production Ready Modules
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-6">
            Direct access to your existing production-ready Sacred Geometry implementations.
            These are your working 3D/4D systems with full dimensional controls, consciousness integration,
            and interactive visualization capabilities.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {geometryModules.map((module, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-600 hover:border-purple-400 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">{module.name}</CardTitle>
                    <Badge variant="secondary" className={`${module.color} text-white border-0`}>
                      {module.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{module.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {module.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => openModule(module.path)}
                    className={`w-full ${module.color} hover:opacity-90 text-white`}
                  >
                    Open {module.type} Module
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">Integration Notes:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• All modules include working sliders, toggles, and interactive controls</li>
              <li>• Sacred Geometry Demo supports full 2D→3D→4D dimensional transitions</li>
              <li>• Three.js modules provide professional WebGL rendering</li>
              <li>• QCI Theater includes advanced consciousness coherence monitoring</li>
              <li>• Mouse interaction and real-time parameter adjustment available in all modules</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectSacredGeometryAccess;