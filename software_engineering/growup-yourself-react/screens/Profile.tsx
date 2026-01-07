
import React from 'react';
import { Settings, Shield, Bell, Moon, Sun, Download, User, ArrowRight } from 'lucide-react';
import { DESIGN_TOKENS } from '../constants';

interface ProfileProps {
  isDarkMode: boolean;
  onToggleDark: () => void;
}

const ProfileScreen: React.FC<ProfileProps> = ({ isDarkMode, onToggleDark }) => {
  const menuItems = [
    { icon: User, label: "Informações Pessoais" },
    { icon: Bell, label: "Notificações" },
    { icon: Shield, label: "Privacidade & Segurança" },
  ];

  return (
    <div className="px-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <section className="flex flex-col items-center gap-4 py-6">
        <div className="relative">
          <div className="size-28 rounded-full border-4 border-blue-500/20 p-1">
            <div className="size-full rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center overflow-hidden" style={{ backgroundImage: 'url(https://picsum.photos/200)' }}></div>
          </div>
          <div className="absolute bottom-0 right-0 size-8 bg-blue-600 rounded-full border-4 border-white dark:border-[#0A0F1A] flex items-center justify-center text-white">
            <span className="text-[10px] font-bold">5</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold dark:text-white">Alex Carvalho</h2>
          <p className="text-blue-500 text-xs font-bold uppercase tracking-widest mt-1">Explorador Nível 5</p>
        </div>
      </section>

      <section className="space-y-3">
        {menuItems.map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-blue-500 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500">
                <item.icon size={20} />
              </div>
              <span className="font-semibold dark:text-slate-200">{item.label}</span>
            </div>
            <ArrowRight size={18} className="text-slate-300" />
          </button>
        ))}

        <div className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
              {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <span className="font-semibold dark:text-slate-200">Modo Escuro</span>
          </div>
          <button 
            onClick={onToggleDark}
            className={`w-12 h-6 rounded-full transition-all relative ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <div className={`size-4 bg-white rounded-full absolute top-1 transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </section>

      {/* Developer Export (Requested in prompt) */}
      <section className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Download size={20} className="text-blue-500" />
          <h3 className="font-bold text-sm dark:text-slate-200">Exportar Design Tokens (JSON)</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Prontos para uso em React Native / Expo.</p>
        <pre className="text-[10px] bg-white dark:bg-slate-950 p-4 rounded-xl overflow-x-auto text-slate-400 border border-slate-200 dark:border-slate-900">
          {JSON.stringify(DESIGN_TOKENS, null, 2)}
        </pre>
      </section>

      <footer className="text-center py-8">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Design by {DESIGN_TOKENS.author}</p>
        <p className="text-[10px] text-slate-400 mt-1">v1.0.4 Prototype</p>
      </footer>
    </div>
  );
};

export default ProfileScreen;
