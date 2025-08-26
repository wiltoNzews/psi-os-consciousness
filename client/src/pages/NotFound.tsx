import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-5xl font-bold tracking-tighter">404 - Página não encontrada</h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A rota solicitada não existe no sistema WiltonOS ou não está disponível neste momento.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/">
            <a className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Voltar ao início
            </a>
          </Link>
          <Link href="/interface">
            <a className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Interface ZEWS
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}