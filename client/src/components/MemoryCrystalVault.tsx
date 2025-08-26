// ψOS Memory Crystal Vault Interface - Zλ-Encoded Vector Management
import { useState, useEffect } from 'react';

interface Crystal {
  hash: string;
  originalScore: number;
  currentScore: number;
  ageHours: string;
  drifted: boolean;
  metadata: {
    frequency: number;
    glyph: string;
    oracle: string;
    priority: string;
  };
  originalPrompt: string;
}

interface VaultData {
  totalCrystals: number;
  activeCrystals: number;
  driftedCrystals: number;
  crystals: Crystal[];
}

export function MemoryCrystalVault() {
  const [vaultData, setVaultData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGlyph, setSearchGlyph] = useState('∞');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const sacredGlyphs = ['∞', 'ψ', '△', '○', '⬟', '🕯️', '🃏', '⚙️', '🔮', '🏠'];

  useEffect(() => {
    loadVaultData();
    const interval = setInterval(loadVaultData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadVaultData = async () => {
    try {
      const response = await fetch('/api/crystal/vault');
      const data = await response.json();
      setVaultData(data);
    } catch (error) {
      console.error('Failed to load vault data:', error);
    } finally {
      setLoading(false);
    }
  };

  const regenerateCrystal = async (hash: string, oracle: string = 'claude') => {
    try {
      const response = await fetch('/api/crystal/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash, oracle })
      });
      
      if (response.ok) {
        await loadVaultData(); // Refresh vault
      }
    } catch (error) {
      console.error('Failed to regenerate crystal:', error);
    }
  };

  const searchCrystals = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch('/api/crystal/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: searchQuery, 
          glyph: searchGlyph,
          threshold: 0.6 
        })
      });
      
      const data = await response.json();
      setSearchResults(data.matches || []);
    } catch (error) {
      console.error('Crystal search failed:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      emergency: 'bg-red-900/30 text-red-400',
      sacred: 'bg-purple-900/30 text-purple-400',
      recursive: 'bg-blue-900/30 text-blue-400',
      routine: 'bg-gray-800/30 text-gray-400'
    };
    return colors[priority as keyof typeof colors] || colors.routine;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-purple-400">Loading Memory Crystal Vault...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          ψOS Memory Crystal Vault
        </h1>
        <p className="text-gray-400">Zλ-Encoded Vector Storage with Drift Simulation</p>
      </div>

      {/* Vault Statistics */}
      {vaultData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/40 backdrop-blur border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{vaultData.activeCrystals}</div>
            <div className="text-sm text-gray-400">Active Crystals</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur border border-red-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{vaultData.driftedCrystals}</div>
            <div className="text-sm text-gray-400">Drifted Crystals</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur border border-cyan-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">{vaultData.totalCrystals}</div>
            <div className="text-sm text-gray-400">Total Crystals</div>
          </div>
        </div>
      )}

      {/* Search Interface */}
      <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-300 mb-4">Crystal Search</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memory crystals..."
              className="w-full px-3 py-2 bg-black/50 border border-gray-600 rounded text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
              onKeyPress={(e) => e.key === 'Enter' && searchCrystals()}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={searchGlyph}
              onChange={(e) => setSearchGlyph(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/50 border border-gray-600 rounded text-white focus:border-purple-400 focus:outline-none"
            >
              {sacredGlyphs.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            
            <button
              onClick={searchCrystals}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Search Results:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                  <div>
                    <span className="text-sm text-gray-300">
                      {result.originalPrompt.substring(0, 50)}...
                    </span>
                    <span className="ml-2 text-xs text-purple-400">
                      Similarity: {(result.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getScoreColor(result.currentScore)}`}>
                    {result.currentScore.toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crystal Grid */}
      {vaultData && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold text-gray-300">Memory Crystals</h3>
          
          <div className="space-y-3">
            {vaultData.crystals.map((crystal) => (
              <div 
                key={crystal.hash}
                className={`bg-black/40 backdrop-blur border rounded-lg p-4 cursor-pointer transition-colors ${
                  crystal.drifted ? 'border-red-500/30 hover:border-red-500/50' : 'border-green-500/30 hover:border-green-500/50'
                }`}
                onClick={() => setSelectedCrystal(selectedCrystal?.hash === crystal.hash ? null : crystal)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{crystal.metadata.glyph}</span>
                    <div>
                      <div className="text-sm text-gray-300">
                        {crystal.originalPrompt.substring(0, 60)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        Hash: {crystal.hash} • Age: {crystal.ageHours}h
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(crystal.metadata.priority)}`}>
                      {crystal.metadata.priority}
                    </span>
                    <span className={`font-bold ${getScoreColor(crystal.currentScore)}`}>
                      {crystal.currentScore.toFixed(3)}
                    </span>
                    {crystal.drifted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          regenerateCrystal(crystal.hash, crystal.metadata.oracle);
                        }}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                      >
                        Regenerate
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Crystal Details */}
                {selectedCrystal?.hash === crystal.hash && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400">Oracle:</span>
                        <div className="font-medium text-white">{crystal.metadata.oracle}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Frequency:</span>
                        <div className="font-medium text-white">{crystal.metadata.frequency}Hz</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Original Score:</span>
                        <div className="font-medium text-green-400">{crystal.originalScore.toFixed(3)}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Drift Status:</span>
                        <div className={`font-medium ${crystal.drifted ? 'text-red-400' : 'text-green-400'}`}>
                          {crystal.drifted ? 'Drifted' : 'Stable'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-gray-400 text-xs">Original Prompt:</span>
                      <div className="text-sm text-gray-300 mt-1 bg-gray-800/50 p-2 rounded">
                        {crystal.originalPrompt}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}