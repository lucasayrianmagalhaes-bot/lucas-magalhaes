
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Bike, Store, X, Star, LogIn, Navigation2, LayoutDashboard,
  Moon, Sun, Package, MessageCircle, Send, Zap, Briefcase, Search, Filter, Bell, Quote, Compass, Radar, Loader2, Sparkles
} from 'lucide-react';
import { UserProfile, UserType, Status, Location, AppNotification, ChatMessage } from './types';
import { MOCK_USERS, DEFAULT_CENTER, STATUS_COLORS } from './constants';
import Onboarding from './components/Onboarding';
import Landing from './components/Landing';
import MotoboyDashboard from './components/MotoboyDashboard';
import { GoogleGenAI } from "@google/genai";

// --- Leaflet Assets Fix ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// --- Custom Marker Generator ---
const createCustomIcon = (type: UserType, status: Status) => {
  const color = status === 'available' ? '#22c55e' : status === 'busy' ? '#eab308' : '#9ca3af';
  const iconMarkup = type === 'motoboy' 
    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>'
    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/><path d="M4 12v0a2 2 0 0 1-2-2V7"/></svg>';
  
  const html = `
    <div style="background-color: white; border: 3px solid ${color}; border-radius: 14px; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0,0,0,0.3); transform: scale(1);">
      ${iconMarkup}
    </div>`;
  return L.divIcon({ html, className: 'custom-marker', iconSize: [46, 46], iconAnchor: [23, 46] });
};

const userLocationIcon = L.divIcon({
  html: '<div class="user-pulse"></div><div class="user-dot"></div>',
  className: 'user-location-marker', iconSize: [50, 50], iconAnchor: [25, 25]
});

// --- UI Components ---
const ChatInterface = ({ targetUser, currentUser, onClose }: { targetUser: UserProfile, currentUser: UserProfile, onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'system', text: `Canal seguro com ${targetUser.name}.`, timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), senderId: currentUser.id, text, timestamp: Date.now() }]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), senderId: targetUser.id, text: "Opa! Estou perto, qual o valor?", timestamp: Date.now() }]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-[2500] w-full sm:w-[420px] h-[100dvh] sm:h-[650px] bg-slate-900 shadow-2xl rounded-none sm:rounded-[2.5rem] border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-20 transition-all">
      <div className="bg-slate-950 p-6 flex items-center justify-between border-b border-white/5 pt-14 sm:pt-6">
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[targetUser.status]} shadow-[0_0_12px_currentColor]`}></div>
           <div>
             <span className="font-black text-white text-base block">{targetUser.name}</span>
             <span className="text-[10px] text-orange-500 uppercase font-black tracking-widest">Negociação Ativa</span>
           </div>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-900/50">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
              m.senderId === 'system' ? 'bg-slate-800/50 text-slate-500 italic text-center w-full rounded-xl' :
              m.senderId === currentUser.id ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-800 text-white rounded-tl-none border border-white/5 shadow-lg'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-950 flex gap-2 pb-12 sm:pb-6">
        <input 
          value={inputText} onChange={e => setInputText(e.target.value)}
          placeholder="Escreva sua proposta..." className="flex-1 bg-slate-800 text-white px-6 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium" 
        />
        <button onClick={() => sendMessage(inputText)} className="bg-orange-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"><Send size={24} /></button>
      </div>
    </div>
  );
};

const LocationController = ({ location, trigger }: { location: Location | null, trigger: number }) => {
  const map = useMap();
  useEffect(() => {
    if (location && trigger > 0) map.flyTo([location.lat, location.lng], 16, { animate: true, duration: 1.5 });
  }, [location, trigger, map]);
  return null;
};

export default function App() {
  const [view, setView] = useState<'landing' | 'map'>('landing');
  const [isLoadingExplorer, setIsLoadingExplorer] = useState(false);
  const [explorerInsight, setExplorerInsight] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingType, setOnboardingType] = useState<UserType | undefined>(undefined);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [activeChat, setActiveChat] = useState<UserProfile | null>(null);
  const [myLocation, setMyLocation] = useState<Location | null>(null);
  const [mapCenterTrigger, setMapCenterTrigger] = useState(0);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (p) => setMyLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
        null, 
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleAction = (type: 'chat' | 'single' | 'daily') => {
    if (!currentUser) { setShowOnboarding(true); return; }
    if (type === 'chat') { setActiveChat(activeProfile); setActiveProfile(null); return; }
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, title: "Solicitação Enviada", message: `Aguardando resposta de ${activeProfile?.name}.`, type: 'success', timestamp: Date.now() }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
    setActiveProfile(null);
  };

  const exploreAreaWithAI = async () => {
    setIsLoadingExplorer(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Analise a seguinte situação logística urbana de um marketplace de entregadores:
        - Usuários no mapa: ${MOCK_USERS.map(u => `${u.name} (${u.type}, Rank: ${u.rank || 'N/A'}, Status: ${u.status})`).join(', ')}
        - Localização do usuário: ${myLocation ? `Lat: ${myLocation.lat}, Lng: ${myLocation.lng}` : 'Desconhecida'}
        
        Aja como um analista logístico sênior. Em no máximo 3 frases curtas e impactantes, dê um insight estratégico sobre esta vizinhança para um restaurante que queira contratar alguém ou para um entregador buscando trabalho. Use tom profissional e motivador.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setExplorerInsight(response.text || "Área com alta rotatividade. Excelente momento para novos pedidos!");
    } catch (error) {
      setExplorerInsight("Detector de rede instável, mas detectamos alta demanda na região central!");
    } finally {
      setIsLoadingExplorer(false);
    }
  };

  if (view === 'landing') return <Landing onExplore={() => setView('map')} onRegister={(t) => { setOnboardingType(t); setShowOnboarding(true); }} />;

  return (
    <div className={`h-[100dvh] w-screen flex flex-col overflow-hidden relative ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Header - Optimized for Mobile Thumb Reach */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 flex flex-col gap-3 pointer-events-none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-3xl p-3 rounded-2xl pointer-events-auto border border-white/10 shadow-xl cursor-pointer active:scale-95 transition-all" onClick={() => setView('landing')}>
            <Bike size={24} className="text-orange-600" />
            <span className="font-black italic tracking-tighter text-xl hidden xs:inline">Bike<span className="text-orange-600">GO!</span></span>
          </div>
          
          <div className="flex items-center gap-2 pointer-events-auto">
             <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-slate-900/90 backdrop-blur-3xl rounded-2xl text-white border border-white/10 shadow-xl active:scale-90 transition-all">
               {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
             </button>
             {currentUser ? (
                <button onClick={() => setShowDashboard(true)} className="p-3 bg-orange-600 rounded-2xl text-white shadow-xl border border-orange-500/50 active:scale-90 transition-all">
                   <LayoutDashboard size={20} />
                </button>
             ) : (
                <button onClick={() => setShowOnboarding(true)} className="bg-white text-slate-950 px-5 py-3 rounded-2xl font-black shadow-xl text-xs uppercase tracking-widest active:scale-95 transition-all">Entrar</button>
             )}
          </div>
        </div>

        <div className="max-w-xl w-full mx-auto pointer-events-auto mt-1">
           <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <Search size={20} />
              </div>
              <input 
                placeholder="Busque por entregadores ou lojas..." 
                className="w-full bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-full py-4 pl-12 pr-14 text-white text-sm focus:ring-2 focus:ring-orange-600/50 outline-none shadow-2xl transition-all"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button className="p-2 bg-white/5 text-slate-400 rounded-full hover:text-white active:scale-90 transition-all"><Filter size={18} /></button>
              </div>
           </div>
        </div>
      </div>

      {/* Main Map Layer */}
      <div className="flex-1 relative z-0">
        <MapContainer center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]} zoom={15} zoomControl={false} className="w-full h-full">
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            className={darkMode ? 'map-tiles-dark' : ''}
            attribution='&copy; BikeGO'
          />
          <LocationController location={myLocation} trigger={mapCenterTrigger} />
          {myLocation && <Marker position={[myLocation.lat, myLocation.lng]} icon={userLocationIcon} />}
          {MOCK_USERS.map(u => (
            <Marker key={u.id} position={[u.location.lat, u.location.lng]} icon={createCustomIcon(u.type, u.status)} eventHandlers={{ click: () => setActiveProfile(u) }} />
          ))}
        </MapContainer>

        {/* Floating Controls - EXPLORER RADAR BUTTON ADDED HERE */}
        <div className={`absolute right-4 z-[1000] flex flex-col gap-4 transition-all duration-500 ease-out ${activeProfile ? 'bottom-[440px] sm:bottom-10' : 'bottom-10'}`}>
           
           {/* Radar Explorer AI Button */}
           <button 
             onClick={exploreAreaWithAI}
             className="relative group p-4 sm:p-5 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-110 active:scale-90 transition-all border-2 border-white/20 overflow-hidden"
           >
             <div className="absolute inset-0 bg-white/20 animate-pulse group-hover:hidden"></div>
             {isLoadingExplorer ? (
               <Loader2 size={26} className="animate-spin" />
             ) : (
               <Radar size={26} className="animate-pulse" />
             )}
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-[10px] px-2 py-1 rounded font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Radar AI</span>
           </button>

           <button onClick={() => setMapCenterTrigger(prev => prev + 1)} className="p-4 sm:p-5 bg-slate-900/90 backdrop-blur-3xl text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all border border-white/10">
             <Navigation2 size={26} />
           </button>
        </div>

        {/* Explorer Insight Modal */}
        {explorerInsight && (
          <div className="absolute inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
             <div className="bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl relative">
                <div className="bg-orange-600/20 w-16 h-16 rounded-3xl flex items-center justify-center text-orange-500 mb-6 mx-auto">
                   <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-black text-center text-white mb-4 uppercase tracking-tighter italic">Insight do Radar</h3>
                <p className="text-slate-300 text-center text-sm leading-relaxed font-medium mb-8">
                  "{explorerInsight}"
                </p>
                <button 
                  onClick={() => setExplorerInsight(null)}
                  className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors"
                >
                  Entendido
                </button>
             </div>
          </div>
        )}

        {/* Mobile-First Bottom Sheet Profile Card */}
        {activeProfile && (
          <div className="absolute bottom-0 left-0 right-0 sm:bottom-8 sm:right-8 sm:left-auto sm:w-[450px] z-[1500] animate-in slide-in-from-bottom-full duration-500 transition-all">
            <div className="bg-slate-950/98 backdrop-blur-3xl rounded-t-[3.5rem] sm:rounded-[3rem] overflow-hidden border-t sm:border border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,0.9)] pb-10 sm:pb-0">
              
              <div className="w-14 h-1.5 bg-slate-800 rounded-full mx-auto mt-4 sm:hidden mb-4 opacity-50"></div>
              
              <div className="h-2.5 bg-gradient-to-r from-orange-600 via-red-600 to-orange-400 hidden sm:block"></div>
              
              <div className="p-7 sm:p-9">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="flex items-center gap-5">
                    <div className="relative shrink-0 scale-110 sm:scale-100">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-4 ${activeProfile.status === 'available' ? 'border-green-500/50' : 'border-yellow-500/50'} shadow-2xl`}>
                        {activeProfile.avatar ? (
                          <img src={activeProfile.avatar} alt={activeProfile.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                            {activeProfile.type === 'motoboy' ? <Bike size={32} /> : <Store size={32} />}
                          </div>
                        )}
                      </div>
                      <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg border-2 border-slate-950 ${STATUS_COLORS[activeProfile.status]} shadow-lg`}></div>
                    </div>

                    <div className="pl-1">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase italic leading-none">{activeProfile.name}</h3>
                      <div className="flex items-center gap-3 mt-3">
                         <span className="flex items-center gap-1 bg-orange-600/20 text-orange-500 px-3 py-1 rounded-full text-[11px] font-black border border-orange-500/30">
                            <Star size={12} fill="currentColor" /> {activeProfile.rating}
                         </span>
                         <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{activeProfile.type === 'motoboy' ? activeProfile.vehicleType : activeProfile.cuisine}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveProfile(null)} className="p-3 bg-white/5 hover:bg-white/10 active:scale-90 rounded-2xl text-slate-400 transition-all"><X size={26} /></button>
                </div>

                {activeProfile.bio && (
                  <div className="mb-8 p-5 bg-white/[0.03] rounded-[2rem] border border-white/5 relative group max-h-36 overflow-y-auto custom-scrollbar shadow-inner">
                    <Quote className="absolute -top-3 -left-1 text-orange-600 opacity-40" size={20} fill="currentColor" />
                    <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pl-3 font-medium">
                      "{activeProfile.bio}"
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:gap-4">
                  <button onClick={() => handleAction('chat')} className="flex items-center justify-center gap-3 bg-white text-slate-950 py-5 rounded-3xl font-black transition-all active:scale-[0.98] shadow-2xl text-base sm:text-lg uppercase tracking-tight">
                    <MessageCircle size={22} /> Negociar agora
                  </button>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button onClick={() => handleAction('single')} className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-orange-600 text-white py-4 sm:py-5 rounded-3xl font-black transition-all active:scale-[0.98] border-b-4 border-orange-800 shadow-xl">
                      <Zap size={22} /> <span className="text-[10px] sm:text-xs uppercase tracking-widest">Serviço</span>
                    </button>
                    <button onClick={() => handleAction('daily')} className="flex flex-col items-center justify-center gap-1 sm:gap-2 bg-slate-800 text-white py-4 sm:py-5 rounded-3xl font-black transition-all active:scale-[0.98] border border-white/5 shadow-xl">
                      <Briefcase size={22} /> <span className="text-[10px] sm:text-xs uppercase tracking-widest">Diária</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeChat && currentUser && <ChatInterface targetUser={activeChat} currentUser={currentUser} onClose={() => setActiveChat(null)} />}

      {/* Stacked Notifications - Clean Mobile Look */}
      <div className="fixed top-28 left-4 right-4 sm:left-auto sm:right-6 z-[3000] flex flex-col gap-3 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto w-full sm:w-80 p-5 rounded-2xl bg-slate-900/95 backdrop-blur-3xl border border-orange-600/30 shadow-2xl animate-in slide-in-from-top-10 flex gap-4 items-center">
             <div className="bg-orange-600/20 p-2.5 rounded-xl text-orange-500 shrink-0"><Bell size={20} /></div>
             <div>
               <h4 className="font-black text-sm text-white leading-tight">{n.title}</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 line-clamp-1">{n.message}</p>
             </div>
          </div>
        ))}
      </div>

      {showOnboarding && <Onboarding onClose={() => setShowOnboarding(false)} onComplete={(u) => { setCurrentUser(u); setView('map'); setShowOnboarding(false); }} initialType={onboardingType} />}
      {currentUser && showDashboard && <MotoboyDashboard user={currentUser} onClose={() => setShowDashboard(false)} />}
      
      <style>{`
        .xs\:inline { display: none; }
        @media (min-width: 450px) { .xs\:inline { display: inline; } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
