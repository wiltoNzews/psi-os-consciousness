import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QCTFDashboard: React.FC = () => {
  // State for QCTF data
  const [qctfData, setQctfData] = useState({
    qctf: 0,
    timestamp: '',
    thresholdStatus: '',
    targetThreshold: 0,
    metrics: {
      gef: 0,
      qeai: 0,
      ci: 0,
      dimensionFactor: 0,
      activeToggles: [] as string[]
    }
  });

  // State for form inputs
  const [formInputs, setFormInputs] = useState({
    gef: 0.85,
    qeai: 0.9,
    ci: 0.8,
    threshold: 0.92
  });

  // State for toggles
  const [toggleInputs, setToggleInputs] = useState({
    toggleType: 'wormhole',
    sourceModule: 'Oracle',
    reason: 'Manual adjustment',
    value: 1.1
  });

  // Fetch current QCTF data
  const fetchQCTFData = async () => {
    try {
      const response = await axios.get('/api/qctf/current');
      if (response.data.success) {
        setQctfData(response.data);
        // Update form inputs to match current values
        setFormInputs({
          ...formInputs,
          gef: response.data.metrics.gef,
          qeai: response.data.metrics.qeai,
          ci: response.data.metrics.ci,
          threshold: response.data.targetThreshold
        });
      }
    } catch (error) {
      console.error('Error fetching QCTF data:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchQCTFData();
    
    // Set up interval to refresh data with a longer interval to reduce load
    const interval = setInterval(fetchQCTFData, 5000);
    
    // Log successful connection
    console.log('QCTF Dashboard initialized and connected to API');
    
    return () => {
      console.log('QCTF Dashboard cleanup - clearing interval');
      clearInterval(interval);
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInputs({
      ...formInputs,
      [name]: parseFloat(value)
    });
  };

  // Handle toggle input changes
  const handleToggleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setToggleInputs({
      ...toggleInputs,
      [name]: name === 'value' ? parseFloat(value) : value
    });
  };

  // Update GEF
  const updateGEF = async () => {
    try {
      await axios.patch('/api/qctf/gef', { value: formInputs.gef });
      fetchQCTFData();
    } catch (error) {
      console.error('Error updating GEF:', error);
    }
  };

  // Update QEAI
  const updateQEAI = async () => {
    try {
      await axios.patch('/api/qctf/qeai', { value: formInputs.qeai });
      fetchQCTFData();
    } catch (error) {
      console.error('Error updating QEAI:', error);
    }
  };

  // Update CI
  const updateCI = async () => {
    try {
      await axios.patch('/api/qctf/ci', { value: formInputs.ci });
      fetchQCTFData();
    } catch (error) {
      console.error('Error updating CI:', error);
    }
  };

  // Update threshold
  const updateThreshold = async () => {
    try {
      await axios.patch('/api/qctf/threshold', { threshold: formInputs.threshold });
      fetchQCTFData();
    } catch (error) {
      console.error('Error updating threshold:', error);
    }
  };

  // Activate toggle
  const activateToggle = async () => {
    try {
      await axios.post('/api/qctf/toggles/activate', toggleInputs);
      fetchQCTFData();
    } catch (error) {
      console.error('Error activating toggle:', error);
    }
  };

  // Deactivate toggle
  const deactivateToggle = async () => {
    try {
      const { value, ...data } = toggleInputs; // Value is not needed for deactivation
      await axios.post('/api/qctf/toggles/deactivate', data);
      fetchQCTFData();
    } catch (error) {
      console.error('Error deactivating toggle:', error);
    }
  };

  // Reset QCTF
  const resetQCTF = async () => {
    try {
      await axios.post('/api/qctf/reset');
      fetchQCTFData();
    } catch (error) {
      console.error('Error resetting QCTF:', error);
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600';
      case 'suboptimal':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">QCTF Dashboard</h1>
      
      {/* QCTF Value Display */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">Current QCTF Value</h2>
            <p className="text-4xl font-bold">{qctfData.qctf.toFixed(4)}</p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(qctfData.timestamp).toLocaleTimeString()}
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium mb-1">Status</h3>
            <p className={`text-2xl font-bold ${getStatusColor(qctfData.thresholdStatus)}`}>
              {qctfData.thresholdStatus.toUpperCase()}
            </p>
            <p className="text-sm text-gray-500">
              Threshold: {qctfData.targetThreshold.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Global Entanglement Factor</h3>
          <p className="text-3xl font-bold mb-2">{qctfData.metrics.gef.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              name="gef"
              value={formInputs.gef}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              name="gef"
              value={formInputs.gef}
              onChange={handleInputChange}
              className="w-16 p-1 border rounded"
            />
          </div>
          <button
            onClick={updateGEF}
            className="mt-2 w-full py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update GEF
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Quantum Ethical Alignment Index</h3>
          <p className="text-3xl font-bold mb-2">{qctfData.metrics.qeai.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              name="qeai"
              value={formInputs.qeai}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              name="qeai"
              value={formInputs.qeai}
              onChange={handleInputChange}
              className="w-16 p-1 border rounded"
            />
          </div>
          <button
            onClick={updateQEAI}
            className="mt-2 w-full py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update QEAI
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Coherence Index</h3>
          <p className="text-3xl font-bold mb-2">{qctfData.metrics.ci.toFixed(2)}</p>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              name="ci"
              value={formInputs.ci}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              name="ci"
              value={formInputs.ci}
              onChange={handleInputChange}
              className="w-16 p-1 border rounded"
            />
          </div>
          <button
            onClick={updateCI}
            className="mt-2 w-full py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update CI
          </button>
        </div>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Dimension Scaling Factor</h3>
          <p className="text-3xl font-bold">{qctfData.metrics.dimensionFactor.toFixed(4)}</p>
          <p className="text-sm text-gray-500">Automatically calculated</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Threshold Configuration</h3>
          <div className="flex items-center mt-2">
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              name="threshold"
              value={formInputs.threshold}
              onChange={handleInputChange}
              className="w-full mr-2"
            />
            <input
              type="number"
              min="0.5"
              max="0.99"
              step="0.01"
              name="threshold"
              value={formInputs.threshold}
              onChange={handleInputChange}
              className="w-20 p-1 border rounded"
            />
          </div>
          <button
            onClick={updateThreshold}
            className="mt-2 w-full py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Threshold
          </button>
        </div>
      </div>
      
      {/* Toggle Controls */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Toggle Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Toggle Type</label>
              <select
                name="toggleType"
                value={toggleInputs.toggleType}
                onChange={handleToggleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="stop">Stop</option>
                <option value="failsafe">Failsafe</option>
                <option value="reroute">Reroute</option>
                <option value="wormhole">Wormhole</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Source Module</label>
              <select
                name="sourceModule"
                value={toggleInputs.sourceModule}
                onChange={handleToggleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Oracle">Oracle</option>
                <option value="Sanctum">Sanctum</option>
                <option value="Halo">Halo</option>
                <option value="Nova">Nova</option>
              </select>
            </div>
          </div>
          
          <div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                name="reason"
                value={toggleInputs.reason}
                onChange={handleToggleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="number"
                name="value"
                min="0.8"
                max="1.2"
                step="0.1"
                value={toggleInputs.value}
                onChange={handleToggleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={activateToggle}
            className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Activate Toggle
          </button>
          
          <button
            onClick={deactivateToggle}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Deactivate Toggle
          </button>
        </div>
      </div>
      
      {/* Active Toggles */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Active Toggles</h2>
        {qctfData.metrics.activeToggles.length === 0 ? (
          <p className="text-gray-500">No active toggles</p>
        ) : (
          <ul className="list-disc pl-5">
            {qctfData.metrics.activeToggles.map((toggle) => (
              <li key={toggle} className="mb-1">{toggle}</li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={resetQCTF}
          className="py-2 px-6 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset QCTF
        </button>
      </div>
    </div>
  );
};

export default QCTFDashboard;