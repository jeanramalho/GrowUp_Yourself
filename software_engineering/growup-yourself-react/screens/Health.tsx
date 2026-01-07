
import React, { useState, useRef, useEffect } from 'react';
import { Send, Activity, BrainCircuit, Dumbbell, Apple, ClipboardList } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const HealthScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá, Jean! Analisei seu perfil (78kg, 1.78m). Seu IMC é 24.6 (Saudável). Hoje é dia de treino HIIT, quer registrar agora ou prefere uma dica de nutrição?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    const response = await getHealthAdvice(text);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const QuickAction = ({ icon: Icon, label, color }: { icon: any, label: string, color: string }) => (
    <button 
      onClick={() => handleSend(label)}
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full shadow-sm whitespace-nowrap active:scale-95 transition-transform"
    >
      <Icon size={14} className={color} />
      <span className="text-xs font-bold dark:text-slate-300">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col px-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <section className="mb-6 bg-sky-500/10 dark:bg-sky-500/5 p-4 rounded-3xl border border-sky-100 dark:border-sky-900/30 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-sky-500 uppercase">Peso Atual</span>
            <p className="text-lg font-bold dark:text-white">78.0 kg</p>
          </div>
          <div className="w-px h-8 bg-sky-200 dark:bg-sky-900/50 self-center" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-sky-500 uppercase">Meta</span>
            <p className="text-lg font-bold dark:text-white">75.0 kg</p>
          </div>
        </div>
        <div className="size-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center">
          <BrainCircuit size={20} />
        </div>
      </section>

      <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-full animate-pulse text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              GrowUp IA está digitando...
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Scroll */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-2">
        <QuickAction icon={Dumbbell} label="Registrar exercício" color="text-sky-500" />
        <QuickAction icon={Apple} label="Dica de dieta" color="text-green-500" />
        <QuickAction icon={ClipboardList} label="Adicionar exame" color="text-orange-500" />
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Como posso ajudar hoje?"
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm pl-4 dark:text-white"
        />
        <button 
          onClick={() => handleSend()}
          className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-[8px] text-center text-slate-400 mt-2 uppercase tracking-tighter">Este recurso oferece sugestões — não substitui avaliação médica.</p>
    </div>
  );
};

export default HealthScreen;
