// Module Discovery Engine - Auto-detects and maps all available modules
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ModuleInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  external?: boolean;
  available: boolean;
  lastChecked: Date;
}

export class ModuleDiscovery {
  private modules: Map<string, ModuleInfo> = new Map();
  private publicPath: string;

  constructor() {
    this.publicPath = path.join(__dirname, '../public');
    this.initializeKnownModules();
  }

  private initializeKnownModules() {
    const knownModules: ModuleInfo[] = [
      {
        id: 'geometria-sagrada-3d',
        name: 'Geometria Sagrada 3D',
        description: 'Implementação Three.js completa',
        category: 'Geometria Sagrada',
        icon: '🔮',
        url: 'geometria-sagrada-3d.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'sacred-geometry-demo',
        name: 'Demo 2D→3D→4D',
        description: 'Transições dimensionais',
        category: 'Geometria Sagrada',
        icon: '📐',
        url: 'sacred-geometry-demo.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'teatro-visual',
        name: 'Teatro Visual',
        description: 'Controles avançados & QCI',
        category: 'Geometria Sagrada',
        icon: '🎭',
        url: 'teatro-visual/index.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'divine-absurdity',
        name: 'Divine Absurdity',
        description: 'Exploração da camada humor',
        category: 'Geometria Sagrada',
        icon: '🛸',
        url: 'divine-absurdity-interface.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'ai-consensus',
        name: 'IA Consenso',
        description: 'Resolução sistemática de problemas',
        category: 'IA & Consenso',
        icon: '🤖',
        url: 'external-ai-consensus.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'wiltonos-dashboard',
        name: 'WiltonOS Dashboard',
        description: 'Inventário alma & timeline quântico',
        category: 'Dashboards Sistema',
        icon: '🏠',
        url: 'wiltonos-dashboard.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'wiltonos-control-panel',
        name: 'Painel Controle',
        description: 'Configurações sistema',
        category: 'Dashboards Sistema',
        icon: '⚙️',
        url: 'wiltonos-control-panel.html',
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'zlaw-tree',
        name: 'Z-Law Tree',
        description: 'Visualizador árvore Z-Law',
        category: 'Módulos Python',
        icon: '🌳',
        url: 'http://localhost:8502',
        external: true,
        available: false,
        lastChecked: new Date()
      },
      {
        id: 'orchestrator',
        name: 'Orchestrator',
        description: 'Interface Streamlit orquestração',
        category: 'Módulos Python',
        icon: '🎼',
        url: 'http://localhost:8501',
        external: true,
        available: false,
        lastChecked: new Date()
      }
    ];

    knownModules.forEach(module => {
      this.modules.set(module.id, module);
    });
  }

  async scanForModules(): Promise<ModuleInfo[]> {
    console.log('[Module Discovery] Scanning for available modules...');
    
    // Check local HTML files
    await this.scanLocalModules();
    
    // Check external services
    await this.scanExternalModules();
    
    const availableModules = Array.from(this.modules.values());
    console.log(`[Module Discovery] Found ${availableModules.filter(m => m.available).length} available modules`);
    
    return availableModules;
  }

  private async scanLocalModules() {
    for (const [id, module] of this.modules) {
      if (!module.external) {
        try {
          const filePath = path.join(this.publicPath, module.url);
          await fs.access(filePath);
          module.available = true;
          console.log(`[Module Discovery] ✓ ${module.name} - Available`);
        } catch (error) {
          module.available = false;
          console.log(`[Module Discovery] ✗ ${module.name} - Not found: ${module.url}`);
        }
        module.lastChecked = new Date();
      }
    }
  }

  private async scanExternalModules() {
    for (const [id, module] of this.modules) {
      if (module.external) {
        // Mark external modules as available - will be checked by client
        module.available = true;
        module.lastChecked = new Date();
        console.log(`[Module Discovery] ✓ ${module.name} - External service configured`);
      }
    }
  }

  async autoDiscoverNewModules(): Promise<ModuleInfo[]> {
    const discoveredModules: ModuleInfo[] = [];
    
    try {
      // Scan public directory for HTML files
      const files = await this.scanDirectory(this.publicPath);
      
      for (const file of files) {
        const relativePath = path.relative(this.publicPath, file);
        const moduleId = this.generateModuleId(relativePath);
        
        if (!this.modules.has(moduleId) && this.isValidModule(file)) {
          const moduleInfo = await this.analyzeModule(file, relativePath);
          if (moduleInfo) {
            this.modules.set(moduleId, moduleInfo);
            discoveredModules.push(moduleInfo);
            console.log(`[Module Discovery] 🔍 Discovered new module: ${moduleInfo.name}`);
          }
        }
      }
    } catch (error) {
      console.error('[Module Discovery] Error during auto-discovery:', error);
    }
    
    return discoveredModules;
  }

  private async scanDirectory(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, continue silently
    }
    
    return files;
  }

  private generateModuleId(relativePath: string): string {
    return relativePath
      .replace(/\\/g, '/')
      .replace(/\.html$/, '')
      .replace(/\/index$/, '')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase();
  }

  private isValidModule(filePath: string): boolean {
    const fileName = path.basename(filePath);
    
    // Skip certain files
    const skipFiles = [
      'index.html',
      'debug-iframe-test.html'
    ];
    
    return !skipFiles.includes(fileName);
  }

  private async analyzeModule(filePath: string, relativePath: string): Promise<ModuleInfo | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Extract title from HTML
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : path.basename(relativePath, '.html');
      
      // Extract description from meta tag or comments
      const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i) ||
                       content.match(/<!--\s*Description:\s*([^-]+)\s*-->/i);
      const description = descMatch ? descMatch[1].trim() : 'Módulo WiltonOS';
      
      // Determine category based on path and content
      const category = this.categorizeModule(relativePath, content);
      
      // Choose appropriate icon
      const icon = this.selectIcon(category, title);
      
      return {
        id: this.generateModuleId(relativePath),
        name: title,
        description,
        category,
        icon,
        url: relativePath.replace(/\\/g, '/'),
        available: true,
        lastChecked: new Date()
      };
    } catch (error) {
      console.error(`[Module Discovery] Error analyzing ${filePath}:`, error);
      return null;
    }
  }

  private categorizeModule(relativePath: string, content: string): string {
    const path = relativePath.toLowerCase();
    const contentLower = content.toLowerCase();
    
    if (path.includes('geometry') || path.includes('sacred') || contentLower.includes('three.js')) {
      return 'Geometria Sagrada';
    } else if (path.includes('ai') || path.includes('consensus') || contentLower.includes('artificial intelligence')) {
      return 'IA & Consenso';
    } else if (path.includes('dashboard') || path.includes('control') || path.includes('panel')) {
      return 'Dashboards Sistema';
    } else if (path.includes('memory') || path.includes('memoria')) {
      return 'Sistema Memória';
    } else if (path.includes('visual') || path.includes('theater')) {
      return 'Interfaces Visuais';
    } else {
      return 'Outros Módulos';
    }
  }

  private selectIcon(category: string, title: string): string {
    const iconMap: Record<string, string> = {
      'Geometria Sagrada': '🔮',
      'IA & Consenso': '🤖',
      'Dashboards Sistema': '📊',
      'Sistema Memória': '🧠',
      'Interfaces Visuais': '🎭',
      'Módulos Python': '🐍',
      'Outros Módulos': '⚡'
    };
    
    // Special cases based on title
    if (title.toLowerCase().includes('absurdity')) return '🛸';
    if (title.toLowerCase().includes('tree')) return '🌳';
    if (title.toLowerCase().includes('orchestrator')) return '🎼';
    if (title.toLowerCase().includes('control')) return '⚙️';
    if (title.toLowerCase().includes('home') || title.toLowerCase().includes('dashboard')) return '🏠';
    
    return iconMap[category] || '⚡';
  }

  getModulesByCategory(): Record<string, ModuleInfo[]> {
    const categories: Record<string, ModuleInfo[]> = {};
    
    for (const module of this.modules.values()) {
      if (!categories[module.category]) {
        categories[module.category] = [];
      }
      categories[module.category].push(module);
    }
    
    return categories;
  }

  getAvailableModules(): ModuleInfo[] {
    return Array.from(this.modules.values()).filter(m => m.available);
  }

  async refreshModuleStatus(): Promise<void> {
    console.log('[Module Discovery] Refreshing module status...');
    await this.scanForModules();
    await this.autoDiscoverNewModules();
  }
}

export const moduleDiscovery = new ModuleDiscovery();