
import React, { useState } from 'react';
import { Play, Trophy, Globe, ArrowLeft, Grid3X3, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSLATIONS } from '../constants';
import { audioManager } from '../utils/audio';

interface MainMenuProps {
  onStart: () => void;
  highScore: number;
  lang: 'tr' | 'en';
  onSetLang: (l: 'tr' | 'en') => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  onStart, 
  highScore, 
  lang, 
  onSetLang 
}) => {
  const [view, setView] = useState<'main' | 'language'>('main');
  const t = (TRANSLATIONS as any)[lang];

  const menuTransition = { type: 'spring', damping: 20, stiffness: 300 };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a14] relative overflow-hidden">
      {/* Arka Plan Efektleri */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-600/20 blur-[120px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {view === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={menuTransition}
            className="flex flex-col items-center w-full z-10"
          >
            <div className="text-center mb-10 relative">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-6"
              >
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-fuchsia-500 blur-2xl opacity-40 animate-pulse" />
                  <div className="relative z-10 w-full h-full bg-gradient-to-br from-cyan-400 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] border border-white/20">
                    <Grid3X3 size={48} className="text-white drop-shadow-md" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 bg-emerald-400 rounded-full p-1.5 border-2 border-slate-900"
                    >
                      <Layers size={16} className="text-white" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <h1 className="flex flex-col items-center italic">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg">
                  {t.title.split(' ')[0]}
                </span>
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)] tracking-widest uppercase">
                  {t.title.split(' ')[1]}
                </span>
              </h1>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 w-full max-w-xs flex flex-col items-center backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="text-amber-400 w-5 h-5" />
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{t.highScore}</span>
              </div>
              <div className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{highScore}</div>
            </div>

            <button
              onClick={onStart}
              className="group relative flex items-center justify-center gap-3 bg-white text-black font-black text-2xl py-6 px-16 rounded-full transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] active:scale-95"
            >
              <Play className="fill-current" />
              {t.start}
            </button>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => { setView('language'); audioManager.playEffect('CLICK'); }}
                className="flex items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-slate-300 border border-white/10"
              >
                <Globe size={24} />
                <span className="font-bold text-xs uppercase tracking-widest">{t.language}</span>
              </button>
            </div>
            
            <p className="mt-12 text-slate-500 text-[11px] text-center font-bold max-w-[240px] leading-relaxed uppercase tracking-widest">
              {t.instruction}
            </p>
          </motion.div>
        )}

        {view === 'language' && (
          <motion.div 
            key="language"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={menuTransition}
            className="flex flex-col items-center w-full max-w-xs z-10"
          >
            <h2 className="text-3xl font-black text-white mb-10 uppercase italic tracking-tighter">{t.language}</h2>
            
            <button
              onClick={() => { onSetLang('tr'); setView('main'); }}
              className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all mb-4 ${lang === 'tr' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
            >
              <span className="font-black text-lg">Türkçe</span>
              {lang === 'tr' && <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />}
            </button>

            <button
              onClick={() => { onSetLang('en'); setView('main'); }}
              className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all mb-4 ${lang === 'en' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
            >
              <span className="font-black text-lg">English</span>
              {lang === 'en' && <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />}
            </button>

            <button 
              onClick={() => { setView('main'); audioManager.playEffect('CLICK'); }}
              className="mt-10 flex items-center gap-2 text-slate-400 font-bold hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              {t.back}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainMenu;
