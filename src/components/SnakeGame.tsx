import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point } from '../types';
import { GRID_SIZE, CELL_SIZE, CANVAS_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  // Game Loop Logic
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };
        const currentDir = nextDirection;
        setDirection(currentDir); // Lock in the direction for this tick

        switch (currentDir) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions (walls)
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          setHighScore(prev => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [isPaused, isGameOver, nextDirection, food, score, generateFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (isGameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      setNextDirection(prev => {
        switch (e.key) {
          case 'ArrowUp': return direction !== 'DOWN' ? 'UP' : prev;
          case 'ArrowDown': return direction !== 'UP' ? 'DOWN' : prev;
          case 'ArrowLeft': return direction !== 'RIGHT' ? 'LEFT' : prev;
          case 'ArrowRight': return direction !== 'LEFT' ? 'RIGHT' : prev;
          default: return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Grid (Subtle)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw Food (Magenta)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(
      food.x * CELL_SIZE + 2,
      food.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    );

    // Draw Snake (Cyan)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      
      // Slightly smaller segments for a "jointed" look
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Score Header */}
      <div className="flex justify-between w-full max-w-[400px] bg-black border-2 border-[#00ffff] p-3 shadow-[4px_4px_0px_#ff00ff]">
        <div className="flex flex-col">
          <span className="text-[#00ffff] text-sm tracking-widest">ENTITY_SCORE</span>
          <span className="text-3xl font-bold text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#ff00ff] text-sm tracking-widest">MAX_YIELD</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#ff00ff]" />
            <span className="text-3xl font-bold text-white">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="relative bg-black border-4 border-[#00ffff] shadow-[8px_8px_0px_#ff00ff]">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block"
          />

          {/* Overlays */}
          {(isGameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 p-4 border-4 border-[#ff00ff] m-2 animate-tear">
              {isGameOver ? (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[#ff00ff] text-4xl font-bold mb-2 tracking-widest glitch-text" data-text="SYSTEM_FAILURE">
                    SYSTEM_FAILURE
                  </h2>
                  <p className="text-[#00ffff] mb-8 text-xl">FINAL_YIELD: {score}</p>
                  <button
                    onClick={resetGame}
                    className="group relative px-6 py-2 bg-black border-2 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors flex items-center gap-2 text-[#ff00ff] font-bold tracking-widest text-xl"
                  >
                    <RotateCcw className="w-5 h-5" />
                    REBOOT_SEQ
                  </button>
                </div>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <h2 className="text-[#00ffff] text-4xl font-bold mb-8 tracking-widest glitch-text" data-text="AWAITING_INPUT">
                    AWAITING_INPUT
                  </h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="group relative px-6 py-2 bg-black border-2 border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors flex items-center gap-2 text-[#00ffff] font-bold tracking-widest text-xl"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    INITIALIZE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-[#00ffff] text-sm tracking-widest bg-black border-2 border-[#ff00ff] p-2 w-full justify-center">
        <span className="flex items-center gap-2">
          <span className="bg-[#ff00ff] text-black px-1">↑↓←→</span> NAVIGATE
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-[#00ffff] text-black px-1">SPACE</span> HALT/RESUME
        </span>
      </div>
    </div>
  );
};

export default SnakeGame;


