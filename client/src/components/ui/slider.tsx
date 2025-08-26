import React, { useState } from "react";

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente Slider para seleção de valores numéricos
 * Suporta valores min/max, step, e callbacks para mudanças
 */
export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
  className = "",
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  // Calcula a porcentagem do valor atual dentro do intervalo
  const getPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };
  
  // Converte uma posição X para um valor
  const positionToValue = (position: number, trackWidth: number) => {
    const percentage = Math.max(0, Math.min(position / trackWidth, 1));
    let newValue = min + percentage * (max - min);
    
    // Aplica step se necessário
    if (step !== 0) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Garante que o valor esteja dentro dos limites
    return Math.max(min, Math.min(max, newValue));
  };
  
  // Atualiza o valor com base no evento de mouse/touch
  const updateValue = (event: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    
    const track = event.currentTarget as HTMLDivElement;
    const trackRect = track.getBoundingClientRect();
    
    let clientX: number;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }
    
    const position = clientX - trackRect.left;
    const newValue = positionToValue(position, trackRect.width);
    
    onChange(newValue);
  };
  
  // Handlers de eventos
  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(event);
    
    // Adiciona event listeners temporários para o dragging
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    
    const track = document.getElementById('slider-track');
    if (!track) return;
    
    const trackRect = track.getBoundingClientRect();
    const position = event.clientX - trackRect.left;
    const newValue = positionToValue(position, trackRect.width);
    
    onChange(newValue);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove os event listeners temporários
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Handlers para touch events (mobile)
  const handleTouchStart = (event: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(event);
  };
  
  const handleTouchMove = (event: React.TouchEvent) => {
    if (disabled) return;
    updateValue(event);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Estilização CSS personalizada para o slider */}
      <style jsx>{`
        .thumb {
          transition: transform 0.1s ease-out;
        }
        .thumb:active, .thumb.dragging {
          transform: scale(1.3);
        }
      `}</style>
      
      {/* Track do slider */}
      <div
        id="slider-track"
        className={`
          h-2 w-full rounded-full bg-secondary
          cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={disabled ? undefined : updateValue}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Área de preenchimento */}
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${getPercentage()}%` }}
        />
      </div>
      
      {/* Thumb (indicador) */}
      <div
        className={`
          thumb absolute top-1/2 w-4 h-4 rounded-full bg-primary 
          transform -translate-y-1/2 shadow-sm
          ${isDragging ? 'dragging' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab'}
        `}
        style={{ left: `calc(${getPercentage()}% - 0.5rem)` }}
      />
    </div>
  );
}