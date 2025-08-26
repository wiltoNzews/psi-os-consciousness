import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'wouter';
import { useWiltonOSNavigation } from './WiltonOSEngine';

// Import the unified WiltonOS interface
const WiltonOSUnified = lazy(() => import('../pages/WiltonOSUnified'));

// Lazy load legacy modules for backward compatibility
const LemniScope = lazy(() => import('../modules/LemniScope').then(m => ({ default: m.LemniScope })));
const Narrativas = lazy(() => import('../modules/Narrativas').then(m => ({ default: m.Narrativas })));
const Inventario = lazy(() => import('../modules/Inventario').then(m => ({ default: m.Inventario })));
const ZLoad = lazy(() => import('../modules/ZLoad').then(m => ({ default: m.ZLoad })));
const Coerencia = lazy(() => import('../modules/Coerencia').then(m => ({ default: m.Coerencia })));

function ModuleLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">
          Carregando módulo WiltonOS...
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

export function WiltonOSRouter() {
  // Always render the unified WiltonOS interface regardless of route
  return (
    <ModuleLoader>
      <WiltonOSUnified />
    </ModuleLoader>
  );
}