import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Slider } from "../ui/slider";
import { useToast } from "../ui/toast";

import { apiRequest } from "../../lib/queryClient";
import { CoringaStatusBadge } from "./CoringaStatusBadge";

// Interface para o estado do modo Coringa
interface CoringaState {
  status: "idle" | "active" | "cooling-down";
  phiValue: number;
  remainingTime: number | null;
  cooldownTime: number | null;
}

/**
 * Componente de controles do modo Coringa
 * Permite ajustar o valor Φ e duração do modo exploratório
 */
export function CoringaControls() {
  // Estado do componente
  const [phiValue, setPhiValue] = useState(0.6);
  const [duration, setDuration] = useState(5); // em minutos
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado do modo Coringa (vem da API)
  const [coringaState, setCoringaState] = useState<CoringaState>({
    status: "idle",
    phiValue: 0,
    remainingTime: null,
    cooldownTime: null,
  });

  const { addToast } = useToast();

  // Formata o valor Φ para exibição
  const formatPhiValue = (value: number): string => {
    return value.toFixed(2);
  };

  // Formata a duração para exibição
  const formatDuration = (minutes: number): string => {
    if (minutes < 1) {
      return "30 segundos";
    } else if (minutes === 1) {
      return "1 minuto";
    } else {
      return `${minutes} minutos`;
    }
  };

  // Manipula o envio do formulário
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Conversão de minutos para segundos
      const durationSeconds = duration < 1 ? 30 : duration * 60;
      
      // Chamada da API para ativar o modo Coringa
      const response = await apiRequest("/api/coringa/activate", {
        method: "POST",
        data: {
          phiValue,
          duration: durationSeconds,
        },
      });
      
      // Atualiza o estado com a resposta da API
      if (response && response.status) {
        setCoringaState({
          status: "active",
          phiValue: response.phiValue || phiValue,
          remainingTime: response.duration || durationSeconds,
          cooldownTime: response.cooldownTime || null,
        });
        
        // Feedback de sucesso
        addToast({
          title: "Modo Coringa ativado",
          description: `Valor Φ: ${formatPhiValue(phiValue)}, Duração: ${formatDuration(duration)}`,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Erro ao ativar modo Coringa:", error);
      
      // Feedback de erro
      addToast({
        title: "Erro ao ativar Modo Coringa",
        description: "Ocorreu um erro ao tentar ativar o modo exploratório",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verifica se o botão deve estar desabilitado
  const isButtonDisabled = coringaState.status !== "idle" || isLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Controles do Coringa (Trickster)</CardTitle>
          <CoringaStatusBadge 
            status={coringaState.status}
            remainingTime={coringaState.remainingTime}
          />
        </div>
        <CardDescription>
          Ajuste os parâmetros para o modo exploratório
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Controle de valor Φ */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Valor Φ (PHI)</span>
            <span className="text-sm text-muted-foreground">
              {formatPhiValue(phiValue)}
            </span>
          </div>
          <Slider 
            min={0.3} 
            max={0.9} 
            step={0.05} 
            value={phiValue}
            onChange={setPhiValue}
            disabled={isButtonDisabled}
          />
          <p className="text-xs text-muted-foreground">
            Valores mais altos = maior exploração e menor coerência (padrão: 0.6)
          </p>
        </div>
        
        {/* Controle de duração */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Duração</span>
            <span className="text-sm text-muted-foreground">
              {formatDuration(duration)}
            </span>
          </div>
          <Slider 
            min={0.5} 
            max={10} 
            step={0.5} 
            value={duration}
            onChange={setDuration}
            disabled={isButtonDisabled}
          />
          <p className="text-xs text-muted-foreground">
            Tempo de duração do modo exploratório (0.5 = 30 segundos)
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          variant="default"
          size="lg"
          isLoading={isLoading}
          disabled={isButtonDisabled}
          onClick={handleSubmit}
          className="w-full"
        >
          Ativar Modo Coringa
        </Button>
      </CardFooter>
    </Card>
  );
}