import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Interface para os dados de coerência
export interface CoherenceData {
  timestamp: number;
  phi: number;
  dphi_dt: number;
  target_phi: number;
}

// Interface para os dados atuais do valor phi
export interface PhiStatus {
  current_phi: number;
  target_phi: number;
  difference: number;
  status: 'on_target' | 'needs_adjustment';
  last_update: string;
}

// Função auxiliar para gerar dados históricos de phi
const generateMockHistory = (): CoherenceData[] => {
  const data: CoherenceData[] = [];
  const now = Math.floor(Date.now() / 1000);
  const target = 0.75;
  let phi = 0.68;
  
  // Gerar 20 pontos de dados para as últimas 2 horas
  for (let i = 0; i < 20; i++) {
    // Simular uma oscilação suave em torno do alvo (0.75)
    const oscillation = Math.sin(i / 3) * 0.1;
    phi = target + oscillation;
    if (phi > 0.95) phi = 0.95;
    if (phi < 0.55) phi = 0.55;
    
    // Calcular a derivada (taxa de mudança)
    const dphi_dt = i > 0 ? phi - data[i-1]?.phi || 0 : 0;
    
    data.push({
      timestamp: now - (20 - i) * 360, // Cada ponto a cada 6 minutos
      phi,
      dphi_dt,
      target_phi: target
    });
  }
  
  return data;
};

/**
 * Hook personalizado para acessar métricas de phi em tempo real
 * Esta versão usa dados fictícios para demonstração, evitando dependência da API
 */
export function usePhiMetrics() {
  // Estado local para simular os dados da API
  const [mockHistory, setMockHistory] = useState<CoherenceData[]>(generateMockHistory());
  const [mockStatus, setMockStatus] = useState<PhiStatus>({
    current_phi: 0.74,
    target_phi: 0.75,
    difference: 0.01,
    status: 'on_target',
    last_update: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Atualiza os dados a cada 10 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMockHistory(generateMockHistory());
      
      // Atualiza o status atual com uma pequena variação aleatória
      const currentPhi = 0.75 + (Math.random() * 0.1 - 0.05);
      setMockStatus({
        current_phi: currentPhi,
        target_phi: 0.75,
        difference: Math.abs(currentPhi - 0.75),
        status: Math.abs(currentPhi - 0.75) < 0.05 ? 'on_target' : 'needs_adjustment',
        last_update: new Date().toISOString()
      });
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Função para atualizar os dados imediatamente
  const refreshData = () => {
    setIsLoading(true);
    
    // Simula um pequeno atraso de carregamento
    setTimeout(() => {
      setMockHistory(generateMockHistory());
      const currentPhi = 0.75 + (Math.random() * 0.1 - 0.05);
      setMockStatus({
        current_phi: currentPhi,
        target_phi: 0.75,
        difference: Math.abs(currentPhi - 0.75),
        status: Math.abs(currentPhi - 0.75) < 0.05 ? 'on_target' : 'needs_adjustment',
        last_update: new Date().toISOString()
      });
      setIsLoading(false);
    }, 500);
  };
  
  return {
    history: mockHistory,
    status: mockStatus,
    isLoading,
    error: null,
    refreshData
  };
}