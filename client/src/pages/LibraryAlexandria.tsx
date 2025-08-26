import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

/**
 * Componente que integra a Library of Alexandria no React
 * Usando iframe para manter a funcionalidade existente enquanto
 * permitimos navegação suave no contexto do aplicativo React
 */
const LibraryAlexandria: React.FC = () => {
  useEffect(() => {
    // Quando o componente for montado, definir o título da página
    document.title = "Library of Alexandria | Z-Law - WiltonOS";
    
    return () => {
      // Restaurar o título ao desmontar o componente
      document.title = "WiltonOS - Quantum Cognitive Exploration Platform";
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 border-b bg-muted/20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar ao WiltonOS
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Library of Alexandria | Z-Law
            </h1>
          </div>
          <div className="w-[100px]"></div>
        </div>
      </div>
      
      <div className="flex-1 container mx-auto py-0">
        <iframe 
          src="/library"
          className="w-full h-[calc(100vh-80px)] border-0"
          title="Library of Alexandria"
        />
      </div>
    </div>
  );
};

export default LibraryAlexandria;