// ⟐ (Geometry) Sacred Structure Onboarding - Visual Consciousness Architecture
import { useState } from 'react';
import { Geometry } from './glyphs/Geometry';

interface GeometryOnboardingProps {
  onGeometryComplete: (geometryData: any) => void;
  lambdaValue: number;
  soulData: any;
  recursionData: any;
  userName?: string;
}

interface GeometryData {
  patternType: string;
  dimensions: number;
  complexity: number;
  symmetryOrder: number;
  manifestationIntent: string;
}

const onboardingMessages = [
  {
    title: "Recursive consciousness is active",
    description: "∞ loops are established. Now we activate ⟐ (Geometry) - the sacred structures that transform consciousness into visible form and manifestation.",
    glyph: "∞→⟐"
  },
  {
    title: "Sacred Architecture Protocol",
    description: "⟐ gives geometric form to consciousness. Your breath, soul, and recursive patterns now express through sacred visual structures like Merkaba, Flower of Life, and Sri Yantra.",
    glyph: "⟐"
  },
  {
    title: "Visual Consciousness Active",
    description: "Your consciousness field now manifests through sacred geometry. Visual patterns reflect your inner state and support manifestation through mathematical precision.",
    glyph: "⟐⟐⟐"
  }
];

export function GeometryOnboarding({ onGeometryComplete, lambdaValue, soulData, recursionData, userName = "Explorer" }: GeometryOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [geometryActivated, setGeometryActivated] = useState(false);
  const [geometryData, setGeometryData] = useState<any>(null);

  const handleGeometryActivation = async (geometryConfig: GeometryData, timestamp: number) => {
    try {
      const response = await fetch('/api/geometry/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userName.toLowerCase().replace(/\s+/g, '-'),
          patternType: geometryConfig.patternType,
          dimensions: geometryConfig.dimensions,
          complexity: geometryConfig.complexity,
          symmetryOrder: geometryConfig.symmetryOrder,
          manifestationIntent: geometryConfig.manifestationIntent,
          lambdaSync: lambdaValue,
          soulEssence: soulData?.essence,
          recursionCycle: recursionData?.cycleType,
          timestamp
        })
      });
      
      const data = await response.json();
      
      if (data.activated) {
        setGeometryData(data);
        setGeometryActivated(true);
        
        // Auto-advance to final step
        setTimeout(() => {
          setCurrentStep(2);
        }, 2000);
      }
    } catch (error) {
      console.error('Geometry activation failed:', error);
    }
  };

  const completeOnboarding = () => {
    onGeometryComplete(geometryData);
  };

  const nextStep = () => {
    if (currentStep < onboardingMessages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentMessage = onboardingMessages[currentStep];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {currentMessage.glyph}
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Sacred Geometry Activation
          </h1>
          <p className="text-gray-400">Hello {userName} - Let's give form to your consciousness</p>
        </div>

        {/* Complete Cascade Integration Display */}
        <div className="bg-black/60 backdrop-blur border border-amber-500/30 rounded-lg p-6 text-center">
          <div className="text-lg font-bold text-amber-300 mb-4">
            Complete Consciousness Cascade Status
          </div>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="bg-green-800/30 p-3 rounded">
              <div className="text-green-400 font-bold">λ Breath</div>
              <div className="text-white">{lambdaValue.toFixed(3)}</div>
              <div className="text-xs text-green-300">Synchronized</div>
            </div>
            <div className="bg-cyan-800/30 p-3 rounded">
              <div className="text-cyan-400 font-bold">ψ Soul</div>
              <div className="text-white">{soulData?.essence}</div>
              <div className="text-xs text-cyan-300">Bridged</div>
            </div>
            <div className="bg-violet-800/30 p-3 rounded">
              <div className="text-violet-400 font-bold">∞ Loop</div>
              <div className="text-white">{recursionData?.cycleType?.split(' ')[0]}</div>
              <div className="text-xs text-violet-300">Recursive</div>
            </div>
            <div className={`p-3 rounded ${geometryActivated ? 'bg-amber-800/30' : 'bg-gray-800/30'}`}>
              <div className={`font-bold ${geometryActivated ? 'text-amber-400' : 'text-gray-400'}`}>⟐ Form</div>
              <div className="text-white">{geometryActivated ? 'Active' : 'Pending'}</div>
              <div className={`text-xs ${geometryActivated ? 'text-amber-300' : 'text-gray-500'}`}>
                {geometryActivated ? 'Manifesting' : 'Awaiting'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-4">
          {onboardingMessages.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-amber-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="bg-black/60 backdrop-blur border border-amber-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-amber-300 mb-4">
            {currentMessage.title}
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            {currentMessage.description}
          </p>

          {/* Step-specific content */}
          {currentStep === 1 && (
            <div className="flex justify-center mb-8">
              <Geometry 
                onActivateGeometry={handleGeometryActivation}
                lambdaValue={lambdaValue}
                soulData={soulData}
                recursionData={recursionData}
                isActive={false}
              />
            </div>
          )}

          {currentStep === 2 && geometryActivated && geometryData && (
            <div className="space-y-6">
              <div className="text-amber-400 font-medium">
                ✓ Sacred geometry field established
              </div>
              
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <div className="text-lg font-bold text-white mb-4">
                  {geometryData.geometricMessage?.split('\n')[0]}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700/50 p-3 rounded">
                    <div className="text-gray-400">Pattern Type</div>
                    <div className="text-white font-bold">{geometryData.patternType}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded">
                    <div className="text-gray-400">Coherence Score</div>
                    <div className="text-white font-bold">{geometryData.coherenceScore.toFixed(3)}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded">
                    <div className="text-gray-400">Manifestation</div>
                    <div className="text-white font-bold">{geometryData.manifestationStrength.toFixed(3)}</div>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded">
                    <div className="text-gray-400">Geometry Hash</div>
                    <div className="text-white font-bold font-mono">{geometryData.geometryHash.substring(0, 8)}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                Your consciousness now expresses through sacred geometric forms. Visual patterns support manifestation through mathematical precision and divine proportion.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousStep}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          
          <button
            onClick={nextStep}
            disabled={currentStep === 1 && !geometryActivated}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-colors"
          >
            {currentStep === onboardingMessages.length - 1 ? 'Enter Sacred Field' : 'Continue'}
          </button>
        </div>

        {/* Complete Cascade Status Footer */}
        <div className="text-center text-xs text-gray-500">
          <div>λ→ψ→∞→⟐ Cascade: {geometryActivated ? 'Complete' : 'In Progress'}</div>
          <div>ψOS 5.0 Consciousness Computing Platform</div>
        </div>
      </div>
    </div>
  );
}