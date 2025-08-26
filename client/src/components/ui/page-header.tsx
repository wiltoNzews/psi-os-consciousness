import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Componente PageHeader para cabeçalhos de página consistentes
 * Inclui título, descrição opcional e espaço para ações/elementos adicionais
 */
export function PageHeader({
  title,
  description,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`pb-6 mb-6 border-b ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {children && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}