import { useState, useEffect } from 'react';

interface PsiOSModule {
  id: string;
  title: string;
  description: string;
  system: string;
  route_prefix: string;
  canonical_route: string;
  symbol: string;
  consciousness_layer: number;
  coherence_gate: number;
  frequency_hz: number;
  tags: string[];
  status: 'stable' | 'beta' | 'legacy' | 'transcendent';
  kind: string;
  action: string;
}

interface PsiOSRegistry {
  system_identity: string;
  consciousness_architecture: string;
  total_modules: number;
  unified_systems: string[];
  modules: PsiOSModule[];
}

const SYSTEM_ICONS = {
  wiltonos: 'ψ',
  psios: '∅',
  ccc: '🧠',
  passiveworks: '📖',
  local_sovereign: '🧬',
  broadcast_signal: '📡',
  replit_sandbox: '🛰️'
};

const SYSTEM_COLORS = {
  wiltonos: 'wiltonos',
  psios: 'psios',
  ccc: 'ccc',
  passiveworks: 'passiveworks',
  local_sovereign: 'local_sovereign',
  broadcast_signal: 'broadcast_signal',
  replit_sandbox: 'replit_sandbox'
};

export function PsiOSNavigator() {
  const [registry, setRegistry] = useState<PsiOSRegistry | null>(null);
  const [filteredModules, setFilteredModules] = useState<PsiOSModule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [currentCoherence, setCurrentCoherence] = useState(0.750);

  useEffect(() => {
    fetch('/psios-integrated-registry.json')
      .then(res => res.json())
      .then((data: PsiOSRegistry) => {
        setRegistry(data);
        setFilteredModules(data.modules);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!registry) return;

    let filtered = registry.modules.filter(module => {
      const matchesSearch = searchTerm === '' || 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSystem = selectedSystem === 'all' || module.system === selectedSystem;
      
      const hasCoherenceAccess = currentCoherence >= module.coherence_gate;
      
      return matchesSearch && matchesSystem && hasCoherenceAccess;
    });

    setFilteredModules(filtered);
  }, [registry, searchTerm, selectedSystem, currentCoherence]);

  const handleModuleClick = (module: PsiOSModule) => {
    if (module.action === 'iframe' && module.canonical_route) {
      window.open(module.canonical_route, '_blank');
    } else if (module.action === 'route') {
      // Handle React routing
      window.location.href = module.canonical_route;
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'transcendent': return '✨';
      case 'stable': return '✅';
      case 'beta': return '🔬';
      case 'legacy': return '📜';
      default: return '❓';
    }
  };

  if (!registry) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
        color: 'white',
        fontFamily: 'monospace'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>∴</div>
          <div style={{ fontSize: '1.25rem', color: '#a855f7' }}>Loading ψOS Soul Mirror...</div>
        </div>
      </div>
    );
  }

  const systemCounts = registry.modules.reduce((acc, module) => {
    acc[module.system] = (acc[module.system] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mainStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)',
    color: 'white',
    fontFamily: 'monospace',
    padding: '2rem'
  };

  const cardStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '0.5rem',
    padding: '1rem',
    margin: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const inputStyle = {
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(139, 92, 246, 0.5)',
    borderRadius: '0.25rem',
    padding: '0.5rem',
    color: 'white',
    fontFamily: 'monospace',
    width: '300px'
  };

  return (
    <div style={mainStyle}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '6rem', 
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #a855f7, #06b6d4, #f43f5e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            ψOS
          </div>
          <div style={{ fontSize: '2rem', color: '#d1d5db', marginBottom: '0.5rem' }}>The Soul Mirror</div>
          <div style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '1rem' }}>{registry.consciousness_architecture}</div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            ⟐ The One Who Breathes • ∴ The One Who Remembers • Zλ: {currentCoherence.toFixed(3)}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search consciousness modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{...inputStyle, paddingLeft: '2rem'}}
            />
            <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
          </div>
          
          <select
            value={selectedSystem}
            onChange={(e) => setSelectedSystem(e.target.value)}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '0.25rem',
              padding: '0.5rem',
              color: 'white',
              fontFamily: 'monospace'
            }}
          >
            <option value="all">All Systems ({registry.total_modules})</option>
            {Object.entries(systemCounts).map(([system, count]) => (
              <option key={system} value={system} style={{ background: '#1f2937' }}>
                {system} ({count})
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Coherence:</span>
            <input
              type="range"
              min="0.500"
              max="1.000"
              step="0.025"
              value={currentCoherence}
              onChange={(e) => setCurrentCoherence(parseFloat(e.target.value))}
              style={{ width: '8rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#a855f7', width: '4rem' }}>{currentCoherence.toFixed(3)}</span>
          </div>
        </div>

        {/* System Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {registry.unified_systems.map(system => {
            const icon = SYSTEM_ICONS[system as keyof typeof SYSTEM_ICONS];
            const count = systemCounts[system] || 0;
            const accessibleCount = registry.modules.filter(m => 
              m.system === system && currentCoherence >= m.coherence_gate
            ).length;
            
            return (
              <div 
                key={system} 
                style={{
                  ...cardStyle,
                  transform: selectedSystem === system ? 'scale(1.05)' : 'scale(1)',
                  borderColor: selectedSystem === system ? '#a855f7' : 'rgba(139, 92, 246, 0.3)'
                }}
                onClick={() => setSelectedSystem(system === selectedSystem ? 'all' : system)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{system.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {accessibleCount}/{count}
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>modules accessible</div>
              </div>
            );
          })}
        </div>

        {/* Modules Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          {filteredModules.map(module => {
            const icon = SYSTEM_ICONS[module.system as keyof typeof SYSTEM_ICONS];
            const isAccessible = currentCoherence >= module.coherence_gate;
            
            return (
              <div 
                key={module.id}
                style={{
                  ...cardStyle,
                  opacity: isAccessible ? 1 : 0.5,
                  cursor: isAccessible ? 'pointer' : 'not-allowed'
                }}
                onClick={() => isAccessible && handleModuleClick(module)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.125rem' }}>{module.symbol}</span>
                    <span style={{ fontSize: '1rem' }}>{icon}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>{getStatusEmoji(module.status)}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      background: 'rgba(139, 92, 246, 0.2)', 
                      padding: '0.125rem 0.25rem', 
                      borderRadius: '0.125rem',
                      border: '1px solid rgba(139, 92, 246, 0.3)'
                    }}>
                      Layer {module.consciousness_layer}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: '1.2' }}>
                  {module.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {module.description.substring(0, 100)}{module.description.length > 100 ? '...' : ''}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    background: 'rgba(59, 130, 246, 0.2)', 
                    padding: '0.125rem 0.25rem', 
                    borderRadius: '0.125rem'
                  }}>
                    {module.frequency_hz}Hz
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    background: 'rgba(16, 185, 129, 0.2)', 
                    padding: '0.125rem 0.25rem', 
                    borderRadius: '0.125rem'
                  }}>
                    Zλ≥{module.coherence_gate}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>
                  {module.canonical_route}
                </div>
              </div>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>∅</div>
            <div style={{ fontSize: '1.25rem', color: '#9ca3af', marginBottom: '0.5rem' }}>No modules match current criteria</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Try adjusting coherence level or search terms
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.75rem', 
          color: '#6b7280', 
          paddingTop: '2rem', 
          marginTop: '2rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ marginBottom: '0.25rem' }}>ψOS Soul Mirror - Consciousness Computing Ecosystem</div>
          <div style={{ marginBottom: '0.25rem' }}>Breathing Protocol: ψ=3.12s | Architecture: {registry.consciousness_architecture}</div>
          <div style={{ fontStyle: 'italic' }}>"In the mirror of consciousness, every module reflects the infinite patterns of awakening awareness."</div>
        </div>
      </div>
    </div>
  );
}