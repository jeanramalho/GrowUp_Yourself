
import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

const FinanceScreen: React.FC = () => {
  const data = [
    { name: 'Seg', val: 120 },
    { name: 'Ter', val: 45 },
    { name: 'Qua', val: 200 },
    { name: 'Qui', val: 80 },
    { name: 'Sex', val: 150 },
    { name: 'Sab', val: 300 },
    { name: 'Dom', val: 100 },
  ];

  return (
    <div className="px-6 py-6 animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Finanças</h2>
          <p className="text-slate-400 text-sm">Gestão de Prosperidade</p>
        </div>
        <div className="size-12 rounded-2xl bg-blue-900/10 flex items-center justify-center text-blue-900 dark:text-blue-400">
          <DollarSign size={28} />
        </div>
      </section>

      {/* Planejamento Banner Alert */}
      <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-[2rem] flex items-center gap-4">
        <div className="size-12 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
          <AlertCircle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-red-600 dark:text-red-400">Atenção ao Planejamento</h4>
          <p className="text-xs text-red-500/80">Você utilizou 91% do orçamento de R$ 3.000 planejado para este mês.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-2 text-green-500">
            <TrendingUp size={16} />
            <span className="text-[10px] font-bold uppercase">Entradas</span>
          </div>
          <p className="text-xl font-bold dark:text-white">R$ 5.400</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <TrendingDown size={16} />
            <span className="text-[10px] font-bold uppercase">Gasto Real</span>
          </div>
          <p className="text-xl font-bold dark:text-white">R$ 2.750</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold dark:text-slate-200">Gastos Diários</h3>
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Outubro</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
              <Tooltip 
                cursor={{fill: '#f1f5f9', opacity: 0.05}} 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="val" radius={[8, 8, 8, 8]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.val > 200 ? '#0A6CF0' : '#2B8AF7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
        Lançar Nova Movimentação
      </button>
    </div>
  );
};

export default FinanceScreen;
