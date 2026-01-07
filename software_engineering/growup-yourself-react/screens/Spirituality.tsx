
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, BookOpen, Clock } from 'lucide-react';

const SpiritualityScreen: React.FC = () => {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleStart = () => {
    if (!timerActive && !startTime) {
      const now = new Date();
      const end = new Date(now.getTime() + timeLeft * 1000);
      setStartTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setEndTime(end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    setTimerActive(!timerActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
      <section className="text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-2">Conexão Interior</h2>
        <p className="text-slate-400 text-sm">Pratique a presença e a gratidão.</p>
      </section>

      <div className="relative bg-[#0A6CF0] text-white p-8 rounded-[3rem] overflow-hidden flex flex-col items-center shadow-xl shadow-blue-500/20">
        <div className="absolute top-[-20%] right-[-10%] size-40 bg-white/10 rounded-full blur-3xl"></div>
        
        <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">Leitura — Salmo 23</span>
        
        <div className="text-[64px] font-bold tabular-nums mb-6 drop-shadow-lg tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        {startTime && (
          <div className="flex items-center gap-4 mb-8 text-xs font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
             <div className="flex items-center gap-1.5 opacity-80">
                <Clock size={12} />
                Início: {startTime}
             </div>
             <div className="w-px h-3 bg-white/20" />
             <div className="flex items-center gap-1.5 text-blue-100 font-bold">
                Alarme: {endTime}
             </div>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            onClick={handleStart}
            className="size-16 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {timerActive ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button onClick={() => { setTimeLeft(1800); setStartTime(null); setTimerActive(false); }} className="size-16 rounded-full bg-blue-400/30 text-white backdrop-blur-md flex items-center justify-center hover:bg-blue-400/50 transition-all">
            <RotateCcw size={24} />
          </button>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-blue-500" />
            <h3 className="font-bold dark:text-slate-200">Cronograma Semanal</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Concluídas</span>
        </div>
        {[
          { id: '1', title: 'Leitura Reflexiva', status: 'Ativa', progress: '30 min • Seg/Qua/Sex' },
          { id: '2', title: 'Oração Matinal', status: 'Concluído', progress: '10 min • Diário' },
        ].map((item) => (
          <div key={item.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
            <div>
              <h4 className="font-bold dark:text-slate-100">{item.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.progress}</p>
            </div>
            <button className={`${item.status === 'Concluído' ? 'text-green-500' : 'text-slate-200 dark:text-slate-700'} hover:text-green-500 transition-colors`}>
              <CheckCircle2 size={24} />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default SpiritualityScreen;
