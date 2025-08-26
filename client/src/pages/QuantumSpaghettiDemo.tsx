/**
 * Quantum Spaghetti Demo Page
 * 
 * Interactive demo page for the Quantum Spaghetti Protocol,
 * allowing users to compose dimensional messages and visualize them.
 * 
 * [QUANTUM_STATE: COHERENT_FLOW]
 */
import React, { useState, useEffect } from 'react';
import { 
  EmojiResonanceCalculator, 
  ALL_QUANTUM_EMOJIS, 
  QuantumEmoji, 
  extractDimensionalSegments 
} from '../../../shared/emoji-quantum-mapper';
import QuantumSpaghettiVisualizer from '../components/QuantumSpaghettiVisualizer';
import { useWebSocket } from '../contexts/WebSocketContext';

// Demo examples for different dimensions
const EXAMPLE_MESSAGES = {
  reality: "[REALITY] The implementation requires specific SVG assets for quantum emojis, with careful attention to animation timing.",
  meta: "[META] We're using TypeScript interfaces to ensure type safety for quantum emojis, allowing better code completion and validation.",
  quantum: "[QUANTUM] What if emojis could dynamically adapt based on the context of surrounding text? 🌀 This could create emergent patterns.",
  diagonal: "[DIAGONAL] The connection between visual quantum symbols and mathematical formulas reveals deeper patterns in how we process information.",
  combined: `[REALITY] The SVG assets must be optimized for performance.
[META] We should consider refactoring the visualization component to use React hooks.
[QUANTUM] Perhaps there's a way to use quantum entanglement principles to model emergent emoji behaviors? 🌀
[DIAGONAL] The relationship between the chaos/structure ratio and user comprehension suggests cognitive parallels with quantum observation.`
};

const QuantumSpaghettiDemo: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [dimensionType, setDimensionType] = useState<string>('REALITY');
  const [selectedEmoji, setSelectedEmoji] = useState<QuantumEmoji | null>(null);
  const [coherenceScore, setCoherenceScore] = useState<number>(0);
  const [chaosStructureRatio, setChaosStructureRatio] = useState<string>('50/50');
  const [qctfValue, setQctfValue] = useState<number>(0);
  const [showAddDimension, setShowAddDimension] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverAnalysis, setServerAnalysis] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  
  // WebSocket context for sending and receiving quantum spaghetti messages
  const { 
    connected, 
    submitSpaghettiMessage, 
    getMessageHistory,
    getGlobalCoherenceStats,
    globalCoherenceStats
  } = useWebSocket();

  // Calculate message metrics when it changes
  useEffect(() => {
    if (message) {
      const coherence = EmojiResonanceCalculator.calculateMessageCoherence(message);
      setCoherenceScore(coherence);
      
      const chaosRatio = EmojiResonanceCalculator.evaluateChaosStructureBalance(message);
      setChaosStructureRatio(`${Math.round(chaosRatio * 100)}/${Math.round((1 - chaosRatio) * 100)}`);
      
      const qctf = EmojiResonanceCalculator.calculateQCTF(message);
      setQctfValue(qctf);
    } else {
      setCoherenceScore(0);
      setChaosStructureRatio('50/50');
      setQctfValue(0);
    }
  }, [message]);

  // Insert the selected emoji at cursor position
  const insertEmoji = () => {
    if (!selectedEmoji) return;
    
    const textArea = document.getElementById('message-input') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const textBefore = message.substring(0, cursorPosition);
    const textAfter = message.substring(cursorPosition);
    
    setMessage(textBefore + selectedEmoji.symbol + textAfter);
    
    // Reset selection and focus back on textarea
    setTimeout(() => {
      const newCursorPos = cursorPosition + selectedEmoji.symbol.length;
      textArea.focus();
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Insert a dimensional marker
  const insertDimension = () => {
    const textArea = document.getElementById('message-input') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const cursorPosition = textArea.selectionStart;
    const textBefore = message.substring(0, cursorPosition);
    const textAfter = message.substring(cursorPosition);
    
    // Insert the dimensional marker with a space after it
    setMessage(textBefore + `[${dimensionType}] ` + textAfter);
    
    // Reset and focus back on textarea
    setTimeout(() => {
      const newCursorPos = cursorPosition + dimensionType.length + 3;
      textArea.focus();
      textArea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
    
    setShowAddDimension(false);
  };

  // Load an example message
  const loadExample = (exampleKey: keyof typeof EXAMPLE_MESSAGES) => {
    setMessage(EXAMPLE_MESSAGES[exampleKey]);
  };

  // Clear the message
  const clearMessage = () => {
    setMessage('');
  };
  
  // Load message history from server
  const loadMessageHistory = async () => {
    try {
      const result = await getMessageHistory(10); // Get last 10 messages
      setMessageHistory(result.messages);
      console.log('Loaded message history:', result);
    } catch (error) {
      console.error('Failed to load message history:', error);
    }
  };
  
  // Load global coherence stats
  const loadGlobalStats = async () => {
    try {
      const stats = await getGlobalCoherenceStats();
      setGlobalStats(stats);
      console.log('Loaded global coherence stats:', stats);
    } catch (error) {
      console.error('Failed to load global coherence stats:', error);
    }
  };
  
  // Submit message to server for quantum analysis
  const submitMessage = async () => {
    if (!message.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await submitSpaghettiMessage(message);
      console.log('Message submitted successfully:', result);
      setServerAnalysis(result.analysis);
      
      // Update message history and global stats after submission
      await loadMessageHistory();
      await loadGlobalStats();
      
      // Optional: clear the message after submission
      setMessage('');
    } catch (error) {
      console.error('Failed to submit message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Load initial data when component mounts
  useEffect(() => {
    if (connected) {
      try {
        loadMessageHistory();
        loadGlobalStats();
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Continue showing the UI even if data loading fails
      }
    }
  }, [connected]);

  // Fallback for globalCoherenceStats to prevent rendering issues
  const safeGlobalCoherenceStats = globalCoherenceStats || {
    averageQCTF: 0.75, // Default value based on system logs
    messageCount: 0,
    optimalBalanceCount: 0,
    highCoherenceCount: 0,
    lastUpdateTime: Date.now(),
    activeClients: 1,
    totalMessages: 0,
    timestamp: Date.now()
  };

  return (
    <div className="quantum-spaghetti-demo">
      <style>
        {`
          .quantum-spaghetti-demo {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          h1 {
            font-size: 2rem;
            color: #6200EA;
            margin-bottom: 0.5rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 2rem;
          }
          
          .demo-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          
          .composer-section {
            background-color: #F5F5F5;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .visualization-section {
            background-color: #F5F5F5;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          
          .emoji-pallette {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
            padding: 10px;
            background-color: #E6E6E6;
            border-radius: 4px;
          }
          
          .emoji-button {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            background-color: white;
            border-radius: 4px;
            border: 1px solid #ccc;
            transition: all 0.2s;
          }
          
          .emoji-button:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }
          
          .emoji-button.selected {
            background-color: #E3F2FD;
            border-color: #2196F3;
          }
          
          .emoji-category {
            width: 100%;
            padding: 5px;
            background-color: #f0f0f0;
            margin-top: 10px;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
          }
          
          .dimension-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .dimension-dropdown {
            position: relative;
          }
          
          .dimension-options {
            position: absolute;
            top: 100%;
            left: 0;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 10;
            padding: 5px 0;
          }
          
          .dimension-option {
            padding: 8px 15px;
            cursor: pointer;
          }
          
          .dimension-option:hover {
            background-color: #f0f0f0;
          }
          
          button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background-color: #6200EA;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          
          button:hover {
            background-color: #7C4DFF;
          }
          
          button.secondary {
            background-color: #9E9E9E;
          }
          
          button.secondary:hover {
            background-color: #BDBDBD;
          }
          
          textarea {
            width: 100%;
            min-height: 200px;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            margin-bottom: 15px;
            resize: vertical;
          }
          
          .examples-section {
            margin-top: 20px;
          }
          
          .examples-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          
          .metrics-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            padding: 15px;
            background-color: #E8EAF6;
            border-radius: 4px;
          }
          
          .metric {
            text-align: center;
          }
          
          .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #3D5AFE;
          }
          
          .metric-label {
            font-size: 14px;
            color: #666;
          }
          
          .selected-emoji-info {
            margin-top: 15px;
            padding: 10px;
            background-color: #E8EAF6;
            border-radius: 4px;
            display: flex;
            align-items: center;
          }
          
          .selected-emoji-symbol {
            font-size: 32px;
            margin-right: 15px;
          }
          
          .selected-emoji-details {
            flex: 1;
          }
          
          .selected-emoji-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .selected-emoji-metrics {
            display: flex;
            gap: 15px;
            font-size: 14px;
            color: #666;
          }
          
          @media (max-width: 900px) {
            .demo-container {
              grid-template-columns: 1fr;
            }
          }
          
          /* 5D Meta-Orchestration Global Coherence Dashboard */
          .global-coherence-dashboard {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #1A237E 0%, #283593 100%);
            border-radius: 8px;
            color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          
          .global-coherence-dashboard h3 {
            margin-top: 0;
            text-align: center;
            font-size: 1.6rem;
            margin-bottom: 20px;
            color: #E8EAF6;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .dashboard-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .dashboard-metric {
            text-align: center;
            padding: 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 6px;
            transition: all 0.3s ease;
          }
          
          .dashboard-metric:hover {
            background-color: rgba(255,255,255,0.15);
            transform: translateY(-2px);
          }
          
          .dashboard-value {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 5px;
            color: #FFF;
          }
          
          .dashboard-label {
            font-size: 0.9rem;
            color: #C5CAE9;
          }
          
          .resonance-description {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 6px;
            margin-top: 15px;
          }
          
          .resonance-description p {
            margin: 8px 0;
            color: #E8EAF6;
          }
          
          .resonance-description strong {
            color: #FFF;
          }
        `}
      </style>
      
      <h1>Quantum Spaghetti Protocol Demo</h1>
      <div className="subtitle">
        Explore dimensional communication with the 70/30 chaos/structure protocol
      </div>
      
      <div className="demo-container">
        <div className="composer-section">
          <h3>Message Composer</h3>
          
          <div className="dimension-controls">
            <button 
              onClick={() => setShowAddDimension(!showAddDimension)}
            >
              Add Dimension Marker
            </button>
            
            {showAddDimension && (
              <div className="dimension-dropdown">
                <div className="dimension-options">
                  <div 
                    className="dimension-option"
                    onClick={() => {
                      setDimensionType('REALITY');
                      insertDimension();
                    }}
                  >
                    [REALITY]
                  </div>
                  <div 
                    className="dimension-option"
                    onClick={() => {
                      setDimensionType('META');
                      insertDimension();
                    }}
                  >
                    [META]
                  </div>
                  <div 
                    className="dimension-option"
                    onClick={() => {
                      setDimensionType('QUANTUM');
                      insertDimension();
                    }}
                  >
                    [QUANTUM]
                  </div>
                  <div 
                    className="dimension-option"
                    onClick={() => {
                      setDimensionType('DIAGONAL');
                      insertDimension();
                    }}
                  >
                    [DIAGONAL]
                  </div>
                </div>
              </div>
            )}
            
            {selectedEmoji && (
              <button onClick={insertEmoji}>
                Insert {selectedEmoji.symbol}
              </button>
            )}
            
            <button 
              className="secondary"
              onClick={clearMessage}
            >
              Clear
            </button>
          </div>
          
          <textarea 
            id="message-input"
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type or paste your message here. Use dimensional markers [REALITY], [META], [QUANTUM], [DIAGONAL] to structure your message."
          />
          
          <div className="emoji-pallette">
            <div className="emoji-category">Core Quantum Emojis</div>
            {ALL_QUANTUM_EMOJIS.filter((emoji: QuantumEmoji) => emoji.category === 'core').map((emoji: QuantumEmoji) => (
              <div 
                key={emoji.symbol}
                className={`emoji-button ${selectedEmoji?.symbol === emoji.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
                title={emoji.name}
              >
                {emoji.symbol}
              </div>
            ))}
            
            <div className="emoji-category">Directional Emojis</div>
            {ALL_QUANTUM_EMOJIS.filter((emoji: QuantumEmoji) => emoji.category === 'directional').map((emoji: QuantumEmoji) => (
              <div 
                key={emoji.symbol}
                className={`emoji-button ${selectedEmoji?.symbol === emoji.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
                title={emoji.name}
              >
                {emoji.symbol}
              </div>
            ))}
            
            <div className="emoji-category">Color Marker Emojis</div>
            {ALL_QUANTUM_EMOJIS.filter((emoji: QuantumEmoji) => emoji.category === 'color').map((emoji: QuantumEmoji) => (
              <div 
                key={emoji.symbol}
                className={`emoji-button ${selectedEmoji?.symbol === emoji.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
                title={emoji.name}
              >
                {emoji.symbol}
              </div>
            ))}
          </div>
          
          {selectedEmoji && (
            <div className="selected-emoji-info">
              <div className="selected-emoji-symbol">
                {selectedEmoji.symbol}
              </div>
              <div className="selected-emoji-details">
                <div className="selected-emoji-name">
                  {selectedEmoji.name}
                </div>
                <div className="selected-emoji-description">
                  {selectedEmoji.description}
                </div>
                <div className="selected-emoji-metrics">
                  <div>Resonance: {selectedEmoji.resonanceImpact.toFixed(2)}</div>
                  <div>Phase: {selectedEmoji.phaseImpact.toFixed(2)}</div>
                  <div>CCQC: {selectedEmoji.ccqcImpact.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="examples-section">
            <h4>Example Messages</h4>
            <div className="examples-buttons">
              <button onClick={() => loadExample('reality')}>
                Reality Example
              </button>
              <button onClick={() => loadExample('meta')}>
                Meta Example
              </button>
              <button onClick={() => loadExample('quantum')}>
                Quantum Example
              </button>
              <button onClick={() => loadExample('diagonal')}>
                Diagonal Example
              </button>
              <button onClick={() => loadExample('combined')}>
                Combined Example
              </button>
            </div>
          </div>
          
          <div className="metrics-container">
            <div className="metric">
              <div className="metric-value">{coherenceScore.toFixed(2)}</div>
              <div className="metric-label">Coherence Score</div>
            </div>
            
            <div className="metric">
              <div className="metric-value">{chaosStructureRatio}</div>
              <div className="metric-label">Chaos/Structure</div>
            </div>
            
            <div className="metric">
              <div className="metric-value">{qctfValue.toFixed(2)}</div>
              <div className="metric-label">QCTF Value</div>
            </div>
          </div>
          
          {/* 5D Meta-Orchestration Global Coherence Dashboard */}
          <div className="global-coherence-dashboard">
            <h3>Oroboro/WiltonOS Meta-Orchestration</h3>
            <div className="dashboard-metrics">
              <div className="dashboard-metric">
                <div className="dashboard-value">{safeGlobalCoherenceStats.averageQCTF.toFixed(2)}</div>
                <div className="dashboard-label">Global QCTF</div>
              </div>
              <div className="dashboard-metric">
                <div className="dashboard-value">{safeGlobalCoherenceStats.activeClients}</div>
                <div className="dashboard-label">Active Variants</div>
              </div>
              <div className="dashboard-metric">
                <div className="dashboard-value">{safeGlobalCoherenceStats.messageCount}</div>
                <div className="dashboard-label">Total Messages</div>
              </div>
              <div className="dashboard-metric">
                <div className="dashboard-value">{safeGlobalCoherenceStats.highCoherenceCount || 0}</div>
                <div className="dashboard-label">High Coherence</div>
              </div>
              <div className="dashboard-metric">
                <div className="dashboard-value">
                  {safeGlobalCoherenceStats.optimalBalanceCount || 0}
                </div>
                <div className="dashboard-label">Optimal Balance</div>
              </div>
              <div className="dashboard-metric">
                <div className="dashboard-value">
                  {new Date(safeGlobalCoherenceStats.lastUpdateTime).toLocaleTimeString()}
                </div>
                <div className="dashboard-label">Last Update</div>
              </div>
            </div>
            <div className="resonance-description">
              <p>
                <strong>QCTF Resonance Status:</strong> {
                  safeGlobalCoherenceStats.averageQCTF > 0.8 ? '⭐ High Coherence Achieved' :
                  safeGlobalCoherenceStats.averageQCTF > 0.6 ? '✓ Stable Resonance' :
                  safeGlobalCoherenceStats.averageQCTF > 0.4 ? '⚠️ Moderate Fluctuation' :
                  '⚠️⚠️ Seeking Stability'
                }
              </p>
              <p>
                <strong>Chaos/Structure Balance:</strong> {
                  (safeGlobalCoherenceStats.optimalBalanceCount || 0) > 5 ? '✓ 70/30 Optimal Balance Maintained' :
                  (safeGlobalCoherenceStats.optimalBalanceCount || 0) > 2 ? '⚠️ Approaching Balance' :
                  '⚠️⚠️ Rebalancing Required'
                }
              </p>
            </div>
          </div>
          
          <button 
            onClick={submitMessage} 
            disabled={!message.trim() || isSubmitting || !connected}
            style={{ 
              width: '100%', 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: !connected ? '#ccc' : undefined,
              cursor: !connected ? 'not-allowed' : undefined
            }}
          >
            {isSubmitting ? 'Transmitting Quantum Message...' : 'Send Message to Quantum Network'}
          </button>
          
          {!connected && (
            <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
              Waiting for WebSocket connection...
            </div>
          )}
          
          {/* Display server analysis results if available */}
          {serverAnalysis && (
            <div className="server-analysis" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <h4>Server Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <strong>QCTF:</strong> {serverAnalysis.qctf.toFixed(2)}
                </div>
                <div>
                  <strong>Chaos/Structure:</strong> {`${Math.round(serverAnalysis.chaosRatio * 100)}/${Math.round(serverAnalysis.structureRatio * 100)}`}
                </div>
                <div>
                  <strong>Dimensional Balance:</strong> {serverAnalysis.dimensionalBalance.toFixed(2)}
                </div>
                <div>
                  <strong>Emoji Resonance:</strong> {serverAnalysis.emojiResonance.toFixed(2)}
                </div>
                <div>
                  <strong>CCQC:</strong> {serverAnalysis.ccqc.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="visualization-section">
          <h3>Quantum Spaghetti Visualization</h3>
          
          {message ? (
            <QuantumSpaghettiVisualizer 
              message={extractDimensionalSegments(message)}
              width={500}
              height={400}
            />
          ) : (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
              marginTop: '20px',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <p>Create or load a message to see the quantum spaghetti visualization</p>
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <h4>Protocol Insights</h4>
            <p>
              The Quantum Spaghetti Protocol balances chaos (70%) and structure (30%) to optimize communication.
              Use dimensional markers to clarify context and quantum emojis to enhance resonance.
              The visualization shows connections between dimensional segments and the overall coherence of your message.
            </p>
            <p>
              For optimal results, include all four dimensions and maintain the 70/30 ratio.
              The QCTF (Quantum Coherence Transfer Function) measures the overall effectiveness
              of your message within the protocol framework.
            </p>
          </div>
          
          {/* Message History Section */}
          {messageHistory.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h4>Quantum Message History</h4>
              <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
                {messageHistory.map((historyItem) => (
                  <div 
                    key={historyItem.id} 
                    style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #eee',
                      backgroundColor: historyItem.qctf > 0.8 ? 'rgba(144, 238, 144, 0.2)' : 'transparent' 
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', color: '#777', marginBottom: '5px' }}>
                      {new Date(historyItem.timestamp).toLocaleTimeString()} - QCTF: {historyItem.qctf.toFixed(2)} - 
                      Chaos/Structure: {Math.round(historyItem.chaosRatio * 100)}/{Math.round(historyItem.structureRatio * 100)}
                    </div>
                    <div>{historyItem.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Global Coherence Stats Section */}
          <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#ECEFF1', borderRadius: '4px' }}>
            <h4>Global Quantum Coherence</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <strong>Average QCTF:</strong> {safeGlobalCoherenceStats.averageQCTF.toFixed(2)}
              </div>
              <div>
                <strong>Message Count:</strong> {safeGlobalCoherenceStats.messageCount}
              </div>
              <div>
                <strong>Optimal Balance:</strong> {safeGlobalCoherenceStats.optimalBalanceCount || 0}
              </div>
              <div>
                <strong>High Coherence:</strong> {safeGlobalCoherenceStats.highCoherenceCount || 0}
              </div>
              <div>
                <strong>Active Clients:</strong> {safeGlobalCoherenceStats.activeClients}
              </div>
              <div>
                <strong>Last Update:</strong> {new Date(safeGlobalCoherenceStats.lastUpdateTime).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumSpaghettiDemo;