import React from 'react';
import { ViewState } from '../types';
import { Home, PlusCircle, Shield, AlertTriangle, MessageCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  
  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
        currentView === view ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white h-screen relative shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SafariSure</h1>
          </div>
          <button onClick={() => setView('SUPPORT')} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-600">
            <MessageCircle size={20} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
            {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center z-20 pb-safe">
          <NavItem view="HOME" icon={Home} label="Home" />
          <NavItem view="BUY_FLOW" icon={PlusCircle} label="Buy Cover" />
          <NavItem view="POLICIES" icon={Shield} label="My Policies" />
          <NavItem view="CLAIMS" icon={AlertTriangle} label="Claims" />
        </nav>
      </div>
    </div>
  );
};