import React from "react";
import { Badge } from "../ui/badge";

// Status possíveis do modo Coringa
type CoringaStatus = "idle" | "active" | "cooling-down";

interface CoringaStatusBadgeProps {
  status: CoringaStatus;
  remainingTime?: number | null;
  className?: string;
}

/**
 * Componente que exibe o status atual do modo Coringa
 * Mostra um badge colorido com o status e tempo restante quando aplicável
 */
export function CoringaStatusBadge({
  status,
  remainingTime,
  className = "",
}: CoringaStatusBadgeProps) {
  // Determina a variante do badge com base no status
  const getBadgeVariant = () => {
    switch (status) {
      case "active":
        return "warning";
      case "cooling-down":
        return "info";
      default:
        return "inactive";
    }
  };

  // Determina se o badge deve pulsar
  const shouldPulse = status === "active";

  // Formata o texto do status
  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Modo Coringa Ativo";
      case "cooling-down":
        return "Resfriando";
      default:
        return "Inativo";
    }
  };

  // Formata o tempo restante, se houver
  const getTimeText = () => {
    if (!remainingTime) return "";
    
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    
    return `${seconds}s`;
  };

  // Conteúdo completo do badge
  const content = () => {
    if (status === "idle" || !remainingTime) {
      return getStatusText();
    }
    
    return `${getStatusText()} (${getTimeText()})`;
  };

  return (
    <Badge 
      variant={getBadgeVariant()} 
      pulse={shouldPulse}
      className={`px-3 py-1 text-xs ${className}`}
    >
      {content()}
    </Badge>
  );
}