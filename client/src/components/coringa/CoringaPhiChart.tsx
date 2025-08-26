import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { usePhiMetrics, CoherenceData } from '../../hooks/usePhiMetrics';

/**
 * Componente que exibe um gráfico da evolução do valor Φ (PHI) ao longo do tempo
 * Utiliza dados históricos para mostrar tendências de equilíbrio quântico
 */
export function CoringaPhiChart() {
  // Busca os dados de métricas phi usando o hook personalizado
  const { history, isLoading, error, refreshData } = usePhiMetrics();

  // Formata os dados para exibição no gráfico
  const formatChartData = (data: CoherenceData[]) => {
    if (!data) return [];
    
    return data.map(point => ({
      ...point,
      // Converte timestamp para data formatada
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      // Formata phi para 2 casas decimais
      phiDisplay: point.phi.toFixed(2)
    }));
  };

  // Dados formatados para o gráfico
  const chartData = formatChartData(history || []);

  // Customiza o tooltip do gráfico
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm text-sm">
          <p className="font-medium">{`Horário: ${label}`}</p>
          <p className="text-blue-600">{`Φ atual: ${payload[0].value.toFixed(2)}`}</p>
          <p className="text-green-600">{`Φ alvo: ${payload[0].payload.target_phi.toFixed(2)}`}</p>
          <p className="text-gray-600">{`Taxa de mudança: ${payload[0].payload.dphi_dt.toFixed(4)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Evolução do Equilíbrio Quântico (Φ)</CardTitle>
        <CardDescription>
          Visualização em tempo real do valor Φ atual comparado com o valor alvo (0.75) - razão 3:1
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="w-full h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : error ? (
          <div className="w-full h-80 flex items-center justify-center">
            <p className="text-red-500">Erro ao carregar dados do gráfico</p>
          </div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="time" 
                  padding={{ left: 10, right: 10 }} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0.5, 1.0]} 
                  ticks={[0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                  tickFormatter={(value) => value.toFixed(1)}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {/* Área sombreada para destacar a região "ideal" */}
                <Area 
                  type="monotone" 
                  dataKey="target_phi"
                  fill="rgba(34, 197, 94, 0.1)" 
                  stroke="none"
                  activeDot={false}
                  name="Área Ideal"
                />
                
                {/* Linha de referência para o valor alvo */}
                <ReferenceLine 
                  y={0.75} 
                  stroke="#16a34a" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: 'Φ = 0.75 (ideal)', 
                    position: 'insideBottomRight',
                    style: { fill: '#16a34a', fontSize: 12 }
                  }} 
                />
                
                {/* Linha principal mostrando o valor de phi */}
                <Line
                  type="monotone"
                  dataKey="phi"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                  name="Valor Φ Atual"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
        
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>
            <span className="inline-block w-3 h-3 mr-1 bg-blue-500 rounded-full"></span>
            Valor Φ atual - equilíbrio quântico
          </div>
          <div>
            <span className="inline-block w-3 h-3 mr-1 bg-green-500 rounded-full"></span>
            Valor Φ alvo (0.75) - proporção 3:1 ideal
          </div>
        </div>
      </CardContent>
    </Card>
  );
}