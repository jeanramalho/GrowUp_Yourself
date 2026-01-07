
import React from 'react';
import { Sparkles, Activity, Wallet, Users, ChevronRight, Play } from 'lucide-react';
import { PillarType } from '../types';

interface OverviewProps {
  onPillarClick: (pillar: PillarType) => void;
}

const Overview: React.FC<OverviewProps> = ({ onPillarClick }) => {
  const activeHabits = [
    { id: '1', title: 'Leitura Reflexiva', pillar: PillarType.SPIRITUALITY, time: '30 min', icon: Sparkles, color: 'bg-blue-500' },
    { id: '2', title: 'Treino Hiit', pillar: PillarType.HEALTH, time: '40 min', icon: Activity, color: 'bg-sky-500' },
  ];

  return (
    <div className="px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold dark:text-white">Metas de Hoje</h3>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Segunda, 24 Out</span>
        </div>
        
        <div className="space-y-4">
          {activeHabits.map((habit) => (
            <div key={habit.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${habit.color} text-white`}>
                  <habit.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold dark:text-slate-100">{habit.title}</h4>
                  <p className="text-xs text-slate-400">{habit.time} • Restante</p>
                </div>
              </div>
              <button 
                onClick={() => onPillarClick(habit.pillar)}
                className="size-10 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center active:scale-90 transition-transform"
              >
                <Play size={18} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold dark:text-white mb-4">Visão dos Pilares</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { type: PillarType.SPIRITUALITY, icon: Sparkles, label: "Espírito", progress: 65, color: "from-blue-600 to-blue-800" },
            { type: PillarType.HEALTH, icon: Activity, label: "Saúde", progress: 42, color: "from-sky-400 to-sky-600" },
            { type: PillarType.FINANCE, icon: Wallet, label: "Finanças", progress: 91, color: "from-navy-600 to-blue-900" },
            { type: PillarType.RELATIONSHIPS, icon: Users, label: "Relações", progress: 30, color: "from-blue-300 to-blue-500" },
          ].map((p) => (
            <button 
              key={p.type}
              onClick={() => onPillarClick(p.type)}
              className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${p.color} text-white w-fit mb-4`}>
                <p.icon size={20} />
              </div>
              <h4 className="text-sm font-bold text-left mb-2 dark:text-slate-100">{p.label}</h4>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full">
                <div className={`h-full bg-gradient-to-r ${p.color} rounded-full`} style={{ width: `${p.progress}%` }}></div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 text-left uppercase">{p.progress}% Completo</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Overview;
