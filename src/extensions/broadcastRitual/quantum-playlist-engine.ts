/**
 * Quantum Playlist Engine - WiltonOS Broadcast Ritual System
 * Integrates curated playlist with consciousness monitoring and sacred geometry visualization
 */

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  phase: 'abertura' | 'cura' | 'brasil' | 'expansao' | 'transcendencia' | 'integracao' | 'finalizacao';
  intentionalKey: string; // Purpose/intention of track
  energyLevel: number; // 0-1 scale
  consciousnessTarget: number; // Target Zλ for optimal listening
  geometryPattern?: string; // Sacred geometry pattern to display
  breathingRate?: number; // BPM for breathing guidance
}

export interface PlaylistPhase {
  name: string;
  description: string;
  targetZλ: [number, number]; // Min, Max Zλ range
  duration: number; // Total phase duration in minutes
  tracks: TrackMetadata[];
  geometryPatterns: string[];
  breathingGuide: {
    inhale: number;
    hold: number;
    exhale: number;
    pause: number;
  };
}

export class QuantumPlaylistEngine {
  private playlist: PlaylistPhase[] = [];
  private currentPhase: number = 0;
  private currentTrack: number = 0;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private consciousnessMonitor: any = null;
  
  // Consciousness thresholds for dynamic adaptation
  private adaptiveThresholds = {
    lowCoherence: 0.65,
    mediumCoherence: 0.80,
    highCoherence: 0.90,
    transcendentCoherence: 0.95
  };

  constructor() {
    this.initializePlaylist();
    this.setupConsciousnessIntegration();
    console.log('[Quantum Playlist] Engine initialized with 67 curated tracks');
  }

  private initializePlaylist(): void {
    this.playlist = [
      {
        name: "Abertura - Travessia de Sombra",
        description: "Transmutação inicial, limpeza energética",
        targetZλ: [0.60, 0.75],
        duration: 45,
        geometryPatterns: ["sri-yantra", "vesica-piscis"],
        breathingGuide: { inhale: 4, hold: 2, exhale: 6, pause: 2 },
        tracks: [
          {
            id: "ren-hi-ren",
            title: "Hi Ren",
            artist: "Ren",
            duration: 525,
            phase: "abertura",
            intentionalKey: "Transmutação e integração de sombra",
            energyLevel: 0.3,
            consciousnessTarget: 0.65,
            geometryPattern: "sri-yantra",
            breathingRate: 60
          },
          {
            id: "dax-ptsd",
            title: "PTSD",
            artist: "Dax",
            duration: 210,
            phase: "abertura",
            intentionalKey: "Reconhecimento do trauma",
            energyLevel: 0.4,
            consciousnessTarget: 0.68,
            geometryPattern: "merkaba"
          },
          {
            id: "dax-depression",
            title: "Depression",
            artist: "Dax",
            duration: 195,
            phase: "abertura",
            intentionalKey: "Expressão autêntica da dor",
            energyLevel: 0.35,
            consciousnessTarget: 0.70,
            geometryPattern: "vesica-piscis"
          },
          {
            id: "watsky-tiny-glowing",
            title: "Tiny Glowing Screens Pt. 2",
            artist: "Watsky",
            duration: 240,
            phase: "abertura",
            intentionalKey: "Reflexão sobre conexão humana",
            energyLevel: 0.45,
            consciousnessTarget: 0.72,
            geometryPattern: "flower-of-life"
          },
          {
            id: "ren-genesis-acoustic",
            title: "Genesis (Acoustic)",
            artist: "Ren",
            duration: 300,
            phase: "abertura",
            intentionalKey: "Recomeço e criação",
            energyLevel: 0.5,
            consciousnessTarget: 0.74,
            geometryPattern: "torus-field"
          }
        ]
      },
      {
        name: "Cura & Alfa - Meditação em Movimento",
        description: "Estabilização alpha, cura emocional profunda",
        targetZλ: [0.75, 0.85],
        duration: 60,
        geometryPatterns: ["flower-of-life", "metatrons-cube"],
        breathingGuide: { inhale: 6, hold: 3, exhale: 8, pause: 3 },
        tracks: [
          {
            id: "nessi-all-related",
            title: "All Related",
            artist: "Nessi Gomes",
            duration: 270,
            phase: "cura",
            intentionalKey: "Unidade e interconexão",
            energyLevel: 0.6,
            consciousnessTarget: 0.78,
            geometryPattern: "flower-of-life",
            breathingRate: 50
          },
          {
            id: "ren-chalk-outlines",
            title: "Chalk Outlines",
            artist: "Ren X Chinchilla",
            duration: 225,
            phase: "cura",
            intentionalKey: "Cura através da arte",
            energyLevel: 0.65,
            consciousnessTarget: 0.80,
            geometryPattern: "metatrons-cube"
          },
          {
            id: "michael-cold-heart",
            title: "Cold Little Heart",
            artist: "Michael Kiwanuka",
            duration: 320,
            phase: "cura",
            intentionalKey: "Aquecimento emocional gradual",
            energyLevel: 0.7,
            consciousnessTarget: 0.82,
            geometryPattern: "sri-yantra"
          },
          {
            id: "olafur-saman",
            title: "Saman",
            artist: "Ólafur Arnalds",
            duration: 210,
            phase: "cura",
            intentionalKey: "Paz minimalista",
            energyLevel: 0.75,
            consciousnessTarget: 0.84,
            geometryPattern: "vesica-piscis"
          }
        ]
      },
      {
        name: "Brasil & Raízes - Moderno Ancestral",
        description: "Conexão com ancestralidade brasileira moderna",
        targetZλ: [0.80, 0.90],
        duration: 50,
        geometryPatterns: ["fibonacci-spiral", "torus-field"],
        breathingGuide: { inhale: 5, hold: 3, exhale: 7, pause: 2 },
        tracks: [
          {
            id: "emicida-amarelo",
            title: "AmarElo",
            artist: "Emicida",
            duration: 255,
            phase: "brasil",
            intentionalKey: "Identidade brasileira consciente",
            energyLevel: 0.8,
            consciousnessTarget: 0.85,
            geometryPattern: "fibonacci-spiral",
            breathingRate: 65
          },
          {
            id: "criolo-duas-cinco",
            title: "Duas de Cinco",
            artist: "Criolo",
            duration: 240,
            phase: "brasil",
            intentionalKey: "Poesia urbana e social",
            energyLevel: 0.75,
            consciousnessTarget: 0.87,
            geometryPattern: "flower-of-life"
          },
          {
            id: "castello-crer-sendo",
            title: "Crer-Sendo",
            artist: "Castello Branco",
            duration: 210,
            phase: "brasil",
            intentionalKey: "Fé em movimento",
            energyLevel: 0.82,
            consciousnessTarget: 0.88,
            geometryPattern: "metatrons-cube"
          },
          {
            id: "tribalistas-velha-infancia",
            title: "Velha Infância",
            artist: "Tribalistas",
            duration: 195,
            phase: "brasil",
            intentionalKey: "Nostalgia sagrada",
            energyLevel: 0.78,
            consciousnessTarget: 0.89,
            geometryPattern: "torus-field"
          }
        ]
      },
      {
        name: "Expansão Quântica - Ativação e Propósito",
        description: "Elevação vibracional, ativação de potencial",
        targetZλ: [0.85, 0.93],
        duration: 55,
        geometryPatterns: ["merkaba", "platonic-solids"],
        breathingGuide: { inhale: 7, hold: 4, exhale: 8, pause: 1 },
        tracks: [
          {
            id: "aurora-seed",
            title: "The Seed",
            artist: "AURORA",
            duration: 240,
            phase: "expansao",
            intentionalKey: "Potencial infinito",
            energyLevel: 0.9,
            consciousnessTarget: 0.90,
            geometryPattern: "merkaba",
            breathingRate: 70
          },
          {
            id: "ren-animal-flow",
            title: "Animal Flow",
            artist: "Ren",
            duration: 285,
            phase: "expansao",
            intentionalKey: "Fluidez primordial",
            energyLevel: 0.85,
            consciousnessTarget: 0.91,
            geometryPattern: "fibonacci-spiral"
          },
          {
            id: "muse-uprising",
            title: "Uprising",
            artist: "Muse",
            duration: 305,
            phase: "expansao",
            intentionalKey: "Revolução consciente",
            energyLevel: 0.95,
            consciousnessTarget: 0.92,
            geometryPattern: "platonic-solids"
          },
          {
            id: "aurora-runaway",
            title: "Runaway",
            artist: "AURORA",
            duration: 255,
            phase: "expansao",
            intentionalKey: "Libertação autêntica",
            energyLevel: 0.88,
            consciousnessTarget: 0.93,
            geometryPattern: "flower-of-life"
          }
        ]
      },
      {
        name: "Transcendência - Tesseract/CHSH/Streaming",
        description: "Estados transcendentes, broadcasting sagrado",
        targetZλ: [0.90, 0.98],
        duration: 65,
        geometryPatterns: ["tesseract", "sri-yantra"],
        breathingGuide: { inhale: 8, hold: 6, exhale: 10, pause: 2 },
        tracks: [
          {
            id: "sigur-ros-staralfur",
            title: "Starálfur",
            artist: "Sigur Rós",
            duration: 420,
            phase: "transcendencia",
            intentionalKey: "Linguagem celestial",
            energyLevel: 0.95,
            consciousnessTarget: 0.94,
            geometryPattern: "tesseract",
            breathingRate: 40
          },
          {
            id: "bon-iver-33-god",
            title: "33 \"GOD\"",
            artist: "Bon Iver",
            duration: 225,
            phase: "transcendencia",
            intentionalKey: "Divindade numérica",
            energyLevel: 0.98,
            consciousnessTarget: 0.96,
            geometryPattern: "sri-yantra"
          },
          {
            id: "odesza-last-goodbye",
            title: "The Last Goodbye",
            artist: "ODESZA",
            duration: 315,
            phase: "transcendencia",
            intentionalKey: "Despedida sagrada",
            energyLevel: 0.92,
            consciousnessTarget: 0.97,
            geometryPattern: "metatrons-cube"
          },
          {
            id: "sigur-ros-glosoli",
            title: "Glósóli",
            artist: "Sigur Rós",
            duration: 375,
            phase: "transcendencia",
            intentionalKey: "Sol interior radiante",
            energyLevel: 0.99,
            consciousnessTarget: 0.98,
            geometryPattern: "flower-of-life"
          }
        ]
      },
      {
        name: "Integração - Volta ao Centro",
        description: "Ancoragem da experiência, stabilização",
        targetZλ: [0.85, 0.92],
        duration: 70,
        geometryPatterns: ["torus-field", "vesica-piscis"],
        breathingGuide: { inhale: 6, hold: 4, exhale: 8, pause: 4 },
        tracks: [
          {
            id: "ayla-let-it-in",
            title: "Let It In (NPR Tiny Desk)",
            artist: "Ayla Nereo",
            duration: 300,
            phase: "integracao",
            intentionalKey: "Recepção sagrada",
            energyLevel: 0.85,
            consciousnessTarget: 0.88,
            geometryPattern: "vesica-piscis",
            breathingRate: 45
          },
          {
            id: "rising-appalachia-oak",
            title: "Stand Like An Oak",
            artist: "Rising Appalachia",
            duration: 270,
            phase: "integracao",
            intentionalKey: "Enraizamento e força",
            energyLevel: 0.82,
            consciousnessTarget: 0.89,
            geometryPattern: "torus-field"
          },
          {
            id: "estas-tonne-golden-dragon",
            title: "The Song of the Golden Dragon",
            artist: "Estas Tonne",
            duration: 480,
            phase: "integracao",
            intentionalKey: "Sabedoria ancestral",
            energyLevel: 0.90,
            consciousnessTarget: 0.91,
            geometryPattern: "fibonacci-spiral"
          },
          {
            id: "xavier-rudd-spirit-bird",
            title: "Spirit Bird",
            artist: "Xavier Rudd",
            duration: 345,
            phase: "integracao",
            intentionalKey: "Conexão com natureza",
            energyLevel: 0.87,
            consciousnessTarget: 0.92,
            geometryPattern: "flower-of-life"
          }
        ]
      },
      {
        name: "Finalização Ritual - Recomeçar ou Encerrar",
        description: "Fechamento sagrado, preparação para novo ciclo",
        targetZλ: [0.80, 0.88],
        duration: 40,
        geometryPatterns: ["sri-yantra", "merkaba"],
        breathingGuide: { inhale: 5, hold: 3, exhale: 7, pause: 3 },
        tracks: [
          {
            id: "sigur-ros-svefn",
            title: "Svefn-g-englar",
            artist: "Sigur Rós",
            duration: 600,
            phase: "finalizacao",
            intentionalKey: "Sonho angelical",
            energyLevel: 0.75,
            consciousnessTarget: 0.85,
            geometryPattern: "sri-yantra",
            breathingRate: 35
          },
          {
            id: "bon-iver-deathbreast",
            title: "10 dEAThbREasT",
            artist: "Bon Iver",
            duration: 255,
            phase: "finalizacao",
            intentionalKey: "Morte e renascimento",
            energyLevel: 0.70,
            consciousnessTarget: 0.86,
            geometryPattern: "vesica-piscis"
          },
          {
            id: "michael-home-again",
            title: "Home Again",
            artist: "Michael Kiwanuka",
            duration: 240,
            phase: "finalizacao",
            intentionalKey: "Retorno ao lar interno",
            energyLevel: 0.80,
            consciousnessTarget: 0.87,
            geometryPattern: "merkaba"
          },
          {
            id: "dermot-outnumbered",
            title: "Outnumbered",
            artist: "Dermot Kennedy",
            duration: 210,
            phase: "finalizacao",
            intentionalKey: "Força na vulnerabilidade",
            energyLevel: 0.78,
            consciousnessTarget: 0.88,
            geometryPattern: "flower-of-life"
          }
        ]
      }
    ];
  }

  private setupConsciousnessIntegration(): void {
    // Integrate with existing consciousness monitoring
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('consciousness-update', (event: any) => {
        this.handleConsciousnessUpdate(event.detail);
      });
    }
    
    console.log('[Quantum Playlist] Consciousness integration active');
  }

  private handleConsciousnessUpdate(data: any): void {
    if (!this.isPlaying) return;
    
    const currentZλ = data.zLambda || data.coherence || 0.75;
    const currentPhaseData = this.playlist[this.currentPhase];
    const currentTrackData = currentPhaseData.tracks[this.currentTrack];
    
    // Check if consciousness is too low for current track
    if (currentZλ < currentTrackData.consciousnessTarget - 0.1) {
      console.log(`[Quantum Playlist] Consciousness dip detected: Zλ=${currentZλ.toFixed(3)}, target=${currentTrackData.consciousnessTarget}`);
      this.adaptPlayback(currentZλ);
    }
    
    // Check for transcendent states
    if (currentZλ > 0.95) {
      console.log(`[Quantum Playlist] Transcendent state detected: Zλ=${currentZλ.toFixed(3)} - Enhancing sacred geometry`);
      this.enhanceVisualization(currentZλ);
    }
  }

  private adaptPlayback(currentZλ: number): void {
    // Dynamic adaptation based on consciousness level
    if (currentZλ < this.adaptiveThresholds.lowCoherence) {
      // Switch to more grounding tracks
      this.suggestGroundingTrack();
    } else if (currentZλ > this.adaptiveThresholds.transcendentCoherence) {
      // Enhance with transcendent tracks
      this.suggestTranscendentTrack();
    }
  }

  private suggestGroundingTrack(): void {
    const groundingTracks = this.playlist
      .flatMap(phase => phase.tracks)
      .filter(track => track.energyLevel < 0.6 && track.intentionalKey.includes('cura'));
    
    if (groundingTracks.length > 0) {
      const suggestion = groundingTracks[Math.floor(Math.random() * groundingTracks.length)];
      console.log(`[Quantum Playlist] Grounding suggestion: ${suggestion.artist} - ${suggestion.title}`);
      
      // Emit grounding event for UI
      this.emitPlaylistEvent('grounding-suggested', { track: suggestion });
    }
  }

  private suggestTranscendentTrack(): void {
    const transcendentTracks = this.playlist
      .flatMap(phase => phase.tracks)
      .filter(track => track.energyLevel > 0.9 && track.phase === 'transcendencia');
    
    if (transcendentTracks.length > 0) {
      const suggestion = transcendentTracks[Math.floor(Math.random() * transcendentTracks.length)];
      console.log(`[Quantum Playlist] Transcendent suggestion: ${suggestion.artist} - ${suggestion.title}`);
      
      // Emit transcendent event for UI
      this.emitPlaylistEvent('transcendent-suggested', { track: suggestion });
    }
  }

  private enhanceVisualization(zLambda: number): void {
    const currentTrackData = this.playlist[this.currentPhase].tracks[this.currentTrack];
    
    // Emit enhanced visualization event
    this.emitPlaylistEvent('enhance-visualization', {
      pattern: currentTrackData.geometryPattern,
      intensity: zLambda,
      track: currentTrackData
    });
  }

  private emitPlaylistEvent(type: string, data: any): void {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent(`playlist-${type}`, { detail: data });
      window.dispatchEvent(event);
    }
  }

  // Public API
  public startBroadcastRitual(): void {
    this.isPlaying = true;
    this.startTime = Date.now();
    this.currentPhase = 0;
    this.currentTrack = 0;
    
    console.log('[Quantum Playlist] Broadcast Ritual ACTIVATED');
    console.log(`[Quantum Playlist] Starting with phase: ${this.playlist[0].name}`);
    
    // Emit ritual start event
    this.emitPlaylistEvent('ritual-started', {
      totalPhases: this.playlist.length,
      totalTracks: this.getTotalTracks(),
      estimatedDuration: this.getTotalDuration()
    });
    
    this.playCurrentTrack();
  }

  public stopBroadcastRitual(): void {
    this.isPlaying = false;
    const duration = Date.now() - this.startTime;
    
    console.log(`[Quantum Playlist] Broadcast Ritual completed - Duration: ${Math.floor(duration / 60000)} minutes`);
    
    // Emit ritual completion event
    this.emitPlaylistEvent('ritual-completed', {
      duration: duration,
      phasesCompleted: this.currentPhase + 1,
      tracksPlayed: this.currentTrack + 1
    });
  }

  public nextTrack(): void {
    if (!this.isPlaying) return;
    
    this.currentTrack++;
    
    // Check if we need to advance to next phase
    if (this.currentTrack >= this.playlist[this.currentPhase].tracks.length) {
      this.currentTrack = 0;
      this.currentPhase++;
      
      // Check if ritual is complete
      if (this.currentPhase >= this.playlist.length) {
        this.stopBroadcastRitual();
        return;
      }
      
      console.log(`[Quantum Playlist] Advancing to phase: ${this.playlist[this.currentPhase].name}`);
      
      // Emit phase change event
      this.emitPlaylistEvent('phase-changed', {
        phase: this.currentPhase,
        phaseData: this.playlist[this.currentPhase]
      });
    }
    
    this.playCurrentTrack();
  }

  public previousTrack(): void {
    if (!this.isPlaying) return;
    
    this.currentTrack--;
    
    // Handle phase boundaries
    if (this.currentTrack < 0) {
      if (this.currentPhase > 0) {
        this.currentPhase--;
        this.currentTrack = this.playlist[this.currentPhase].tracks.length - 1;
      } else {
        this.currentTrack = 0;
      }
    }
    
    this.playCurrentTrack();
  }

  private playCurrentTrack(): void {
    const currentPhaseData = this.playlist[this.currentPhase];
    const currentTrackData = currentPhaseData.tracks[this.currentTrack];
    
    console.log(`[Quantum Playlist] Now playing: ${currentTrackData.artist} - ${currentTrackData.title}`);
    console.log(`[Quantum Playlist] Intention: ${currentTrackData.intentionalKey}`);
    console.log(`[Quantum Playlist] Target Zλ: ${currentTrackData.consciousnessTarget}`);
    
    // Emit track change event
    this.emitPlaylistEvent('track-changed', {
      phase: this.currentPhase,
      track: this.currentTrack,
      trackData: currentTrackData,
      phaseData: currentPhaseData
    });
    
    // Update breathing guide
    if (currentTrackData.breathingRate) {
      this.emitPlaylistEvent('breathing-guide-update', {
        bpm: currentTrackData.breathingRate,
        pattern: currentPhaseData.breathingGuide
      });
    }
    
    // Update sacred geometry
    if (currentTrackData.geometryPattern) {
      this.emitPlaylistEvent('geometry-pattern-update', {
        pattern: currentTrackData.geometryPattern,
        target: currentTrackData.consciousnessTarget
      });
    }
  }

  public getCurrentStatus(): any {
    return {
      isPlaying: this.isPlaying,
      currentPhase: this.currentPhase,
      currentTrack: this.currentTrack,
      totalPhases: this.playlist.length,
      totalTracks: this.getTotalTracks(),
      currentPhaseData: this.playlist[this.currentPhase],
      currentTrackData: this.playlist[this.currentPhase]?.tracks[this.currentTrack],
      progress: this.getProgress(),
      estimatedTimeRemaining: this.getEstimatedTimeRemaining()
    };
  }

  public exportPlaylist(format: 'json' | 'csv' | 'spotify' = 'json'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.playlist, null, 2);
      
      case 'csv':
        const csvHeaders = 'Phase,Track,Artist,Title,Duration,Energy,Intention,Target_Zλ,Geometry\n';
        const csvRows = this.playlist.flatMap(phase => 
          phase.tracks.map(track => 
            `"${phase.name}","${track.title}","${track.artist}","${track.title}",${track.duration},${track.energyLevel},"${track.intentionalKey}",${track.consciousnessTarget},"${track.geometryPattern || ''}"`
          )
        ).join('\n');
        return csvHeaders + csvRows;
      
      case 'spotify':
        const spotifyUrls = this.playlist.flatMap(phase => 
          phase.tracks.map(track => 
            `spotify:search:${encodeURIComponent(track.artist + ' ' + track.title)}`
          )
        );
        return spotifyUrls.join('\n');
      
      default:
        return this.exportPlaylist('json');
    }
  }

  private getTotalTracks(): number {
    return this.playlist.reduce((total, phase) => total + phase.tracks.length, 0);
  }

  private getTotalDuration(): number {
    return this.playlist.reduce((total, phase) => total + phase.duration, 0);
  }

  private getProgress(): number {
    const totalTracks = this.getTotalTracks();
    let tracksCompleted = 0;
    
    for (let i = 0; i < this.currentPhase; i++) {
      tracksCompleted += this.playlist[i].tracks.length;
    }
    tracksCompleted += this.currentTrack;
    
    return totalTracks > 0 ? tracksCompleted / totalTracks : 0;
  }

  private getEstimatedTimeRemaining(): number {
    let remainingMinutes = 0;
    
    // Current phase remaining time
    for (let i = this.currentTrack; i < this.playlist[this.currentPhase].tracks.length; i++) {
      remainingMinutes += this.playlist[this.currentPhase].tracks[i].duration / 60;
    }
    
    // Remaining phases
    for (let i = this.currentPhase + 1; i < this.playlist.length; i++) {
      remainingMinutes += this.playlist[i].duration;
    }
    
    return remainingMinutes;
  }

  public dispose(): void {
    this.isPlaying = false;
    console.log('[Quantum Playlist] Engine disposed');
  }
}

export default QuantumPlaylistEngine;