import React from 'react';
import { motion } from 'framer-motion';

interface CoringaLogoProps {
  size?: number;
  variant?: 'primary' | 'dark' | 'mono';
  animate?: boolean;
}

/**
 * Componente que renderiza o logo Coringa (Trickster)
 * Implementa o design que reflete a proporção 3:1 (75% coerência, 25% exploração)
 */
export const CoringaLogo: React.FC<CoringaLogoProps> = ({
  size = 64,
  variant = 'primary',
  animate = true
}) => {
  // Cores conforme especificação do design
  const colors = {
    orange: '#FF6A1A', // ponta laranja (ação)
    purple: '#6930C3', // asa roxa (exploração)
    black: '#111111',  // base preta (ground/shadow)
    green: '#A4FF00',  // núcleo verde (ressonância/vida)
    white: '#FFFFFF'   // para a versão dark
  };
  
  // Seleciona a paleta de cores baseada na variante
  const getColors = () => {
    switch (variant) {
      case 'dark':
        return {
          stroke: colors.white,
          fill1: colors.orange,
          fill2: colors.purple,
          fill3: colors.black,
          core: colors.green
        };
      case 'mono':
        return {
          stroke: colors.black,
          fill1: 'none',
          fill2: 'none',
          fill3: 'none',
          core: colors.black
        };
      default:
        return {
          stroke: colors.black,
          fill1: colors.orange,
          fill2: colors.purple,
          fill3: colors.black,
          core: colors.green
        };
    }
  };
  
  const palette = getColors();
  
  // Animações para o logo
  const containerVariants = {
    initial: { scale: 0.95, opacity: 0.9 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05 }
  };
  
  const coreVariants = {
    initial: { scale: 0.9, opacity: 0.8 },
    animate: { 
      scale: 1, 
      opacity: 1,
      filter: "drop-shadow(0 0 8px rgba(164, 255, 0, 0.7))" 
    }
  };
  
  const transition = {
    yoyo: animate ? Infinity : 0,
    duration: 4,
    ease: "easeInOut"
  };
  
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="initial"
      animate={animate ? "animate" : "initial"}
      whileHover="hover"
      variants={containerVariants}
      transition={transition}
    >
      {/* Grupo principal do logo */}
      <g strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        {/* Coroa/Estrela - parte superior (laranja) */}
        <motion.path
          d="M50 10 L65 30 L50 40 L35 30 Z"
          fill={palette.fill1}
          stroke={palette.stroke}
          initial={{ y: -5 }}
          animate={{ y: 0 }}
          transition={{ ...transition, delay: 0.1 }}
        />
        
        {/* Asa esquerda (exploração - roxa) */}
        <motion.path
          d="M20 40 L50 40 L35 60 Z"
          fill={palette.fill2}
          stroke={palette.stroke}
          initial={{ x: -3 }}
          animate={{ x: 0 }}
          transition={{ ...transition, delay: 0.2 }}
        />
        
        {/* Asa direita (exploração - roxa) */}
        <motion.path
          d="M50 40 L80 40 L65 60 Z"
          fill={palette.fill2}
          stroke={palette.stroke}
          initial={{ x: 3 }}
          animate={{ x: 0 }}
          transition={{ ...transition, delay: 0.2 }}
        />
        
        {/* Base (ground/shadow - preta) */}
        <motion.path
          d="M35 60 L65 60 L50 85 Z"
          fill={palette.fill3}
          stroke={palette.stroke}
          initial={{ y: 3 }}
          animate={{ y: 0 }}
          transition={{ ...transition, delay: 0.3 }}
        />
        
        {/* Diamante central (núcleo verde - insight/vida) */}
        <motion.path
          d="M43 45 L50 40 L57 45 L50 50 Z"
          fill={palette.core}
          stroke="none"
          variants={coreVariants}
          transition={{ ...transition, delay: 0.1, duration: 2 }}
        />
        
        {/* Setas de fluxo bidirecional */}
        <motion.path
          d="M40 70 L45 65 L40 60 M60 60 L55 65 L60 70"
          fill="none"
          stroke={palette.stroke}
          strokeWidth="1.5"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.4 }}
        />
      </g>
    </motion.svg>
  );
};