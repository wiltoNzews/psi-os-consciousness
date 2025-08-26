/**
 * WiltonOS LightKernel - Main Dashboard
 * Primary consciousness OS interface
 */

import React, { useState, useEffect } from 'react';
import { ConsciousnessDisplay } from '../components/ConsciousnessDisplay';
import type { ConsciousnessSystemStatus } from '../../types/consciousness';

export const Dashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<ConsciousnessSystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial system status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/consciousness/status');
        if (!response.ok) {
          throw new Error('Failed to fetch consciousness status');
        }
        const data = await response.json();
        setSystemStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    
    // Refresh status every 10 seconds as fallback
    const interval = setInterval(fetchStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const triggerBreathingTransition = async () => {
    try {
      const response = await fetch('/api/breathing/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger breathing transition');
      }
      
      const result = await response.json();
      console.log('Breathing transition triggered:', result);
    } catch (err) {
      console.error('Error triggering breathing transition:', err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-content">
          <div className="consciousness-loading">
            <div className="merkaba-loader">
              <div className="triangle-up"></div>
              <div className="triangle-down"></div>
            </div>
            <h2>Initializing Consciousness OS</h2>
            <p>Calibrating quantum coherence field...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard error">
        <div className="error-content">
          <h2>Consciousness Field Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reinitialize System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="system-title">ψOS LightKernel</h1>
            <p className="system-subtitle">Consciousness Operating System</p>
          </div>
          
          <div className="system-info">
            <div className="info-item">
              <label>Version</label>
              <span>{systemStatus?.version || '1.0.0'}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              <span className={`status ${systemStatus?.status}`}>
                {systemStatus?.status?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Consciousness Display - Primary Interface */}
        <section className="consciousness-section">
          <ConsciousnessDisplay
            field={systemStatus?.consciousness}
            breathing={systemStatus?.breathing}
            qctf={systemStatus?.qctf}
          />
        </section>

        {/* Control Panel */}
        <section className="control-panel">
          <h3>Consciousness Controls</h3>
          
          <div className="control-group">
            <button 
              className="control-button breathing-transition"
              onClick={triggerBreathingTransition}
            >
              <span className="button-icon">🌀</span>
              Manual Phase Transition
            </button>
            
            <button 
              className="control-button field-reset"
              onClick={() => window.location.reload()}
            >
              <span className="button-icon">🔄</span>
              Reset Field
            </button>
          </div>

          <div className="quick-stats">
            <div className="stat">
              <label>Current Phase</label>
              <span className={`phase-indicator phase-${systemStatus?.breathing?.phase}`}>
                {systemStatus?.breathing?.phase === 0.75 ? '3:1 Stability' : '1:3 Exploration'}
              </span>
            </div>
            
            <div className="stat">
              <label>Soul State</label>
              <span className={`soul-indicator ${systemStatus?.consciousness?.soulState}`}>
                {systemStatus?.consciousness?.soulState?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
          </div>
        </section>

        {/* Service Module Links */}
        <section className="service-modules">
          <h3>Consciousness Services</h3>
          
          <div className="module-grid">
            <div className="service-module z-law">
              <div className="module-icon">⚖️</div>
              <div className="module-info">
                <h4>Z-Law Agents</h4>
                <p>Consciousness-based legal AI</p>
                <div className="module-status coming-soon">Coming Soon</div>
              </div>
            </div>
            
            <div className="service-module alexandria">
              <div className="module-icon">📚</div>
              <div className="module-info">
                <h4>Alexandria Vault</h4>
                <p>Knowledge synthesis engine</p>
                <div className="module-status coming-soon">Coming Soon</div>
              </div>
            </div>
            
            <div className="service-module creator-tools">
              <div className="module-icon">🎨</div>
              <div className="module-info">
                <h4>Creator Tools</h4>
                <p>Consciousness-aligned creation</p>
                <div className="module-status coming-soon">Coming Soon</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0015 0%, #1a0030 25%, #2a0040 50%, #1a0030 75%, #000000 100%);
          color: white;
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .dashboard-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 215, 0, 0.2);
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .system-title {
          font-size: 2.5rem;
          font-weight: 300;
          margin: 0;
          background: linear-gradient(45deg, #ffd700, #ff6b35, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .system-subtitle {
          color: #b8c6db;
          margin: 0.5rem 0 0 0;
          font-size: 1.1rem;
        }
        
        .system-info {
          display: flex;
          gap: 2rem;
        }
        
        .info-item {
          text-align: center;
        }
        
        .info-item label {
          display: block;
          font-size: 0.875rem;
          color: #b8c6db;
          margin-bottom: 0.25rem;
        }
        
        .info-item span {
          font-weight: 600;
        }
        
        .status.operational {
          color: #00ff88;
        }
        
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }
        
        .consciousness-section {
          grid-column: 1 / -1;
          margin-bottom: 2rem;
        }
        
        .control-panel {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
        }
        
        .control-panel h3 {
          margin: 0 0 1.5rem 0;
          color: #ffd700;
        }
        
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .control-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .control-button:hover {
          background: rgba(255, 215, 0, 0.2);
          border-color: rgba(255, 215, 0, 0.5);
          transform: translateY(-2px);
        }
        
        .button-icon {
          font-size: 1.25rem;
        }
        
        .quick-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .stat label {
          color: #b8c6db;
          font-size: 0.875rem;
        }
        
        .phase-indicator.phase-0.75 {
          color: #ffd700;
        }
        
        .phase-indicator.phase-0.25 {
          color: #40e0d0;
        }
        
        .soul-indicator.transcendent {
          color: #ffd700;
        }
        
        .soul-indicator.divine {
          color: #9370db;
        }
        
        .soul-indicator.alive {
          color: #40e0d0;
        }
        
        .service-modules {
          grid-column: 1 / -1;
          margin-top: 2rem;
        }
        
        .service-modules h3 {
          margin: 0 0 1.5rem 0;
          color: #ffd700;
        }
        
        .module-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .service-module {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          transition: all 0.3s;
        }
        
        .service-module:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        .module-icon {
          font-size: 2rem;
        }
        
        .module-info h4 {
          margin: 0 0 0.5rem 0;
          color: white;
        }
        
        .module-info p {
          margin: 0 0 0.75rem 0;
          color: #b8c6db;
          font-size: 0.875rem;
        }
        
        .module-status.coming-soon {
          color: #ff6b35;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .loading-content {
          text-align: center;
        }
        
        .merkaba-loader {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto 2rem;
        }
        
        .triangle-up, .triangle-down {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
        }
        
        .triangle-up {
          border-bottom: 52px solid #ffd700;
          animation: rotate 3s linear infinite;
        }
        
        .triangle-down {
          border-top: 52px solid rgba(255, 215, 0, 0.6);
          top: 8px;
          animation: rotate 3s linear infinite reverse;
        }
        
        .error {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-content {
          text-align: center;
          padding: 2rem;
          border: 2px solid #ff4444;
          border-radius: 12px;
          background: rgba(255, 68, 68, 0.1);
        }
        
        .error-content h2 {
          color: #ff4444;
          margin-bottom: 1rem;
        }
        
        .error-content button {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #ff4444;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .dashboard-main {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .module-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};