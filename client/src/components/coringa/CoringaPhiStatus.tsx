import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { usePhiMetrics } from '../../hooks/usePhiMetrics';

/**
 * Componente que exibe o valor atual do PHI (Φ) e seu status em relação ao valor ideal
 */
export function CoringaPhiStatus() {
  // Busca o status atual do valor phi usando nosso hook customizado
  const { status: data, isLoading, error } = usePhiMetrics();

  // Define as classes CSS para o badge de status
  const getStatusBadge = () => {
    if (!data) return null;
    
    let variant = 'default';
    let text = 'Carregando';
    
    if (data.status === 'on_target') {
      variant = 'success';
      text = 'Equilíbrio ideal';
    } else {
      if (data.current_phi < data.target_phi) {
        variant = 'warning';
        text = 'Coerência baixa';
      } else {
        variant = 'destructive';
        text = 'Excesso de coerência';
      }
    }
    
    return <Badge variant={variant as any} className="ml-2">{text}</Badge>;
  };

  // Formata o tempo da última atualização
  const formatLastUpdate = () => {
    if (!data?.last_update) return 'Desconhecido';
    try {
      return new Date(data.last_update).toLocaleTimeString();
    } catch (e) {
      return 'Formato inválido';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">Status do Equilíbrio Quântico</div>
          {getStatusBadge()}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-md">
            <div className="text-sm text-slate-500">Φ atual</div>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="text-slate-300">...</span>
              ) : error ? (
                <span className="text-red-400">Erro</span>
              ) : (
                data?.current_phi.toFixed(3)
              )}
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-50 rounded-md">
            <div className="text-sm text-slate-500">Φ alvo</div>
            <div className="text-2xl font-bold text-green-600">
              {isLoading ? (
                <span className="text-slate-300">...</span>
              ) : error ? (
                <span className="text-red-400">Erro</span>
              ) : (
                data?.target_phi.toFixed(3)
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-slate-500 text-right">
          Última atualização: {formatLastUpdate()}
        </div>
      </CardContent>
    </Card>
  );
}