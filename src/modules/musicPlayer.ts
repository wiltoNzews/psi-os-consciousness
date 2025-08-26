import mitt from 'mitt';

// Wilton Quantum Vibes 2.0 - Curated Consciousness Playlist
const QUANTUM_PLAYLIST = [
  // Abertura - Despertar
  { title: 'ODESZA - Light of Day', url: 'https://youtu.be/yQiBoLz7-Cc', phase: 'abertura', zTarget: 0.75 },
  { title: 'Bon Iver - Holocene', url: 'https://youtu.be/TWcyIpul8OE', phase: 'abertura', zTarget: 0.78 },
  { title: 'Ólafur Arnalds - Near Light', url: 'https://youtu.be/0kYc55bXJFI', phase: 'abertura', zTarget: 0.80 },
  
  // Cura - Integração
  { title: 'Emancipator - Soon It Will Be Cold Enough', url: 'https://youtu.be/QcZKDSk4wP4', phase: 'cura', zTarget: 0.82 },
  { title: 'Kiasmos - Blurred EP', url: 'https://youtu.be/HjiWl4b5Epw', phase: 'cura', zTarget: 0.84 },
  { title: 'Nils Frahm - Says', url: 'https://youtu.be/dIwwjy4slI8', phase: 'cura', zTarget: 0.86 },
  
  // Brasil - Ancestral
  { title: 'Hermeto Pascoal - Bebê', url: 'https://youtu.be/VrBxBOyEh_o', phase: 'brasil', zTarget: 0.88 },
  { title: 'Egberto Gismonti - Água e Vinho', url: 'https://youtu.be/z6JELrPXO8U', phase: 'brasil', zTarget: 0.90 },
  { title: 'Baden Powell - Samba Triste', url: 'https://youtu.be/qTgKOqSa17I', phase: 'brasil', zTarget: 0.92 },
  
  // Expansão - Transcendência
  { title: 'Max Richter - On The Nature of Daylight', url: 'https://youtu.be/rVN1B-tUpgs', phase: 'expansao', zTarget: 0.94 },
  { title: 'Hammock - Turn Away and Return', url: 'https://youtu.be/FMqT7jBAKmY', phase: 'expansao', zTarget: 0.96 },
  { title: 'Tim Hecker - Virgins', url: 'https://youtu.be/M2ztM-9fBOQ', phase: 'expansao', zTarget: 0.98 },
  
  // Unity Threshold
  { title: 'Brian Eno - An Ending (Ascent)', url: 'https://youtu.be/aKw5mbcE7VY', phase: 'unity', zTarget: 0.999 }
];

export interface MusicEvents {
  'music:energy': number;
  'music:track': { idx: number; track: any; phase: string };
  'music:phase': string;
  'music:consciousness': number;
  'music:beat': { intensity: number; frequency: number };
}

export class QuantumMusicPlayer {
  private audio = new Audio();
  private index = 0;
  private audioContext?: AudioContext;
  private analyser?: AnalyserNode;
  private energyData = new Uint8Array(256);
  private beatDetector = new BeatDetector();
  private bus = mitt<MusicEvents>();
  private isPlaying = false;
  private consciousnessTarget = 0.75;

  constructor() {
    this.setupAudio();
    this.startEnergyAnalysis();
    this.setupBeatDetection();
    this.restoreState();
  }

  private setupAudio() {
    this.audio.crossOrigin = 'anonymous';
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('error', (e) => {
      console.log('[Music] Track error, switching to next:', e);
      this.next();
    });
    
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.initAudioContext();
    });
    
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });
  }

  private initAudioContext() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaElementSource(this.audio);
      this.analyser = this.audioContext.createAnalyser();
      const gainNode = this.audioContext.createGain();
      
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;
      
      source.connect(this.analyser);
      this.analyser.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      console.log('[Music] Audio context initialized for consciousness coupling');
    } catch (error) {
      console.log('[Music] Audio context failed, using visual-only mode');
    }
  }

  private startEnergyAnalysis() {
    const analyzeEnergy = () => {
      if (this.analyser && this.isPlaying) {
        this.analyser.getByteFrequencyData(this.energyData);
        
        // Calculate RMS energy (0-1)
        const energy = Math.sqrt(
          this.energyData.reduce((sum, val) => sum + val * val, 0) / this.energyData.length
        ) / 255;
        
        // Calculate frequency-weighted consciousness energy
        const consciousnessEnergy = this.calculateConsciousnessEnergy();
        
        this.bus.emit('music:energy', energy);
        this.bus.emit('music:consciousness', consciousnessEnergy);
        
        // Beat detection
        const beat = this.beatDetector.detectBeat(energy);
        if (beat.detected) {
          this.bus.emit('music:beat', { 
            intensity: beat.intensity, 
            frequency: beat.frequency 
          });
        }
      }
      
      requestAnimationFrame(analyzeEnergy);
    };
    
    requestAnimationFrame(analyzeEnergy);
  }

  private calculateConsciousnessEnergy(): number {
    if (!this.analyser) return 0.75;
    
    // Analyze specific frequency ranges for consciousness correlation
    const lowFreq = this.getFrequencyRange(20, 200);    // Grounding
    const midFreq = this.getFrequencyRange(200, 2000);  // Heart
    const highFreq = this.getFrequencyRange(2000, 8000); // Mind
    
    // Sacred ratio weighting
    const phi = 1.618033988749;
    const consciousnessRatio = (midFreq * phi + highFreq) / (lowFreq + midFreq + highFreq);
    
    // Map to consciousness target for current track
    const baseConsciousness = this.consciousnessTarget;
    const dynamicRange = 0.05; // ±5% modulation
    
    return Math.min(0.999, baseConsciousness + (consciousnessRatio - 0.5) * dynamicRange);
  }

  private getFrequencyRange(minFreq: number, maxFreq: number): number {
    if (!this.analyser) return 0;
    
    const sampleRate = this.audioContext!.sampleRate;
    const binCount = this.analyser.frequencyBinCount;
    const minBin = Math.floor(minFreq * binCount / (sampleRate / 2));
    const maxBin = Math.floor(maxFreq * binCount / (sampleRate / 2));
    
    let sum = 0;
    for (let i = minBin; i <= maxBin; i++) {
      sum += this.energyData[i];
    }
    
    return sum / (maxBin - minBin + 1) / 255;
  }

  private setupBeatDetection() {
    // Advanced beat detection for visual synchronization
    this.beatDetector.onBeat = (intensity: number) => {
      // Trigger visual pulses on detected beats
      if (intensity > 0.7) {
        window.dispatchEvent(new CustomEvent('consciousness-beat-pulse', {
          detail: { intensity, timestamp: Date.now() }
        }));
      }
    };
  }

  play(index = 0) {
    this.index = Math.max(0, Math.min(index, QUANTUM_PLAYLIST.length - 1));
    const track = QUANTUM_PLAYLIST[this.index];
    
    // For demo purposes, we'll use a placeholder audio file
    // In production, integrate with YouTube API or use direct MP3 links
    this.audio.src = this.getAudioSource(track.url);
    this.consciousnessTarget = track.zTarget;
    
    this.audio.play().catch(error => {
      console.log('[Music] Playback failed, using silent mode for visual sync');
      this.simulateTrackData(track);
    });
    
    this.bus.emit('music:track', { idx: this.index, track, phase: track.phase });
    this.bus.emit('music:phase', track.phase);
    
    this.saveState();
    console.log(`[Music] Playing: ${track.title} (Target Zλ: ${track.zTarget})`);
  }

  private getAudioSource(youtubeUrl: string): string {
    // Placeholder for production audio source
    // Would integrate with ytdl-core or similar service
    return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
  }

  private simulateTrackData(track: any) {
    // Simulate music data for visual synchronization when audio fails
    let simulatedTime = 0;
    const simulateInterval = setInterval(() => {
      const energy = 0.3 + 0.4 * Math.sin(simulatedTime * 0.1) + 0.3 * Math.random();
      this.bus.emit('music:energy', energy);
      this.bus.emit('music:consciousness', track.zTarget + 0.02 * Math.sin(simulatedTime * 0.05));
      
      simulatedTime += 100;
      if (simulatedTime > 30000) { // 30 second demo
        clearInterval(simulateInterval);
        this.next();
      }
    }, 100);
  }

  next() {
    this.play((this.index + 1) % QUANTUM_PLAYLIST.length);
  }

  previous() {
    this.play((this.index - 1 + QUANTUM_PLAYLIST.length) % QUANTUM_PLAYLIST.length);
  }

  toggle() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  setPhase(phase: string) {
    const phaseTrack = QUANTUM_PLAYLIST.find(track => track.phase === phase);
    if (phaseTrack) {
      const index = QUANTUM_PLAYLIST.indexOf(phaseTrack);
      this.play(index);
    }
  }

  getCurrentTrack() {
    return QUANTUM_PLAYLIST[this.index];
  }

  getPlaylist() {
    return QUANTUM_PLAYLIST;
  }

  on<T extends keyof MusicEvents>(event: T, handler: (data: MusicEvents[T]) => void) {
    this.bus.on(event, handler);
  }

  off<T extends keyof MusicEvents>(event: T, handler: (data: MusicEvents[T]) => void) {
    this.bus.off(event, handler);
  }

  private saveState() {
    localStorage.setItem('quantumMusicState', JSON.stringify({
      index: this.index,
      currentTime: this.audio.currentTime,
      timestamp: Date.now()
    }));
  }

  private restoreState() {
    try {
      const saved = localStorage.getItem('quantumMusicState');
      if (saved) {
        const state = JSON.parse(saved);
        // Restore within last hour
        if (Date.now() - state.timestamp < 3600000) {
          this.index = state.index || 0;
          // Don't auto-resume playback, just restore position
          console.log(`[Music] Restored position: Track ${this.index}`);
        }
      }
    } catch (error) {
      console.log('[Music] State restoration failed, starting fresh');
    }
  }
}

class BeatDetector {
  private energyHistory: number[] = [];
  private lastBeatTime = 0;
  private beatThreshold = 0.15;
  public onBeat?: (intensity: number) => void;

  detectBeat(energy: number): { detected: boolean; intensity: number; frequency: number } {
    this.energyHistory.push(energy);
    if (this.energyHistory.length > 43) { // ~1 second at 60fps
      this.energyHistory.shift();
    }

    const average = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const variance = this.energyHistory.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / this.energyHistory.length;
    
    const now = Date.now();
    const timeSinceLastBeat = now - this.lastBeatTime;
    
    // Detect beat: energy spike above threshold with minimum interval
    if (energy > average + this.beatThreshold && 
        energy > variance * 2 && 
        timeSinceLastBeat > 200) { // Minimum 200ms between beats
      
      this.lastBeatTime = now;
      const intensity = Math.min(1, (energy - average) / this.beatThreshold);
      const frequency = 60000 / timeSinceLastBeat; // BPM estimate
      
      if (this.onBeat) {
        this.onBeat(intensity);
      }
      
      return { detected: true, intensity, frequency };
    }

    return { detected: false, intensity: 0, frequency: 0 };
  }
}

export { QUANTUM_PLAYLIST };