import React, { createContext, useState, useEffect, useRef } from "react";

export const QCSContext = createContext();

export function QCSProvider({ children }) {
  const [activeGeometry, setActiveGeometry] = useState("all");
  const [breathPhase, setBreathPhase] = useState(0);
  const [coherenceZλ, setCoherenceZλ] = useState(0.945);
  const [breathingActive, setBreathingActive] = useState(true);
  const breathStart = useRef(performance.now());

  useEffect(() => {
    const breathDuration = 3120; // milliseconds (ψ = 3.12s)
    let raf;

    const animate = (t) => {
      if (breathingActive) {
        const elapsed = (t - breathStart.current) % breathDuration;
        setBreathPhase(elapsed / breathDuration);
        setCoherenceZλ(0.940 + 0.01 * Math.sin((2 * Math.PI * elapsed) / breathDuration));
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [breathingActive]);

  const value = {
    activeGeometry,
    setActiveGeometry,
    breathPhase,
    coherenceZλ,
    breathingActive,
    setBreathingActive,
    // Helper functions
    getBreathScale: (baseScale = 1, intensity = 0.15) => {
      return baseScale + breathPhase * intensity;
    },
    isGeometryActive: (geometryType) => {
      return activeGeometry === 'all' || activeGeometry === geometryType;
    }
  };

  return (
    <QCSContext.Provider value={value}>
      {children}
    </QCSContext.Provider>
  );
}