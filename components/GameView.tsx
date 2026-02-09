
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Trophy, Target } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { TileData, GridState } from '../types';
import { GRID_SIZE, SPAWN_SIZE, NUMBER_COLORS, TEXT_COLORS, TRANSLATIONS } from '../constants';
import { audioManager } from '../utils/audio';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface GameViewProps {
  onBackToMenu: () => void;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
  lang: 'tr' | 'en';
}

const GameView: React.FC<GameViewProps> = ({ onBackToMenu, highScore, onUpdateHighScore, lang }) => {
  const [grid, setGrid] = useState<GridState>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [spawn, setSpawn] = useState<(TileData | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const t = TRANSLATIONS[lang];
  
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialSpawn = Array(SPAWN_SIZE).fill(null).map(() => ({
      id: uuidv4(),
      value: Math.floor(Math.random() * 10)
    }));
    setSpawn(initialSpawn);
    setTimeout(() => audioManager.playEffect('SPAWN'), 300);
  }, []);

  const createNeonExplosion = (r: number, c: number, color: string) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const cellWidth = rect.width / GRID_SIZE;
    const cellHeight = rect.height / GRID_SIZE;
    
    const centerX = (c + 0.5) * cellWidth;
    const centerY = (r + 0.5) * cellHeight;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random();
      const speed = 2 + Math.random() * 5;
      newParticles.push({
        id: uuidv4(),
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        size: 4 + Math.random() * 8,
        life: 0.5 + Math.random() * 0.5
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const checkMatches = useCallback(async (currentGrid: GridState) => {
    let hasMatches = false;
    let newGrid = currentGrid.map(row => [...row]);
    const visited = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
    let totalMatchScore = 0;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const tile = newGrid[r][c];
        if (tile && !visited[r][c]) {
          const matchGroup: { r: number, c: number }[] = [];
          const queue: { r: number, c: number }[] = [{ r, c }];
          visited[r][c] = true;

          while (queue.length > 0) {
            const current = queue.shift()!;
            matchGroup.push(current);

            const neighbors = [
              { r: current.r - 1, c: current.c }, { r: current.r + 1, c: current.c },
              { r: current.r, c: current.c - 1 }, { r: current.r, c: current.c + 1 },
              { r: current.r - 1, c: current.c - 1 }, { r: current.r - 1, c: current.c + 1 },
              { r: current.r + 1, c: current.c - 1 }, { r: current.r + 1, c: current.c + 1 },
            ];

            for (const neighbor of neighbors) {
              if (
                neighbor.r >= 0 && neighbor.r < GRID_SIZE &&
                neighbor.c >= 0 && neighbor.c < GRID_SIZE &&
                !visited[neighbor.r][neighbor.c] &&
                newGrid[neighbor.r][neighbor.c]?.value === tile.value
              ) {
                visited[neighbor.r][neighbor.c] = true;
                queue.push(neighbor);
              }
            }
          }

          if (matchGroup.length >= 3) {
            hasMatches = true;
            const colorClass = NUMBER_COLORS[tile.value];
            const pColor = colorClass.includes('emerald') ? '#10b981' : 
                          colorClass.includes('blue') ? '#3b82f6' : 
                          colorClass.includes('indigo') ? '#6366f1' :
                          colorClass.includes('violet') ? '#8b5cf6' :
                          colorClass.includes('purple') ? '#a855f7' :
                          colorClass.includes('fuchsia') ? '#d946ef' :
                          colorClass.includes('pink') ? '#ec4899' :
                          colorClass.includes('rose') ? '#f43f5e' :
                          colorClass.includes('amber') ? '#fbbf24' : '#94a3b8';

            matchGroup.forEach(pos => {
              createNeonExplosion(pos.r, pos.c, pColor);
              newGrid[pos.r][pos.c] = null;
            });
            totalMatchScore += matchGroup.length * tile.value;
          }
        }
      }
    }

    if (hasMatches) {
      setIsAnimating(true);
      setScore(prev => {
        const newScore = prev + totalMatchScore;
        onUpdateHighScore(newScore);
        return newScore;
      });
      
      audioManager.playEffect('MATCH');
      await new Promise(resolve => setTimeout(resolve, 400));
      setGrid(newGrid);
      setIsAnimating(false);
      checkMatches(newGrid);
      return true;
    }
    return false;
  }, [onUpdateHighScore]);

  const handleDragStart = () => {
    audioManager.playEffect('DRAG');
  };

  const handleDragEnd = (event: any, info: any, spawnIndex: number) => {
    if (isAnimating || !gridRef.current) return;
    const tile = spawn[spawnIndex];
    if (!tile) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    if (
      dropX >= gridRect.left - 20 && dropX <= gridRect.right + 20 &&
      dropY >= gridRect.top - 20 && dropY <= gridRect.bottom + 20
    ) {
      const col = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((dropX - gridRect.left) / (gridRect.width / GRID_SIZE))));
      const row = Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((dropY - gridRect.top) / (gridRect.height / GRID_SIZE))));

      if (!grid[row][col]) {
        audioManager.playEffect('PLACE');
        const nextGrid = grid.map(r => [...r]);
        nextGrid[row][col] = { ...tile };
        setGrid(nextGrid);

        const nextSpawn = [...spawn];
        nextSpawn[spawnIndex] = null;
        setSpawn(nextSpawn);

        setTimeout(() => {
          setSpawn(currentSpawn => {
            const updatedSpawn = [...currentSpawn];
            updatedSpawn[spawnIndex] = {
              id: uuidv4(),
              value: Math.floor(Math.random() * 10)
            };
            audioManager.playEffect('SPAWN');
            return updatedSpawn;
          });
        }, 600);
        checkMatches(nextGrid);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden bg-[#0a0a14]">
      {/* Neon decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="h-[10%] min-h-[80px] flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-md z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Target size={14} className="font-bold" />
            <span className="text-[10px] uppercase font-black tracking-widest">{t.score}</span>
          </div>
          <span className="text-2xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{score}</span>
        </div>

        <button 
          onClick={onBackToMenu}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-white border border-white/10 active:scale-90"
        >
          <Home size={24} />
        </button>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Trophy size={14} />
            <span className="text-[10px] uppercase font-black tracking-widest">{t.best}</span>
          </div>
          <span className="text-2xl font-black text-white leading-none drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{highScore}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="h-[60%] flex items-center justify-center p-4 relative">
        <div 
          ref={gridRef}
          className="relative aspect-square w-full max-w-[340px] bg-slate-900/40 rounded-3xl p-3 border-4 border-cyan-500/20 grid grid-cols-4 grid-rows-4 gap-3 shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        >
          {Array(16).fill(null).map((_, idx) => (
            <div key={`bg-${idx}`} className="w-full h-full bg-black/60 rounded-xl border-2 border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" />
          ))}

          {/* Particles Layer */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
                animate={{ 
                  x: p.x + p.vx * 15, 
                  y: p.y + p.vy * 15, 
                  scale: 0, 
                  opacity: 0,
                  rotate: 180
                }}
                transition={{ duration: p.life, ease: "easeOut" }}
                className="absolute rounded-sm"
                style={{ 
                  backgroundColor: p.color, 
                  width: p.size, 
                  height: p.size,
                  filter: `blur(1px)`,
                  boxShadow: `0 0 ${p.size}px ${p.color}`
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 p-3 grid grid-cols-4 grid-rows-4 gap-3 pointer-events-none">
            <AnimatePresence>
              {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => (
                  <div key={`cell-${rIdx}-${cIdx}`} className="relative w-full h-full">
                    {cell && (
                      <motion.div
                        layoutId={cell.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                        }}
                        transition={{ duration: 0.3 }}
                        exit={{ 
                          scale: [1, 1.3, 0],
                          opacity: [1, 1, 0],
                          filter: ["brightness(1)", "brightness(2)", "brightness(2)"]
                        }}
                        className={`w-full h-full ${NUMBER_COLORS[cell.value]} rounded-xl border-b-4 border-black/40 flex items-center justify-center relative overflow-hidden`}
                      >
                        {/* Subtle scanline/shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        <span className={`text-3xl font-black ${TEXT_COLORS[cell.value]} relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]`}>
                          {cell.value}
                        </span>
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Spawn Area */}
      <div className="h-[30%] flex flex-col items-center justify-start gap-4 pt-4">
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">{t.nextTiles}</p>
        <div className="flex gap-4 p-4 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
          {spawn.map((tile, idx) => (
            <div key={`spawn-slot-${idx}`} className="w-16 h-16 bg-slate-950/80 rounded-2xl relative border-2 border-dashed border-slate-800">
              <AnimatePresence mode="wait">
                {tile && (
                  <motion.div
                    key={tile.id}
                    drag
                    dragSnapToOrigin
                    onDragStart={handleDragStart}
                    onDragEnd={(e, info) => handleDragEnd(e, info, idx)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileDrag={{ 
                      scale: 1.2, 
                      zIndex: 50,
                      boxShadow: '0 0 30px rgba(255,255,255,0.4)'
                    }}
                    className={`absolute inset-0 cursor-grab active:cursor-grabbing ${NUMBER_COLORS[tile.value]} rounded-xl shadow-xl border-b-4 border-black/40 flex items-center justify-center z-10 touch-none`}
                  >
                    <span className={`text-2xl font-black ${TEXT_COLORS[tile.value]}`}>
                      {tile.value}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameView;
