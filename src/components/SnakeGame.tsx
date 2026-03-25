import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 90;

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    setFood(generateFood(initialSnake));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ') {
      setIsPaused(p => !p);
      return;
    }

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    gameLoopRef.current = window.setInterval(moveSnake, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [food, gameOver, isPaused, score, generateFood, onScoreChange]);

  return (
    <div className="relative w-full aspect-square max-w-[500px] bg-black border-4 border-cyan-500 overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      />

      {/* Food */}
      <div 
        className="absolute bg-fuchsia-500 shadow-[0_0_15px_rgba(255,0,255,1)] animate-pulse"
        style={{
          width: `${100 / GRID_SIZE}%`,
          height: `${100 / GRID_SIZE}%`,
          left: `${(food.x / GRID_SIZE) * 100}%`,
          top: `${(food.y / GRID_SIZE) * 100}%`,
        }}
      />

      {/* Snake */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const opacity = isHead ? 1 : Math.max(0.2, 1 - (index / snake.length));
        return (
          <div
            key={`${segment.x}-${segment.y}-${index}`}
            className={`absolute transition-all duration-75 ${
              isHead 
                ? 'bg-cyan-300 shadow-[0_0_20px_rgba(0,255,255,1)] z-10' 
                : 'bg-cyan-500'
            }`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              transform: isHead ? 'scale(1)' : `scale(${0.9 - (index / snake.length) * 0.3})`,
              opacity: opacity,
              boxShadow: isHead ? undefined : `0 0 ${15 * opacity}px rgba(0,255,255,${opacity})`
            }}
          />
        );
      })}

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm border-4 border-fuchsia-500 m-2">
          <h3 
            className="text-5xl font-bold text-fuchsia-500 mb-2 glitch-text"
            data-text="FATAL EXCEPTION"
          >
            FATAL EXCEPTION
          </h3>
          <p className="text-cyan-400 mb-8 text-2xl">DATA CORRUPTED AT: {score}</p>
          <button 
            onClick={resetGame}
            className="px-8 py-3 bg-fuchsia-600 text-black text-2xl font-bold hover:bg-cyan-400 hover:text-black transition-colors shadow-[4px_4px_0px_#00ffff] hover:shadow-[4px_4px_0px_#ff00ff] active:translate-y-1 active:translate-x-1 active:shadow-none"
          >
            INITIATE REBOOT
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <h3 className="text-4xl font-bold text-cyan-400 tracking-widest animate-pulse border-y-4 border-cyan-400 py-2 w-full text-center bg-black/50">
            SYSTEM.PAUSED
          </h3>
        </div>
      )}
    </div>
  );
}
