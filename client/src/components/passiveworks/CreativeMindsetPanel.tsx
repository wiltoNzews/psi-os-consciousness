import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDomain, DomainType } from '@/contexts/DomainContext';
import { Brain, Lightbulb, Zap, Compass, Sparkles } from 'lucide-react';

interface CreatorProfile {
  id: string;
  name: string;
  type: 'intuitive' | 'analytical' | 'contrarian' | 'obsessive' | 'empathetic';
  description: string;
  strengths: string[];
  traits: {
    openness: number;
    independence: number;
    riskTaking: number;
    creativity: number;
    focus: number;
  };
  domainApplication: Record<DomainType, string>;
  icon: React.ReactNode;
}

interface CreativeMindsetPanelProps {
  domain: DomainType;
  className?: string;
}

/**
 * CreativeMindsetPanel - A component that showcases different creative thinking 
 * patterns based on psychological profiles of influential creators and innovators
 */
export function CreativeMindsetPanel({
  domain,
  className = '',
}: CreativeMindsetPanelProps) {
  const { domainConfig } = useDomain();
  const [activeProfile, setActiveProfile] = useState<string>('intuitive');
  const [isSimulating, setIsSimulating] = useState(false);

  const creatorProfiles: CreatorProfile[] = [
    {
      id: 'intuitive',
      name: 'Intuitive Visionary',
      type: 'intuitive',
      description: 'Follows gut feeling and aesthetic sensibility over market research or analytics. Trusts intuition and has a clear vision of future possibilities.',
      strengths: [
        'Strong aesthetic sense',
        'Imaginative future thinking',
        'Quick decision-making',
        'Sees possibilities others miss'
      ],
      traits: {
        openness: 90,
        independence: 85,
        riskTaking: 80,
        creativity: 95,
        focus: 75
      },
      domainApplication: {
        finance: 'Identifies emerging market movements before analytics detect them',
        crypto: 'Senses which blockchain projects will gain cultural adoption',
        sports: 'Visualizes new ways for teams and athletes to connect with audiences',
        general: 'Creates trend-setting products based on sense of what people will want'
      },
      icon: <Lightbulb className="h-5 w-5" />
    },
    {
      id: 'analytical',
      name: 'First-Principles Thinker',
      type: 'analytical',
      description: 'Breaks down complex problems to fundamental truths. Questions basic assumptions and rebuilds solutions from the ground up.',
      strengths: [
        'Analytical reasoning',
        'Identifying false assumptions',
        'Building novel architectures',
        'Systematic innovation'
      ],
      traits: {
        openness: 75,
        independence: 90,
        riskTaking: 85,
        creativity: 80,
        focus: 95
      },
      domainApplication: {
        finance: 'Redesigns financial systems by questioning fundamental assumptions',
        crypto: 'Creates new consensus mechanisms based on mathematical principles',
        sports: 'Reinvents training methodologies based on physics and biomechanics',
        general: 'Solves persistent problems by questioning accepted constraints'
      },
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: 'contrarian',
      name: 'Contrarian Disruptor',
      type: 'contrarian',
      description: 'Assumes consensus is wrong or incomplete and actively explores gaps in prevailing wisdom. Gains energy from proving critics wrong.',
      strengths: [
        'Challenging assumptions',
        'Identifying blind spots',
        'Resilience against criticism',
        'Finding underexplored spaces'
      ],
      traits: {
        openness: 85,
        independence: 95,
        riskTaking: 90,
        creativity: 85,
        focus: 70
      },
      domainApplication: {
        finance: 'Invests against market sentiment, finding hidden value others dismiss',
        crypto: 'Challenges blockchain orthodoxy to build contrarian protocols',
        sports: 'Creates strategies that defy conventional wisdom in athletics',
        general: 'Builds ventures in spaces others consider impossible or unprofitable'
      },
      icon: <Compass className="h-5 w-5" />
    },
    {
      id: 'obsessive',
      name: 'Obsessive Perfectionist',
      type: 'obsessive',
      description: 'Shows intense passion for their work to the point of obsession. Works tirelessly and idealizes their work as mission-driven.',
      strengths: [
        'Extraordinary attention to detail',
        'Deep domain mastery',
        'Relentless persistence',
        'Elevating quality standards'
      ],
      traits: {
        openness: 70,
        independence: 80,
        riskTaking: 65,
        creativity: 85,
        focus: 95
      },
      domainApplication: {
        finance: 'Creates meticulously designed financial products with exceptional user experience',
        crypto: 'Builds highly optimized blockchain infrastructure with attention to detail',
        sports: 'Develops comprehensive training systems that leave nothing to chance',
        general: 'Polishes products to perfection, elevating industry standards'
      },
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      id: 'empathetic',
      name: 'Empathetic Connector',
      type: 'empathetic',
      description: 'Creates spaces for others to flourish. Takes an ego-free approach and connects deeply with emotions and cultural undercurrents.',
      strengths: [
        'Understanding audience needs',
        'Cultural pattern recognition',
        'Bringing out others\' best',
        'Emotional intelligence'
      ],
      traits: {
        openness: 95,
        independence: 70,
        riskTaking: 75,
        creativity: 90,
        focus: 80
      },
      domainApplication: {
        finance: 'Develops financial products that connect emotionally with customer needs',
        crypto: 'Creates communities around blockchain projects rather than just technology',
        sports: 'Builds strong team dynamics and fan connections through emotional understanding',
        general: 'Identifies cultural shifts before they manifest in data'
      },
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const getSelectedProfile = () => {
    return creatorProfiles.find(profile => profile.id === activeProfile) || creatorProfiles[0];
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  const selectedProfile = getSelectedProfile();

  return (
    <div className={`${className} p-6 text-white`}>
      <div className="mb-5">
        <h3 className="text-xl font-medium text-white/90 mb-1 flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          Creative Mindset Simulation
        </h3>
        <p className="text-white/60 text-sm">
          Explore different creative thinking patterns based on psychological profiles of successful innovators.
        </p>
      </div>

      {/* Profile selector */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {creatorProfiles.map((profile) => (
          <button
            key={profile.id}
            className={`px-3 py-2 rounded-full text-sm flex items-center whitespace-nowrap ${
              activeProfile === profile.id 
                ? `bg-${domainConfig.color}/20 border border-${domainConfig.color}/40 text-white` 
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            } transition-colors`}
            onClick={() => setActiveProfile(profile.id)}
          >
            <span className="mr-1.5">{profile.icon}</span>
            {profile.name}
          </button>
        ))}
      </div>

      {/* Profile details */}
      <motion.div 
        className="bg-black/30 rounded-lg border border-white/10 p-4"
        key={selectedProfile.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="text-lg font-medium">{selectedProfile.name}</h4>
            <p className="text-white/70 text-sm">{selectedProfile.description}</p>
          </div>
          <div className={`p-2 rounded-full bg-${domainConfig.color}/20`}>
            {selectedProfile.icon}
          </div>
        </div>

        {/* Traits visualization */}
        <div className="mt-4 space-y-2">
          {Object.entries(selectedProfile.traits).map(([trait, value]) => (
            <div key={trait} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-white/70 capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-white/70">{value}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-${domainConfig.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="mt-5">
          <h5 className="text-sm font-medium text-white/80 mb-2">Key Strengths</h5>
          <div className="grid grid-cols-2 gap-2">
            {selectedProfile.strengths.map((strength, i) => (
              <div 
                key={i} 
                className="text-xs bg-white/5 px-3 py-2 rounded-md text-white/80"
              >
                {strength}
              </div>
            ))}
          </div>
        </div>

        {/* Domain application */}
        <div className="mt-5">
          <h5 className="text-sm font-medium text-white/80 mb-2">Application in {domainConfig.name}</h5>
          <div className="bg-white/5 p-3 rounded-md text-sm text-white/80">
            {selectedProfile.domainApplication[domain]}
          </div>
        </div>

        {/* Simulation button */}
        <div className="mt-6 flex justify-center">
          <button
            className={`px-4 py-2 rounded-md flex items-center ${
              isSimulating 
                ? `bg-${domainConfig.color}/30 text-white cursor-wait` 
                : `bg-${domainConfig.color}/20 hover:bg-${domainConfig.color}/30 text-white`
            } transition-colors`}
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <Brain className="mr-2 h-4 w-4" />
            {isSimulating ? 'Simulating...' : 'Simulate This Mindset'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}