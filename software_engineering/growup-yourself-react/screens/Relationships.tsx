
import React from 'react';
import { Calendar, Heart, Gift, Coffee } from 'lucide-react';

const RelationshipScreen: React.FC = () => {
  const events = [
    { icon: Coffee, title: 'Café com Mentoria', person: 'André S.', time: 'Amanhã, 10:00', type: 'Semanal' },
    { icon: Heart, title: 'Jantar Romântico', person: 'Luiza', time: 'Sexta, 20:00', type: 'Mensal' },
    { icon: Gift, title: 'Aniversário', person: 'Maria Eduarda', time: '24 Out', type: 'Anual' },
  ];

  return (
    <div className="px-6 py-4 animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
      <section className="text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-2">Vínculos & Convivência</h2>
        <p className="text-slate-400 text-sm">Fortaleça suas conexões humanas.</p>
      </section>

      {/* Calendar Strip (Mock) */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
        {[
          { d: '22', day: 'D' },
          { d: '23', day: 'S' },
          { d: '24', day: 'T', active: true },
          { d: '25', day: 'Q' },
          { d: '26', day: 'Q' },
        ].map((date, i) => (
          <div key={i} className={`flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${
            date.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400'
          }`}>
            <span className="text-[10px] font-bold">{date.day}</span>
            <span className="text-base font-bold">{date.d}</span>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            <h3 className="font-bold dark:text-slate-200">Próximos Encontros</h3>
          </div>
          <button className="text-xs font-bold text-blue-500 uppercase tracking-widest">Ver Todos</button>
        </div>
        {events.map((ev, i) => (
          <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-500">
              <ev.icon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-bold dark:text-slate-100">{ev.title}</h4>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{ev.type}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{ev.person} • {ev.time}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Action */}
      <div className="p-6 bg-gradient-to-r from-blue-300 to-blue-500 rounded-3xl text-white shadow-lg">
        <h4 className="font-bold text-lg mb-1">Crie memórias</h4>
        <p className="text-sm opacity-90 mb-4">Mande uma mensagem para alguém que você não fala há algum tempo.</p>
        <button className="px-6 py-2 bg-white text-blue-500 rounded-full font-bold text-sm shadow-md">Sugerir contato</button>
      </div>
    </div>
  );
};

export default RelationshipScreen;
