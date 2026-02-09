
import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameView from './components/GameView';
import { GameStatus } from './types';
import { audioManager } from './utils/audio';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [highScore, setHighScore] = useState<number>(0);
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    audioManager.init();
    const savedScore = localStorage.getItem('num_high_score');
    if (savedScore) setHighScore(parseInt(savedScore, 10));
  }, []);

  const handleStart = () => {
    audioManager.playEffect('CLICK');
    setStatus(GameStatus.PLAYING);
  };

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('num_high_score', score.toString());
    }
  };

  return (
    <div className="w-full h-full bg-[#0a0a14] text-white">
      {status === GameStatus.MENU ? (
        <MainMenu 
          onStart={handleStart} 
          highScore={highScore} 
          lang={lang}
          onSetLang={setLang}
        />
      ) : (
        <GameView 
          onBackToMenu={() => setStatus(GameStatus.MENU)} 
          highScore={highScore} 
          onUpdateHighScore={updateHighScore}
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;
