import React from 'react';
import { Link, useRoute } from 'wouter';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button.tsx';
import { useTheme } from '../components/theme-provider.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet.tsx";

// Componente de cabeçalho do aplicativo
const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isHomeActive] = useRoute('/');
  const [isInterfaceActive] = useRoute('/interface');
  const [isMultimodalActive] = useRoute('/multimodal');
  const [isDocsActive] = useRoute('/docs');
  const [isLibraryActive] = useRoute('/alexandria');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto py-3 flex items-center justify-between">
        {/* Logo e nome do app */}
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="font-bold text-xl">WiltonOS</div>
              <div className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                Quantum 3:1
              </div>
            </a>
          </Link>
        </div>

        {/* Navegação - versão desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${isHomeActive ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </a>
          </Link>
          <Link href="/interface">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${isInterfaceActive ? 'text-primary' : 'text-muted-foreground'}`}>
              Interface ZEWS
            </a>
          </Link>
          <Link href="/docs">
            <a className={`text-sm font-medium transition-colors hover:text-primary ${isDocsActive ? 'text-primary' : 'text-muted-foreground'}`}>
              Documentação
            </a>
          </Link>

        </nav>

        {/* Botões de ações */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Alternar para tema escuro' : 'Alternar para tema claro'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>WiltonOS</SheetTitle>
                  <SheetDescription>
                    Sistema Quantum 3:1
                  </SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link href="/">
                    <a 
                      className={`text-sm font-medium transition-colors hover:text-primary ${isHomeActive ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/interface">
                    <a 
                      className={`text-sm font-medium transition-colors hover:text-primary ${isInterfaceActive ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Interface ZEWS
                    </a>
                  </Link>
                  <Link href="/docs">
                    <a 
                      className={`text-sm font-medium transition-colors hover:text-primary ${isDocsActive ? 'text-primary' : 'text-muted-foreground'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Documentação
                    </a>
                  </Link>

                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;