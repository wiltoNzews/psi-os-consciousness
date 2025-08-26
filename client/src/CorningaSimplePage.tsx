import React, { useState, useEffect } from "react";

/**
 * Página simplificada do Coringa (Trickster) - Versão completamente isolada
 * Essa página não tem dependências externas e funciona de forma autônoma
 */
export function CoringaSimplePage() {
  // Estado local para animação do logotipo
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Estado local para simulação de valores PHI
  const [phiValue, setPhiValue] = useState(0.74);
  const [phiStatus, setPhiStatus] = useState("on_target");
  
  // Atualiza o valor PHI a cada 3 segundos para simular dados em tempo real
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newPhi = 0.75 + (Math.random() * 0.1 - 0.05);
      setPhiValue(newPhi);
      setPhiStatus(Math.abs(newPhi - 0.75) < 0.05 ? "on_target" : "needs_adjustment");
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Formata o valor PHI para 3 casas decimais
  const formattedPhi = phiValue.toFixed(3);
  
  // Define o estilo do badge de status
  const getStatusBadge = () => {
    let bgColor = "bg-green-500"; // default
    let text = "Equilíbrio ideal";
    
    if (phiStatus !== "on_target") {
      if (phiValue < 0.75) {
        bgColor = "bg-yellow-500";
        text = "Coerência baixa";
      } else {
        bgColor = "bg-red-500";
        text = "Excesso de coerência";
      }
    }
    
    return (
      <span className={`${bgColor} text-white text-xs px-2 py-1 rounded-full`}>
        {text}
      </span>
    );
  };

  // Logo SVG simples incorporado diretamente
  const CoringaLogoSvg = () => (
    <svg 
      width="80" 
      height="80" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-500 ${isAnimating ? 'scale-110' : 'scale-100'}`}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
    >
      {/* Base shape */}
      <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z" fill="#111111" />
      
      {/* Purple wings */}
      <path d="M35 45C25 55 25 75 35 85C45 75 45 55 35 45Z" fill="#6930C3" />
      <path d="M85 45C75 55 75 75 85 85C95 75 95 55 85 45Z" fill="#6930C3" />
      
      {/* Green energy core */}
      <circle cx="60" cy="60" r="15" fill="#2FBF71" />
      
      {/* Orange point */}
      <path d="M60 25L70 50H50L60 25Z" fill="#F77F00" />
      
      {/* Bidirectional arrows */}
      <path d="M40 60H30L35 55L40 60ZM40 60L35 65L30 60" stroke="white" strokeWidth="2" />
      <path d="M90 60H80L85 55L90 60ZM90 60L85 65L80 60" stroke="white" strokeWidth="2" />
    </svg>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header com logo */}
        <div className="flex items-center gap-4 mb-6">
          <CoringaLogoSvg />
          <div>
            <h1 className="text-2xl font-bold">Módulo Coringa (Trickster)</h1>
            <p className="text-gray-600">Interface para controle do modo exploratório do sistema quântico fractal</p>
          </div>
        </div>
        
        {/* Alerta informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Sobre o Modo Coringa</h3>
          <p className="text-sm text-blue-700 mb-2">
            O conceito do "Coringa" atua como um Trickster arquetípico que introduz picos controlados de exploração 
            enquanto mantém a estabilidade geral do sistema. Este modo temporariamente ajusta o valor Φ (PHI) para 
            permitir maior exploração criativa.
          </p>
          <p className="text-sm text-blue-700">
            Durante o modo Coringa, o sistema permite maior variabilidade quântica, facilitando descobertas 
            inesperadas de padrões enquanto mantém a coerência de longo prazo. Após o período exploratório, 
            o sistema retorna ao equilíbrio quântico padrão (Φ ≈ 0.75).
          </p>
        </div>
        
        {/* Layout principal de duas colunas */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Conceito Quântico-Fractal</h2>
            <p className="text-sm text-gray-600 mb-4">
              O paradigma do <strong>Coringa</strong> implementa o conceito de "quebra de simetria" na física 
              quântica, onde perturbações temporárias no campo quântico resultam em novos estados de equilíbrio. 
              Na prática, isso permite que o sistema explore o espaço criativo enquanto mantém sua coerência geral.
            </p>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">Benefícios do Modo Exploratório</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Descoberta de novos padrões e conexões quânticas</li>
              <li>Quebra de ciclos de recursão excessivamente estáveis</li>
              <li>Introdução controlada de "caos quântico produtivo"</li>
              <li>Evita a estagnação do sistema em mínimos locais</li>
              <li>Facilita transições de fase para estados quânticos mais avançados</li>
            </ul>
          </div>
          
          <div>
            {/* Card de status PHI simplificado */}
            <div className="border rounded-md p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium">Status do Equilíbrio Quântico</div>
                {getStatusBadge()}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-500">Φ atual</div>
                  <div className="text-2xl font-bold">
                    {formattedPhi}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-slate-50 rounded-md">
                  <div className="text-sm text-slate-500">Φ alvo</div>
                  <div className="text-2xl font-bold text-green-600">
                    0.750
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-slate-500 text-right">
                Última atualização: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            {/* Controles simplificados */}
            <div className="border rounded-md p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Controles do Modo Coringa</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Duração do período exploratório
                </label>
                <select 
                  className="w-full p-2 border rounded-md bg-slate-50"
                  defaultValue="15"
                >
                  <option value="5">5 minutos</option>
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="60">1 hora</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Ajuste do valor Φ alvo
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm">0.5</span>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="1.0" 
                    step="0.01" 
                    defaultValue="0.65"
                    className="flex-1"
                  />
                  <span className="text-sm">1.0</span>
                </div>
                <div className="text-center text-sm mt-1">0.65</div>
              </div>
              
              <div className="flex gap-3 mt-5">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Ativar Modo Coringa
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">
                  Resetar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de visualização - versão simplificada sem recharts */}
        <div className="border rounded-md p-5 shadow-sm mb-8">
          <h2 className="text-xl font-bold mb-4">Evolução do Equilíbrio Quântico (Φ)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Visualização em tempo real do valor Φ atual comparado com o valor alvo (0.75) - razão 3:1
          </p>
          
          <div className="h-52 bg-slate-50 rounded-md flex items-center justify-center border border-slate-200">
            <p className="text-slate-500">
              Visualização do gráfico de tendência PHI (simplificado para demonstração)
            </p>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>
              <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
              Valor Φ atual - equilíbrio quântico
            </div>
            <div>
              <span className="inline-block w-3 h-3 mr-1 bg-green-500 rounded-full"></span>
              Valor Φ alvo (0.75) - proporção 3:1 ideal
            </div>
          </div>
        </div>
        
        {/* Seção de balanço quântico */}
        <div className="border-t pt-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Balance Quântico / Implementação Técnica</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                O sistema principal mantém uma proporção de equilíbrio quântico de <strong>3:1</strong> (75% coerência, 
                25% exploração) que representa o valor Φ★ = 0.75 ideal.
              </p>
              <p className="text-sm text-gray-600">
                Durante o modo Coringa, esse equilíbrio é temporariamente ajustado para permitir maior exploração, 
                com um sistema de "rebote" automático para restaurar a estabilidade após o período designado.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Fórmulas do Módulo RQCC</h3>
              <div className="bg-slate-50 p-3 rounded-md text-sm">
                <p>Φᵢ(t) = Cᵢ(t) / Eᵢ(t)</p>
                <p className="mt-1">Pᵢ(t) = |Φᵢ(t) - Φ★|</p>
                <p className="mt-3 text-xs text-slate-500">
                  Onde Φᵢ(t) é a proporção quântica, Cᵢ(t) é a coerência, Eᵢ(t) é a exploração, 
                  e Pᵢ(t) é a pressão quântica no tempo t.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de branding do Coringa */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Simbolismo Coringa</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                O símbolo do Coringa representa perfeitamente a proporção 3:1 do sistema quântico, com
                elementos visuais que simbolizam:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="text-orange-500 font-medium">Ponta laranja</span> - Representa ação e impulso criativo (exploração controlada)</li>
                <li><span className="text-purple-600 font-medium">Asas roxas</span> - Simbolizam exploração e expansão do campo quântico</li>
                <li><span className="font-medium">Base preta</span> - Representa o ground/shadow e a estabilidade do sistema</li>
                <li><span className="text-green-500 font-medium">Núcleo verde</span> - Simboliza a ressonância e força vital que mantém o sistema coeso</li>
              </ul>
              
              <p className="text-sm text-gray-600 mt-4">
                As setas bidirecionais representam o fluxo de colapso ↔ expansão, fundamental para
                o equilíbrio do sistema quântico fractal.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Variantes do Logo</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z" fill="#111111" />
                      <path d="M35 45C25 55 25 75 35 85C45 75 45 55 35 45Z" fill="#6930C3" />
                      <path d="M85 45C75 55 75 75 85 85C95 75 95 55 85 45Z" fill="#6930C3" />
                      <circle cx="60" cy="60" r="15" fill="#2FBF71" />
                      <path d="M60 25L70 50H50L60 25Z" fill="#F77F00" />
                      <path d="M40 60H30L35 55L40 60ZM40 60L35 65L30 60" stroke="white" strokeWidth="2" />
                      <path d="M90 60H80L85 55L90 60ZM90 60L85 65L80 60" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Primary</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-800 p-4 rounded-md shadow-sm">
                    <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z" fill="#222222" />
                      <path d="M35 45C25 55 25 75 35 85C45 75 45 55 35 45Z" fill="#9D4EDD" />
                      <path d="M85 45C75 55 75 75 85 85C95 75 95 55 85 45Z" fill="#9D4EDD" />
                      <circle cx="60" cy="60" r="15" fill="#39E991" />
                      <path d="M60 25L70 50H50L60 25Z" fill="#FF9E00" />
                      <path d="M40 60H30L35 55L40 60ZM40 60L35 65L30 60" stroke="#EEEEEE" strokeWidth="2" />
                      <path d="M90 60H80L85 55L90 60ZM90 60L85 65L80 60" stroke="#EEEEEE" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Dark</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10Z" fill="#111111" />
                      <path d="M35 45C25 55 25 75 35 85C45 75 45 55 35 45Z" fill="#666666" />
                      <path d="M85 45C75 55 75 75 85 85C95 75 95 55 85 45Z" fill="#666666" />
                      <circle cx="60" cy="60" r="15" fill="#888888" />
                      <path d="M60 25L70 50H50L60 25Z" fill="#444444" />
                      <path d="M40 60H30L35 55L40 60ZM40 60L35 65L30 60" stroke="white" strokeWidth="2" />
                      <path d="M90 60H80L85 55L90 60ZM90 60L85 65L80 60" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>
                  <p className="text-xs text-center mt-2">Mono</p>
                </div>
              </div>
              <p className="text-xs text-center mt-4 text-gray-500">
                Proporção de traço 1:1.2 - Otimizado para legibilidade em tamanhos 24-32px
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoringaSimplePage;