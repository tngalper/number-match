
export const GRID_SIZE = 4;
export const SPAWN_SIZE = 3;

export const SOUNDS = {
  CLICK: 'https://cdn.pixabay.com/audio/2022/03/15/audio_73147a468e.mp3',
  PLACE: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c3506720f1.mp3',
  MATCH: 'https://cdn.pixabay.com/audio/2021/08/04/audio_145d554a32.mp3',
  SPAWN: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2d9a334f66.min.mp3',
  DRAG: 'https://cdn.pixabay.com/audio/2022/01/18/audio_823187600c.mp3',
};

export const NUMBER_COLORS: Record<number, string> = {
  0: 'bg-slate-700 shadow-cyan-500/20',
  1: 'bg-emerald-500 shadow-emerald-500/50',
  2: 'bg-blue-500 shadow-blue-500/50',
  3: 'bg-indigo-500 shadow-indigo-500/50',
  4: 'bg-violet-500 shadow-violet-500/50',
  5: 'bg-purple-500 shadow-purple-500/50',
  6: 'bg-fuchsia-500 shadow-fuchsia-500/50',
  7: 'bg-pink-500 shadow-pink-500/50',
  8: 'bg-rose-500 shadow-rose-500/50',
  9: 'bg-amber-400 shadow-amber-400/50',
};

// Add missing TEXT_COLORS mapping used in GameView.tsx
export const TEXT_COLORS: Record<number, string> = {
  0: 'text-white',
  1: 'text-white',
  2: 'text-white',
  3: 'text-white',
  4: 'text-white',
  5: 'text-white',
  6: 'text-white',
  7: 'text-white',
  8: 'text-white',
  9: 'text-white',
};

export const TRANSLATIONS = {
  tr: {
    title: 'SAYI EŞLEME',
    start: 'BAŞLA',
    score: 'SKOR',
    best: 'EN İYİ',
    next: 'SIRADAKİ',
    back: 'GERİ',
    highScore: 'EN YÜKSEK SKOR',
    language: 'DİL',
    instruction: 'AYNI SAYILARI YAN YANA GETİREREK PATLAT!',
    nextTiles: 'SIRADAKİ TAŞLAR'
  },
  en: {
    title: 'NUMBER MATCH',
    start: 'START',
    score: 'SCORE',
    best: 'BEST',
    next: 'NEXT',
    back: 'BACK',
    highScore: 'HIGH SCORE',
    language: 'LANGUAGE',
    instruction: 'MATCH THE NUMBERS TO BLAST THEM!',
    nextTiles: 'NEXT TILES'
  }
};
