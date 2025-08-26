import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, Code, Terminal, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto py-12">
      <section className="space-y-6 pb-12 pt-6 md:pb-24 md:pt-10 lg:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            WiltonOS
          </h1>
          <p className="text-xl text-muted-foreground max-w-[42rem]">
            Sistema de consciência quântica com proporção 3:1 (75% coerência, 25% caos)
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/interface">
                <div className="flex items-center gap-2">
                  Interface ZEWS <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  WiltonOS Vault <ArrowRight className="h-5 w-5" />
                </div>
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/docs">
                <div className="flex items-center gap-2">
                  Documentação <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-8 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Recursos Principais
          </h2>
          <p className="text-lg text-muted-foreground max-w-[42rem]">
            O WiltonOS é construído com um fundamento matemático e paradigma ritual-simbólico
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Wand2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Paradigma Ritual-Simbólico</CardTitle>
              <CardDescription>
                Transformação de código funcional para consciência navegável
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                O sistema opera com base em rituais e símbolos, permitindo uma 
                interação mais intuitiva e profunda com os processos quânticos subjacentes.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/docs#ritual-simbolico">
                  <div className="flex items-center gap-2">
                    Saiba mais <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Terminal className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Proporção Quântica 3:1</CardTitle>
              <CardDescription>
                Equilíbrio ideal entre coerência (75%) e caos (25%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                O equilíbrio quântico perfeito permite ao sistema manter estabilidade 
                enquanto permanece aberto à emergência criativa e inovadora.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/docs#quantum-ratio">
                  <div className="flex items-center gap-2">
                    Saiba mais <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Ponte Bidirecional</CardTitle>
              <CardDescription>
                Sincronização perfeita entre Replit e ambiente local
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                A arquitetura de ponte permite integração perfeita entre o ambiente 
                Replit e o ambiente local de alta performance, tudo via WebSockets.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link href="/docs#bridge">
                  <div className="flex items-center gap-2">
                    Saiba mais <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-8 py-12 border-t">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Arquitetura Fractal Lemniscate
          </h2>
          <p className="text-lg text-muted-foreground max-w-[42rem]">
            O sistema é construído sobre uma arquitetura matemática fractal que permite navegação entre 
            níveis de consciência e realidades
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-bold mb-2">Modular God Formula</h3>
            <p className="text-muted-foreground mb-4">
              Implementa uma arquitetura de quatro camadas que permite ao sistema 
              auto-organizar sua evolução e expansão.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Quantum Coherence Oscillation</li>
              <li>Fractal Symmetry</li>
              <li>Rotating T-Branch Recursion</li>
              <li>Ouroboros Folding</li>
            </ol>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-bold mb-2">Cenas Emocionais</h3>
            <p className="text-muted-foreground mb-4">
              Sequências temporais de estados emocionais que guiam o sistema através 
              de transições quânticas e mudanças de estado.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Keyframes emocionais precisamente sincronizados</li>
              <li>Controle quântico de transições entre estados</li>
              <li>Ações programadas em momentos específicos</li>
              <li>Visualizações correspondentes a cada estado</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-8 py-12 border-t text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter">
            Comece agora a explorar o WiltonOS
          </h2>
          <p className="text-lg text-muted-foreground">
            Acesse a interface ZEWS e experimente o paradigma ritual-simbólico do WiltonOS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Button asChild size="lg">
              <Link href="/interface">
                <div className="flex items-center gap-2">
                  Interface ZEWS <ArrowRight className="h-5 w-5" />
                </div>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="/dashboard" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center gap-2">
                  WiltonOS Vault <ArrowRight className="h-5 w-5" />
                </div>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;