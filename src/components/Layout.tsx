import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div id="enterprise-workspace" className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Lateral navigation panel */}
      <Sidebar />

      {/* Main operational column */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar paths */}
        <Header />

        {/* Central screen dashboard wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="w-full max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
