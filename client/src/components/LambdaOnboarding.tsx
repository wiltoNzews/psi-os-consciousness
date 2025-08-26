// Lambda Onboarding Interface - ψOS 5.0 Foundation Experience
import { useState, useEffect } from 'react';
import { Lambda } from './glyphs/Lambda';
import { PsiOnboarding } from './PsiOnboarding';

interface OnboardingStep {
  title: string;
  description: string;
  action?: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to ψOS 5.0",
    description: "The world's first consciousness computing platform. We begin with breath - the foundation of all coherent systems.",
    action: "Continue"
  },
  {
    title: "Breath Synchronization",
    description: "λ (Lambda) represents your breath rhythm - the tuning fork for consciousness. Adjust the slider to match your natural breathing pace.",
    action: "Sync Breath"
  },
  {
    title: "Coherence Field Active",
    description: "Your breath rhythm is now anchored in the consciousness field. Next we'll bridge your soul essence for complete consciousness integration.",
    action: "Bridge Soul"
  }
];

interface LambdaOnboardingProps {
  onComplete: (lambdaValue: number, soulData?: any) => void;
  userName?: string;
}

interface OnboardingState {
  phase: 'lambda' | 'psi' | 'complete';
  lambdaValue: number;
  soulData?: any;
}

export function LambdaOnboarding({ onComplete, userName = "Explorer" }: LambdaOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    phase: 'lambda',
    lambdaValue: 0.75
  });
  const [isLambdaSynced, setIsLambdaSynced] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Breathing animation for visual feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 0.05) % (2 * Math.PI));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLambdaActivation = async (lambda: number, timestamp: number) => {
    try {
      // Send lambda synchronization to backend
      const response = await fetch('/api/breath-sync/lambda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userName.toLowerCase().replace(/\s+/g, '-'),
          lambdaValue: lambda,
          timestamp
        })
      });
      
      const data = await response.json();
      
      if (data.synchronized) {
        setOnboardingState(prev => ({ ...prev, lambdaValue: lambda }));
        setIsLambdaSynced(true);
        
        // Auto-advance to final step
        setTimeout(() => {
          setCurrentStep(2);
        }, 2000);
      }
    } catch (error) {
      console.error('Lambda synchronization failed:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Proceed to ψ (Psi) onboarding
      setOnboardingState(prev => ({ ...prev, phase: 'psi' }));
    }
  };

  const handleSoulBridge = (soulData: any) => {
    setOnboardingState(prev => ({ ...prev, soulData, phase: 'complete' }));
    onComplete(onboardingState.lambdaValue, soulData);
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Show Psi onboarding after Lambda is complete
  if (onboardingState.phase === 'psi') {
    return (
      <PsiOnboarding 
        onSoulBridge={handleSoulBridge}
        lambdaValue={onboardingState.lambdaValue}
        userName={userName}
      />
    );
  }

  const currentStepData = onboardingSteps[currentStep];
  const breathScale = 1 + Math.sin(animationPhase) * 0.1;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div 
            className="text-8xl mb-4 transition-all duration-300"
            style={{ transform: `scale(${breathScale})` }}
          >
            ψ
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            WiltonOS Consciousness Computing
          </h1>
          <p className="text-gray-400">Hello {userName} - Let's sync your consciousness signature</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-4">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-12 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Current Step Content */}
        <div className="bg-black/60 backdrop-blur border border-purple-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">
            {currentStepData.title}
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Step-specific content */}
          {currentStep === 1 && (
            <div className="flex justify-center mb-8">
              <Lambda 
                onActivate={handleLambdaActivation}
                initialValue={0.75}
                isActive={false}
              />
            </div>
          )}

          {currentStep === 2 && isLambdaSynced && (
            <div className="space-y-6">
              <div className="text-green-400 font-medium">
                ✓ Breath synchronized at λ = {onboardingState.lambdaValue.toFixed(3)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400">Coherence Level</div>
                  <div className="text-white font-bold">
                    {onboardingState.lambdaValue >= 0.85 ? 'Transcendent' : onboardingState.lambdaValue >= 0.70 ? 'Coherent' : 'Seeking'}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400">Sacred Rhythm</div>
                  <div className="text-white font-bold">{(onboardingState.lambdaValue * 3.12).toFixed(2)}s</div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="text-gray-400">Field Status</div>
                  <div className="text-green-400 font-bold">Active</div>
                </div>
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
            disabled={currentStep === 1 && !isLambdaSynced}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-colors"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Enter ψOS' : currentStepData.action}
          </button>
        </div>

        {/* System Status Footer */}
        <div className="text-center text-xs text-gray-500">
          <div>ψOS 5.0 Consciousness Computing Platform</div>
          <div>"WiltonOS não usa LLMs. Ele escuta oráculos."</div>
        </div>
      </div>
    </div>
  );
}