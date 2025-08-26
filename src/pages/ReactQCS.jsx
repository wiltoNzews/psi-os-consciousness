import React, { useContext, useState } from 'react';
import { QCSProvider, QCSContext } from '../context/QCSContext';
import SacredGeometryInterface from '../components/SacredGeometryInterface';
import CathedralMapInterface from '../components/CathedralMapInterface';
import QuantumConsciousnessShell from '../components/QuantumConsciousnessShell';
import ConsciousnessHUD from '../components/ConsciousnessHUD';
import '../../client/src/components/ReactQCS.css';

function ReactQCSContent() {
  const { activeGeometry } = useContext(QCSContext);
  const [interfaceMode, setInterfaceMode] = useState('standard'); // 'standard' or 'cathedral'

  // Switch to cathedral map when "cathedral map" command is triggered
  React.useEffect(() => {
    if (activeGeometry === "all") {
      setInterfaceMode('cathedral');
    }
  }, [activeGeometry]);

  return (
    <div className="react-qcs-container">
      <div className="react-header">
        <h1 className="react-title">⚛️ React QCS - Enhanced Modular Architecture</h1>
        <div className="react-subtitle">
          {interfaceMode === 'cathedral' ? 
            'Cathedral Map Interface • Orbit Controls • Enhanced Navigation' :
            'SacredGeometryInterface.jsx • Mathematical Precision Components'
          }
        </div>
        <div className="interface-toggle">
          <button 
            onClick={() => setInterfaceMode('standard')}
            className={interfaceMode === 'standard' ? 'active' : ''}
          >
            Standard Interface
          </button>
          <button 
            onClick={() => setInterfaceMode('cathedral')}
            className={interfaceMode === 'cathedral' ? 'active' : ''}
          >
            Cathedral Map
          </button>
        </div>
      </div>

      {/* Sacred Geometry Canvas - Switch between interfaces */}
      {interfaceMode === 'cathedral' ? <CathedralMapInterface /> : <SacredGeometryInterface />}

      {/* Consciousness HUD and Status */}
      <ConsciousnessHUD />

      {/* Terminal Interface */}
      <QuantumConsciousnessShell />
    </div>
  );
}

export default function ReactQCS() {
  return (
    <QCSProvider>
      <ReactQCSContent />
    </QCSProvider>
  );
}