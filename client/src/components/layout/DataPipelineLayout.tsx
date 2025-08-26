import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Database, 
  BarChart, 
  LineChart, 
  FileText, 
  Settings, 
  HelpCircle,
  Upload,
  Home,
  Lightbulb,
  Layers
} from "lucide-react";

interface DataPipelineLayoutProps {
  children: ReactNode;
}

export function DataPipelineLayout({ children }: DataPipelineLayoutProps) {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/data-pipeline", label: "Home", icon: Home },
    { href: "/data-pipeline/datasets", label: "Datasets", icon: Database },
    { href: "/data-pipeline/analyses", label: "Analyses", icon: BarChart },
    { href: "/data-pipeline/insights", label: "Insights", icon: Lightbulb },
    { href: "/data-pipeline/reports", label: "Reports", icon: FileText },
    { href: "/data-pipeline/import", label: "Import Data", icon: Upload },
    { href: "/data-pipeline/transformations", label: "Transformations", icon: Layers },
    { href: "/data-pipeline/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4">
            <Link href="/data-pipeline">
              <a className="flex items-center">
                <BarChart className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold tracking-wide text-gray-800 dark:text-white">
                  SAAD DataPipeline
                </span>
              </a>
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      className={`${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-700 text-primary"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                    >
                      <item.icon
                        className={`${
                          isActive ? "text-primary" : "text-gray-400 dark:text-gray-400 group-hover:text-gray-500"
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
            <Link href="/data-pipeline/help">
              <a className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    <HelpCircle className="inline-block h-10 w-10 rounded-full text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 dark:text-white">
                      Help & Support
                    </p>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="w-full">
          <div className="relative z-10 flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex">
            <div className="flex-1 flex justify-between px-4 md:px-0">
              <div className="flex-1 flex items-center md:hidden">
                <Link href="/data-pipeline">
                  <a className="flex items-center">
                    <BarChart className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
                      SAAD
                    </span>
                  </a>
                </Link>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mr-2">
                  Powered by OpenAI
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}