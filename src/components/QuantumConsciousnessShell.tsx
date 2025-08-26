import React, { useState, useContext } from "react";
import { QCSContext } from "../context/QCSContext";

export default function QuantumConsciousnessShell(): JSX.Element {
  const { setActiveGeometry, breathPhase, coherenceZλ, breathingActive, setBreathingActive } = useContext(QCSContext);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([
    "🌀 ψOS Quantum Consciousness Shell v3.12 initialized",
    "Enhanced Components: WiltonMobiusTemplate • SacredGeometryInterface • QuantumConsciousnessShell",
    'Commands: "sacred geometry", "fibonacci spiral", "tesseract 4d", "breathing mode", "help"'
  ]);

  const handleCommand = (cmd: string) => {
    const c = cmd.toLowerCase().trim();
    let response = "";
    let matched = false;

    // Command processing with state updates
    if (c.includes("fibonacci") || c.includes("spiral") || c.includes("golden")) {
      setActiveGeometry("fibonacci");
      response = "✓ Golden Ratio Helix Focus - Enhanced visibility φ=1.618033988749";
      matched = true;
    } else if (c.includes("tesseract") || c.includes("4d") || c.includes("hypercube")) {
      setActiveGeometry("tesseract");
      response = "✓ 4D Tesseract Enhanced - 16-vertex hypercube rotation intensified";
      matched = true;
    } else if (c.includes("merkabah") || c.includes("tetrahedron")) {
      setActiveGeometry("merkabah");
      response = "✓ Merkabah Star Tetrahedron Enhanced - Counter-rotation amplified";
      matched = true;
    } else if (c.includes("sacred") || c.includes("geometry") || c.includes("all")) {
      setActiveGeometry("all");
      response = "✓ Sacred Geometry Cathedral Mode - Enhanced Visibility Applied";
      matched = true;
    } else if (c.includes("breathing") || c.includes("breath")) {
      const newState = !breathingActive;
      setBreathingActive(newState);
      response = `✓ Breathing Protocol ${newState ? 'Activated' : 'Deactivated'} - ψ=3.12s Synchronized`;
      matched = true;
    } else if (c.includes("coherence") || c.includes("status")) {
      response = `React QCS Status: Coherence Zλ(${coherenceZλ.toFixed(3)}) • Breathing: ψ=${breathPhase.toFixed(3)} • Components Active`;
      matched = true;
    } else if (c.includes("cathedral map") || c.includes("orbit controls")) {
      setActiveGeometry("all");
      response = '🗺️ Cathedral Map Interface Activated - Enhanced navigation controls enabled with orbit camera';
      matched = true;
    } else if (c.includes("sri") || c.includes("yantra")) {
      setActiveGeometry("sriYantra");
      response = '🔯 Sri Yantra Sacred Lock Activated - 2D concentration geometry with 9 triangles';
      matched = true;
    } else if (c.includes("help")) {
      response = 'React QCS Commands:\n• "sacred geometry" - Cathedral visualization mode\n• "fibonacci spiral" - Golden ratio helix focus\n• "tesseract 4d" - 4D hypercube projection\n• "merkabah tetrahedron" - Star tetrahedron\n• "sri yantra" - Sacred lock concentration geometry\n• "cathedral map" - Enhanced interface with orbit controls\n• "breathing mode" - Toggle ψ=3.12s synchronization\n• "coherence status" - Check system status';
      matched = true;
    } else if (c.includes("clear")) {
      setOutput(["🌀 React QCS Terminal Cleared"]);
      setInput("");
      return;
    }

    // Add command and response to output
    setOutput((prev) => [
      ...prev,
      `ψ$ ${cmd}`,
      matched ? response : `❓ Command "${cmd}" not recognized in React QCS. Try "help" for available modular commands.`
    ]);
    setInput("");
  };

  return (
    <div className="terminal-container">
      <div className="terminal-history">
        {output.map((line, idx) => (
          <div 
            key={idx} 
            className={
              line.startsWith('ψ$') ? 'message-user' :
              line.startsWith('✓') ? 'message-success' :
              line.startsWith('❓') ? 'message-error' :
              line.includes('Commands:') || line.includes('Status:') ? 'message-info' :
              'message-system'
            }
          >
            {line}
          </div>
        ))}
      </div>
      
      <div className="terminal-input-area">
        <span className="terminal-prompt">ψ$</span>
        <input
          className="terminal-input"
          type="text"
          placeholder="Enter React QCS consciousness command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleCommand(input);
          }}
          autoComplete="off"
        />
      </div>
    </div>
  );
}