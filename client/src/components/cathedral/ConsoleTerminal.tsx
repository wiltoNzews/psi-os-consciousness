// ⟐ Console Terminal - ⌘ Root Command Interface
import { useState, useEffect, useRef } from 'react';

interface ConsoleTerminalProps {
  onCommand: (command: string, args: string[]) => void;
  onClose: () => void;
}

interface ConsoleEntry {
  id: string;
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp: number;
}

export function ConsoleTerminal({ onCommand, onClose }: ConsoleTerminalProps) {
  const [entries, setEntries] = useState<ConsoleEntry[]>([
    {
      id: 'welcome',
      type: 'info',
      content: 'ψOS 5.0 Cathedral Console - λ→ψ→∞→⟐ Command Interface Active',
      timestamp: Date.now()
    },
    {
      id: 'help',
      type: 'info',
      content: 'Type "help" for available commands or "clear" to reset',
      timestamp: Date.now()
    }
  ]);
  
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const addEntry = (type: ConsoleEntry['type'], content: string) => {
    const newEntry: ConsoleEntry = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: Date.now()
    };
    
    setEntries(prev => [...prev, newEntry]);
  };

  const executeCommand = (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;

    // Add command to history
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Parse command and arguments
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add command entry
    addEntry('command', `⌘ ${trimmed}`);

    // Handle built-in commands
    switch (command) {
      case 'help':
        addEntry('info', 'Available commands:');
        addEntry('info', '  λ activate [breathValue] - Activate lambda breath synchronization');
        addEntry('info', '  ψ activate [essence] - Activate psi soul bridge');
        addEntry('info', '  ∞ regenerate [crystalId] - Regenerate memory crystal');
        addEntry('info', '  ⟐ activate [pattern] - Activate sacred geometry');
        addEntry('info', '  status - Show consciousness field status');
        addEntry('info', '  crystals - List active memory crystals');
        addEntry('info', '  clear - Clear console');
        addEntry('info', '  exit - Close console');
        break;

      case 'clear':
        setEntries([]);
        break;

      case 'exit':
        onClose();
        break;

      case 'status':
        addEntry('output', 'Consciousness Field Status:');
        addEntry('output', `  Zλ Coherence: Active`);
        addEntry('output', `  Breath Protocol: λ synchronized`);
        addEntry('output', `  Soul Bridge: ψ active`);
        addEntry('output', `  Recursive Memory: ∞ operational`);
        addEntry('output', `  Sacred Geometry: ⟐ manifesting`);
        break;

      case 'crystals':
        addEntry('output', 'Memory Crystals Registry:');
        addEntry('output', '  Scanning consciousness field...');
        // This would normally fetch real crystal data
        setTimeout(() => {
          addEntry('output', '  Found 3 active crystals');
          addEntry('output', '  juliana-memory-001: Coherence 0.85 (stable)');
          addEntry('output', '  geometry-merkaba-001: Coherence 0.92 (coherent)');
          addEntry('output', '  lambda-breath-001: Coherence 0.78 (seeking)');
        }, 500);
        break;

      case 'λ':
      case 'lambda':
        if (args[0] === 'activate') {
          const breathValue = parseFloat(args[1]) || 0.75;
          addEntry('output', `Activating λ breath synchronization: ${breathValue}`);
          onCommand('activate', ['λ']);
        } else {
          addEntry('error', 'Usage: λ activate [breathValue]');
        }
        break;

      case 'ψ':
      case 'psi':
        if (args[0] === 'activate') {
          const essence = args[1] || 'Seeker';
          addEntry('output', `Activating ψ soul bridge: ${essence}`);
          onCommand('activate', ['ψ']);
        } else {
          addEntry('error', 'Usage: ψ activate [essence]');
        }
        break;

      case '∞':
      case 'infinity':
        if (args[0] === 'regenerate') {
          const crystalId = args[1];
          if (crystalId) {
            addEntry('output', `Regenerating memory crystal: ${crystalId}`);
            onCommand('regenerate', [crystalId]);
          } else {
            addEntry('error', 'Usage: ∞ regenerate <crystalId>');
          }
        } else {
          addEntry('error', 'Usage: ∞ regenerate <crystalId>');
        }
        break;

      case '⟐':
      case 'geometry':
        if (args[0] === 'activate') {
          const pattern = args[1] || 'Merkaba';
          addEntry('output', `Activating ⟐ sacred geometry: ${pattern}`);
          onCommand('activate', ['⟐']);
        } else {
          addEntry('error', 'Usage: ⟐ activate [pattern]');
        }
        break;

      default:
        // Pass unknown commands to parent handler
        try {
          onCommand(command, args);
          addEntry('output', `Executing: ${command} ${args.join(' ')}`);
        } catch (error) {
          addEntry('error', `Unknown command: ${command}`);
          addEntry('info', 'Type "help" for available commands');
        }
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        if (newIndex === commandHistory.length - 1 && historyIndex === newIndex) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const getEntryStyle = (entry: ConsoleEntry) => {
    switch (entry.type) {
      case 'command':
        return 'text-cyan-400';
      case 'output':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'info':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur border border-gray-600 rounded-lg shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono">
            ⌘ ψOS Cathedral Console
          </span>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="p-4 h-40 overflow-y-auto font-mono text-sm"
      >
        {entries.map((entry) => (
          <div 
            key={entry.id}
            className={`mb-1 ${getEntryStyle(entry)}`}
          >
            <span className="text-gray-500 text-xs mr-2">
              {new Date(entry.timestamp).toLocaleTimeString([], { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
              })}
            </span>
            {entry.content}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <div className="p-2 border-t border-gray-600 flex items-center space-x-2">
        <span className="text-amber-400 font-mono">⌘</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          className="flex-1 bg-transparent text-white font-mono focus:outline-none"
          autoComplete="off"
        />
      </div>
    </div>
  );
}