
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  Wallet, 
  Users, 
  Plus, 
  MoreVertical,
  Home,
  User as UserIcon,
  Moon,
  Sun
} from 'lucide-react';
import Overview from './screens/Overview';
import SpiritualityScreen from './screens/Spirituality';
import HealthScreen from './screens/Health';
import FinanceScreen from './screens/Finance';
import RelationshipScreen from './screens/Relationships';
import ProfileScreen from './screens/Profile';
import { PillarType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Mock progress for the header
  const pillarProgress = {
    [PillarType.SPIRITUALITY]: 65,
    [PillarType.HEALTH]: 42,
    [PillarType.FINANCE]: 91,
    [PillarType.RELATIONSHIPS]: 30,
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-[#0A0F1A]', 'text-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#0A0F1A]', 'text-white');
      document.body.classList.add('bg-slate-50', 'text-slate-900');
    }
  }, [isDarkMode]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <Overview onPillarClick={(p) => setActiveTab(p)} />;
      case PillarType.SPIRITUALITY: return <SpiritualityScreen />;
      case PillarType.HEALTH: return <HealthScreen />;
      case PillarType.FINANCE: return <FinanceScreen />;
      case PillarType.RELATIONSHIPS: return <RelationshipScreen />;
      case 'profile': return <ProfileScreen isDarkMode={isDarkMode} onToggleDark={() => setIsDarkMode(!isDarkMode)} />;
      default: return <Overview onPillarClick={(p) => setActiveTab(p)} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center gap-1 transition-all ${
        activeTab === id ? 'text-blue-500 scale-110' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      <Icon size={activeTab === id ? 24 : 20} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-w-[768px] mx-auto bg-white dark:bg-[#0A0F1A] shadow-2xl relative overflow-hidden">
      {/* Header Fixo Conforme Requisito */}
      <header className="px-6 pt-10 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#0A0F1A]/80 backdrop-blur-md z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-blue-500 tracking-widest uppercase">GrowUp Yourself</p>
            <h1 className="text-xl font-bold dark:text-white">Olá, Jean</h1>
          </div>
          <button onClick={() => setActiveTab('profile')} className="size-10 rounded-full border-2 border-blue-500/20 overflow-hidden hover:scale-105 transition-transform">
             <img src="https://picsum.photos/seed/jean/100" alt="Avatar" className="size-full object-cover" />
          </button>
        </div>
        
        {/* Pilar Progress Bar in Header */}
        <div className="flex justify-between items-center px-2">
          {[
            { id: PillarType.SPIRITUALITY, icon: Sparkles },
            { id: PillarType.HEALTH, icon: Activity },
            { id: PillarType.FINANCE, icon: Wallet },
            { id: PillarType.RELATIONSHIPS, icon: Users },
          ].map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1.5 flex-1">
              <p.icon size={16} className={activeTab === p.id ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'} />
              <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${pillarProgress[p.id] > 90 ? 'bg-red-500' : 'bg-blue-500'}`} 
                  style={{ width: `${pillarProgress[p.id]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {renderScreen()}
      </main>

      {/* TabBar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[768px] h-20 bg-white/95 dark:bg-[#0A0F1A]/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <NavItem id="home" icon={Home} label="Início" />
        <NavItem id={PillarType.SPIRITUALITY} icon={Sparkles} label="Espírito" />
        <NavItem id={PillarType.HEALTH} icon={Activity} label="Saúde" />
        <NavItem id={PillarType.FINANCE} icon={Wallet} label="Finanças" />
        <NavItem id={PillarType.RELATIONSHIPS} icon={Users} label="Relações" />
      </nav>

      {/* CTA Nova Meta */}
      <button className="fixed bottom-24 right-6 size-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 transform active:scale-95 transition-all z-40">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default App;
