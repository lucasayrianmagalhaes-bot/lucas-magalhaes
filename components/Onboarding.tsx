
import React, { useState } from 'react';
import { User, Store, ArrowRight, X, Map as MapIcon, Edit3 } from 'lucide-react';
import { UserProfile, UserType } from '../types';
import { DEFAULT_CENTER } from '../constants';

interface OnboardingProps {
  onClose: () => void;
  onComplete: (user: UserProfile) => void;
  onExplore?: () => void;
  initialType?: UserType;
}

export default function Onboarding({ onClose, onComplete, onExplore, initialType }: OnboardingProps) {
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [type, setType] = useState<UserType>(initialType || 'motoboy');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [pix, setPix] = useState('');
  const [bio, setBio] = useState('');

  const handleFinish = () => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      type,
      status: 'available',
      location: { 
        lat: DEFAULT_CENTER.lat,
        lng: DEFAULT_CENTER.lng 
      },
      city: 'São Paulo',
      rating: 5.0,
      rank: 'bronze',
      bio,
      vehicleType: vehicle || 'N/A',
      pixKey: pix,
      minRate: 10,
      maxRate: 30,
      completedDeliveries: 0,
      walletBalance: 0,
      history: type === 'motoboy' ? [] : undefined
    };
    onComplete(newUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        
        <div className="bg-slate-950 p-8 text-white text-center shrink-0 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
             <X size={24} />
          </button>
          <h2 className="text-3xl font-black italic tracking-tighter">
            Bike<span className="text-orange-500">GO!</span>
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-[0.2em]">
            {step === 1 ? 'Escolha sua jornada' : 'Seu perfil de impacto'}
          </p>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {step === 1 ? (
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Como você quer usar o BikeGO?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setType('motoboy')}
                    className={`p-6 rounded-[2rem] border-4 flex flex-col items-center gap-3 transition-all ${
                      type === 'motoboy' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <User size={40} strokeWidth={2.5} />
                    <span className="font-black uppercase text-xs tracking-tighter">Quero Entregar</span>
                  </button>
                  <button 
                    onClick={() => setType('restaurant')}
                    className={`p-6 rounded-[2rem] border-4 flex flex-col items-center gap-3 transition-all ${
                      type === 'restaurant' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <Store size={40} strokeWidth={2.5} />
                    <span className="font-black uppercase text-xs tracking-tighter">Sou Lojista</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu Nome</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: João das Entregas" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold transition-all" />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Seu E-mail</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-bold transition-all" />
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button onClick={() => setStep(2)} disabled={!name || !email} className="w-full bg-slate-950 disabled:opacity-50 text-white py-5 rounded-2xl font-black hover:bg-slate-800 flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-xl">
                  Próximo Passo <ArrowRight size={20} />
                </button>
                
                {/* EXPLORE BUTTON INSIDE ONBOARDING */}
                <button 
                  onClick={onExplore}
                  className="w-full flex items-center justify-center gap-2 py-4 text-slate-400 hover:text-orange-600 font-black uppercase text-[10px] tracking-widest transition-colors"
                >
                  <MapIcon size={16} /> Ver o mapa sem cadastro agora
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
               {type === 'motoboy' && (
                 <div className="space-y-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2 ml-1">
                        <Edit3 size={14} /> Bio do Entregador
                      </label>
                      <textarea 
                        value={bio} 
                        onChange={e => setBio(e.target.value)}
                        placeholder="Ex: 'Entregador pontual com moto própria e baú térmico...'"
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 outline-none font-medium text-sm h-32 resize-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Moto / Veículo</label>
                        <input type="text" value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="Ex: Honda Titan" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chave PIX</label>
                        <input type="text" value={pix} onChange={e => setPix(e.target.value)} placeholder="Para recebimentos" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold" />
                      </div>
                    </div>
                 </div>
               )}

               {type === 'restaurant' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Descrição do Negócio</label>
                      <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Descreva sua loja..." className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl h-24 resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Especialidade</label>
                      <input type="text" placeholder="Ex: Hamburgueria, Pizzaria" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl" />
                    </div>
                  </div>
               )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="px-8 py-5 text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors">Voltar</button>
                <button onClick={handleFinish} className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black hover:bg-orange-700 shadow-2xl shadow-orange-600/20 transition-all uppercase tracking-widest">
                  Criar Conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
