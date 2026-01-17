
import React from 'react';
import { Map, Bike, Store, ArrowRight, Compass, Zap, Building2, UserPlus } from 'lucide-react';
import { UserType } from '../types';

interface LandingProps {
  onExplore: () => void;
  onRegister: (type: UserType) => void;
}

export default function Landing({ onExplore, onRegister }: LandingProps) {
  return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background Neon Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-orange-600 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-30"></div>
      </div>

      <div className="max-w-4xl w-full z-10 flex flex-col items-center">
        {/* Header Compacto */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex bg-orange-600 p-3.5 rounded-3xl mb-4 shadow-[0_15px_35px_rgba(234,88,12,0.3)]">
            <Bike size={40} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
            Bike<span className="text-orange-600">GO!</span>
          </h1>
          <p className="mt-2 text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-[0.5em]">
            Marketplace de Logística Real-Time
          </p>
        </div>

        {/* 3 Botoes de Ação Direta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          
          {/* MOTOBOY PORTAL */}
          <button 
            onClick={() => onRegister('motoboy')}
            className="group relative bg-white/5 hover:bg-orange-600 border border-white/10 hover:border-orange-500 transition-all duration-300 p-6 rounded-[2rem] text-center flex flex-col items-center gap-3 shadow-xl backdrop-blur-md"
          >
            <div className="bg-orange-600 group-hover:bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-colors">
              <UserPlus className="text-white group-hover:text-orange-600" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-tight">Cadastrar<br/>Motoboy</h3>
            </div>
            <div className="flex items-center gap-1.5 text-orange-500 group-hover:text-white text-[9px] font-black uppercase tracking-widest">
              Começar Agora <ArrowRight size={10} />
            </div>
          </button>

          {/* RESTAURANT PORTAL */}
          <button 
            onClick={() => onRegister('restaurant')}
            className="group relative bg-white/5 hover:bg-white border border-white/10 hover:border-slate-200 transition-all duration-300 p-6 rounded-[2rem] text-center flex flex-col items-center gap-3 shadow-xl backdrop-blur-md"
          >
            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-slate-950 transition-colors">
              <Building2 className="text-slate-950 group-hover:text-white" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-slate-950 italic uppercase tracking-tighter leading-tight">Cadastrar<br/>Loja</h3>
            </div>
            <div className="flex items-center gap-1.5 text-white group-hover:text-slate-950 text-[9px] font-black uppercase tracking-widest">
              Registrar <ArrowRight size={10} />
            </div>
          </button>

          {/* EXPLORER PORTAL */}
          <button 
            onClick={onExplore}
            className="group relative bg-orange-600/10 hover:bg-orange-600 border border-orange-600/20 hover:border-orange-500 transition-all duration-300 p-6 rounded-[2rem] text-center flex flex-col items-center gap-3 shadow-xl backdrop-blur-md"
          >
            <div className="bg-orange-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
              <Compass className="text-white group-hover:text-orange-600 animate-spin-slow" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-tight">Explorar<br/>Mapa</h3>
            </div>
            <div className="flex items-center gap-1.5 text-orange-500 group-hover:text-white text-[9px] font-black uppercase tracking-widest">
              Ver Rede <ArrowRight size={10} />
            </div>
          </button>

        </div>

        {/* Info adicional */}
        <div className="mt-12 flex items-center gap-4 text-slate-600 text-[8px] font-black uppercase tracking-[0.3em]">
          <span className="flex items-center gap-1.5"><Zap size={10} className="text-orange-500" /> Ativação Imediata</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
          <span className="flex items-center gap-1.5"><Map size={10} className="text-orange-500" /> +50 Cidades</span>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
