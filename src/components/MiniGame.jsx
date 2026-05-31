import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Gamepad2, Star, Sparkles, Smile, Frown, User, Compass, HelpCircle
} from 'lucide-react';

export default function MiniGame() {
  const [activeGame, setActiveGame] = useState('snake');

  const games = [
    { id: 'snake', name: '네온 뱀 게임 (Snake)', desc: '네온 불빛 꼬리를 키우며 사과를 수집하는 게임' },
    { id: 'tetris', name: '네온 테트리스 (Tetris)', desc: '떨어지는 블록을 맞춰 라인을 클리어하는 퍼즐' },
    { id: 'minesweeper', name: '지뢰찾기 (Minesweeper)', desc: '클래식 지뢰 탐지 퍼즐 (3단계 난이도)' },
    { id: 'pong', name: '네온 퐁 (Pong)', desc: '인공지능 패들을 상대로 대결하는 탁구 게임' },
    { id: 'shooter', name: '사이버 슈터 (Shooter)', desc: '외계 침략 함선들을 격추하는 우주 슈팅 아케이드' },
    { id: 'bricks', name: '벽돌 깨기 (Brick Breaker)', desc: '볼을 바운스시켜 컬러 네온 벽돌을 파괴하는 게임' },
    { id: 'game2048', name: '2048 네온 (2048)', desc: '타일을 슬라이드해 2048을 완성하는 수학 퍼즐' },
    { id: 'tictactoe', name: '스마트 틱택토 (Tic-Tac-Toe)', desc: '미니맥스 인공지능을 상대하는 3x3 격자 게임' },
    { id: 'memory', name: '메모리 카드 (Memory Match)', desc: '카드를 뒤집어 같은 개발 도구 아이콘 짝 맞추기' },
    { id: 'flappy', name: '플래피 드론 (Flappy Bird)', desc: '중력을 거슬러 장애물 사이를 날아다니는 터치 게임' }
  ];

  // Helper sound generator
  const playBeep = (freq = 800, duration = 0.1, type = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  return (
    <section id="minigame" className="game-section">
      <div className="section-title-wrapper fade-in-up">
        <h2 className="section-title">Retro Arcade Center</h2>
        <p className="showcase-subtitle">
          브라우저에서 직접 실행하여 조작 성능을 체감할 수 있는 10가지 네온 아케이드 게임 전시장입니다.
        </p>
        <div className="section-divider border-purple" />
      </div>

      <div className="game-grid glass-panel fade-in-up">
        {/* Game Switcher Sidebar */}
        <div className="utility-sidebar" style={{ borderRight: '1px solid var(--border-glass)' }}>
          {games.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setActiveGame(g.id);
                playBeep(523, 0.05, 'triangle');
              }}
              className={`utility-sidebar-btn ${activeGame === g.id ? 'utility-sidebar-btn-active' : ''}`}
            >
              <Gamepad2 size={18} className={activeGame === g.id ? 'text-neon-cyan' : ''} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{g.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>{g.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Game Area */}
        <div className="utility-main" style={{ minHeight: '520px', justifyContent: 'center', alignItems: 'center' }}>
          {activeGame === 'snake' && <SnakeGame playBeep={playBeep} />}
          {activeGame === 'tetris' && <TetrisGame playBeep={playBeep} />}
          {activeGame === 'minesweeper' && <MinesweeperGame playBeep={playBeep} />}
          {activeGame === 'pong' && <PongGame playBeep={playBeep} />}
          {activeGame === 'shooter' && <ShooterGame playBeep={playBeep} />}
          {activeGame === 'bricks' && <BricksGame playBeep={playBeep} />}
          {activeGame === 'game2048' && <Game2048 playBeep={playBeep} />}
          {activeGame === 'tictactoe' && <TicTacToeGame playBeep={playBeep} />}
          {activeGame === 'memory' && <MemoryGame playBeep={playBeep} />}
          {activeGame === 'flappy' && <FlappyGame playBeep={playBeep} />}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   1. Snake Game Component
   ========================================================================== */
function SnakeGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const GRID_SIZE = 20;
  const snakeRef = useRef([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const foodRef = useRef({ x: 5, y: 5 });
  const dirRef = useRef({ x: 0, y: -1 });
  const nextDirRef = useRef({ x: 0, y: -1 });

  useEffect(() => {
    const saved = localStorage.getItem('arcade_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
    generateFood();
    draw();
  }, []);

  const generateFood = () => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y);
    }
    foodRef.current = newFood;
  };

  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;
    const interval = setInterval(() => {
      move();
    }, Math.max(60, 130 - Math.floor(score / 4) * 8));
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameOver, score]);

  useEffect(() => {
    const handleKeys = (e) => {
      if (!isPlaying) return;
      const d = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w') && d.y !== 1) nextDirRef.current = { x: 0, y: -1 };
      if ((e.key === 'ArrowDown' || e.key === 's') && d.y !== -1) nextDirRef.current = { x: 0, y: 1 };
      if ((e.key === 'ArrowLeft' || e.key === 'a') && d.x !== 1) nextDirRef.current = { x: -1, y: 0 };
      if ((e.key === 'ArrowRight' || e.key === 'd') && d.x !== -1) nextDirRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isPlaying]);

  const move = () => {
    const dir = nextDirRef.current;
    dirRef.current = dir;
    const snake = [...snakeRef.current];
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || snake.some(s => s.x === head.x && s.y === head.y)) {
      setGameOver(true);
      setIsPlaying(false);
      playBeep(220, 0.4, 'sawtooth');
      return;
    }

    snake.unshift(head);
    const food = foodRef.current;
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => {
        const next = prev + 1;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('arcade_snake_highscore', next.toString());
        }
        return next;
      });
      playBeep(880, 0.08, 'sine');
      generateFood();
    } else {
      snake.pop();
    }
    snakeRef.current = snake;
    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cs = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff3366';
    ctx.fillStyle = '#ff3366';
    ctx.beginPath();
    ctx.arc(foodRef.current.x * cs + cs/2, foodRef.current.y * cs + cs/2, cs/2.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    snakeRef.current.forEach((seg, idx) => {
      ctx.shadowBlur = idx === 0 ? 12 : 6;
      ctx.shadowColor = idx === 0 ? '#00f2fe' : '#9b51e0';
      ctx.fillStyle = idx === 0 ? '#00f2fe' : '#9b51e0';
      ctx.beginPath();
      ctx.roundRect(seg.x * cs + 1.5, seg.y * cs + 1.5, cs - 3, cs - 3, idx === 0 ? 6 : 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  };

  const start = () => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    generateFood();
    draw();
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '400px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Star size={16} className="text-neon-cyan" /> <span>Score: {score}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Trophy size={16} className="text-gold" /> <span>High: {highScore}</span>
        </div>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} width={400} height={400} className="canvas-element" />
        {(!isPlaying || isPaused || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red">GAME OVER (최종: {score})</h3>}
            <button onClick={start} className="glow-btn overlay-btn">
              {gameOver ? '다시 도전' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   2. Neon Tetris Game Component
   ========================================================================== */
function TetrisGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const COLS = 10;
  const ROWS = 20;
  const BLOCK_SIZE = 20;

  // Board matrix
  const boardRef = useRef(Array(ROWS).fill().map(() => Array(COLS).fill(0)));
  const currentPieceRef = useRef(null);
  const loopIntervalRef = useRef(null);

  const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
  ];

  const COLORS = ['#0f111a', '#00f2fe', '#9b51e0', '#ef4444', '#10b981', '#fbbf24', '#ff7849', '#ff3366'];

  useEffect(() => {
    const saved = localStorage.getItem('arcade_tetris_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
    draw();
  }, []);

  const spawnPiece = () => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    currentPieceRef.current = {
      shape,
      colorIdx: idx + 1,
      x: Math.floor((COLS - shape[0].length) / 2),
      y: 0
    };

    if (checkCollision(currentPieceRef.current.shape, currentPieceRef.current.x, currentPieceRef.current.y)) {
      setGameOver(true);
      setIsPlaying(false);
      playBeep(180, 0.5, 'triangle');
    }
  };

  const checkCollision = (shape, offsetW, offsetH) => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const boardW = offsetW + c;
          const boardH = offsetH + r;
          if (boardW < 0 || boardW >= COLS || boardH >= ROWS) return true;
          if (boardH >= 0 && boardRef.current[boardH][boardW]) return true;
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const p = currentPieceRef.current;
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c] && p.y + r >= 0) {
          boardRef.current[p.y + r][p.x + c] = p.colorIdx;
        }
      }
    }
  };

  const clearLines = () => {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (boardRef.current[r].every(val => val > 0)) {
        boardRef.current.splice(r, 1);
        boardRef.current.unshift(Array(COLS).fill(0));
        cleared++;
        r++; // check same row index again
      }
    }
    if (cleared > 0) {
      setScore(prev => {
        const next = prev + cleared * 10;
        if (next > highScore) {
          setHighScore(next);
          localStorage.setItem('arcade_tetris_highscore', next.toString());
        }
        return next;
      });
      playBeep(880, 0.15, 'sine');
    }
  };

  const drop = () => {
    const p = currentPieceRef.current;
    if (!p) return;
    if (!checkCollision(p.shape, p.x, p.y + 1)) {
      p.y++;
    } else {
      mergePiece();
      clearLines();
      spawnPiece();
    }
    draw();
  };

  const moveLeftRight = (dir) => {
    const p = currentPieceRef.current;
    if (!p) return;
    if (!checkCollision(p.shape, p.x + dir, p.y)) {
      p.x += dir;
      draw();
    }
  };

  const rotate = () => {
    const p = currentPieceRef.current;
    if (!p) return;
    const rotated = p.shape[0].map((_, i) => p.shape.map(row => row[i]).reverse());
    if (!checkCollision(rotated, p.x, p.y)) {
      p.shape = rotated;
      draw();
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      clearInterval(loopIntervalRef.current);
      return;
    }
    loopIntervalRef.current = setInterval(drop, 600);
    return () => clearInterval(loopIntervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeys = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') moveLeftRight(-1);
      if (e.key === 'ArrowRight') moveLeftRight(1);
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') rotate();
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isPlaying]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const val = boardRef.current[r][c];
        if (val) {
          ctx.fillStyle = COLORS[val];
          ctx.shadowBlur = 6;
          ctx.shadowColor = COLORS[val];
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
        }
      }
    }

    // Draw current piece
    const p = currentPieceRef.current;
    if (p) {
      ctx.fillStyle = COLORS[p.colorIdx];
      ctx.shadowBlur = 10;
      ctx.shadowColor = COLORS[p.colorIdx];
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
          if (p.shape[r][c]) {
            ctx.fillRect((p.x + c) * BLOCK_SIZE + 1, (p.y + r) * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          }
        }
      }
    }
    ctx.shadowBlur = 0;
  };

  const start = () => {
    boardRef.current = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    spawnPiece();
    draw();
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '200px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Star size={14} className="text-neon-cyan" /> <span>Score: {score}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Trophy size={14} className="text-gold" /> <span>High: {highScore}</span>
        </div>
      </div>

      <div className="canvas-container" style={{ width: '200px', height: '400px' }}>
        <canvas ref={canvasRef} width={200} height={400} className="canvas-element" />
        {(!isPlaying || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red" style={{ fontSize: '0.8rem' }}>GAME OVER ({score})</h3>}
            <button onClick={start} className="glow-btn overlay-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
              {gameOver ? '다시 시작' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   3. Minesweeper Game Component
   ========================================================================== */
function MinesweeperGame({ playBeep }) {
  const [diff, setDiff] = useState('easy'); // easy | medium | hard
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [minesCount, setMinesCount] = useState(10);
  const [flagsCount, setFlagsCount] = useState(0);

  const config = {
    easy: { r: 8, c: 8, mines: 10 },
    medium: { r: 10, c: 10, mines: 18 },
    hard: { r: 12, c: 12, mines: 28 }
  };

  useEffect(() => {
    initBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diff]);

  const initBoard = () => {
    const { r, c, mines } = config[diff];
    setGameOver(false);
    setWin(false);
    setMinesCount(mines);
    setFlagsCount(0);

    // Initial empty matrix
    let matrix = [];
    for (let i = 0; i < r; i++) {
      let row = [];
      for (let j = 0; j < c; j++) {
        row.push({
          x: i,
          y: j,
          mine: false,
          revealed: false,
          flagged: false,
          count: 0
        });
      }
      matrix.push(row);
    }

    // Plant mines
    let planted = 0;
    while (planted < mines) {
      const rx = Math.floor(Math.random() * r);
      const ry = Math.floor(Math.random() * c);
      if (!matrix[rx][ry].mine) {
        matrix[rx][ry].mine = true;
        planted++;
      }
    }

    // Calculate surrounding counts
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (matrix[i][j].mine) continue;
        let surrounding = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (i + dx >= 0 && i + dx < r && j + dy >= 0 && j + dy < c) {
              if (matrix[i + dx][j + dy].mine) surrounding++;
            }
          }
        }
        matrix[i][j].count = surrounding;
      }
    }

    setBoard(matrix);
  };

  const revealCell = (x, y) => {
    if (gameOver || win || board[x][y].flagged || board[x][y].revealed) return;
    
    let copy = board.map(row => row.map(cell => ({ ...cell })));
    
    if (copy[x][y].mine) {
      // Hit mine! Reveal all mines and trigger lose
      for (let i = 0; i < copy.length; i++) {
        for (let j = 0; j < copy[0].length; j++) {
          if (copy[i][j].mine) copy[i][j].revealed = true;
        }
      }
      setBoard(copy);
      setGameOver(true);
      playBeep(150, 0.5, 'sawtooth');
      return;
    }

    // DFS recursive open
    const openDFS = (cx, cy) => {
      if (cx < 0 || cx >= copy.length || cy < 0 || cy >= copy[0].length || copy[cx][cy].revealed || copy[cx][cy].flagged) return;
      copy[cx][cy].revealed = true;
      if (copy[cx][cy].count === 0 && !copy[cx][cy].mine) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            openDFS(cx + dx, cy + dy);
          }
        }
      }
    };

    openDFS(x, y);
    playBeep(660, 0.04, 'sine');

    // Check Win condition
    let revealedNonMines = 0;
    const { r, c, mines } = config[diff];
    const totalCells = r * c;
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        if (copy[i][j].revealed && !copy[i][j].mine) revealedNonMines++;
      }
    }

    if (revealedNonMines === totalCells - mines) {
      setWin(true);
      playBeep(988, 0.3, 'sine');
    }

    setBoard(copy);
  };

  const flagCell = (e, x, y) => {
    e.preventDefault();
    if (gameOver || win || board[x][y].revealed) return;

    let copy = board.map(row => row.map(cell => ({ ...cell })));
    const currentlyFlagged = copy[x][y].flagged;
    copy[x][y].flagged = !currentlyFlagged;
    setFlagsCount(prev => prev + (currentlyFlagged ? -1 : 1));
    playBeep(440, 0.05, 'triangle');
    setBoard(copy);
  };

  return (
    <div className="minesweeper-wrapper">
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {['easy', 'medium', 'hard'].map(d => (
          <button 
            key={d} 
            onClick={() => setDiff(d)} 
            className={`u-btn btn-action-small ${diff === d ? 'u-btn-primary' : 'u-btn-secondary'}`}
          >
            {d === 'easy' ? '쉬움' : d === 'medium' ? '보통' : '어려움'}
          </button>
        ))}
      </div>

      <div className="flex-center-between" style={{ width: '100%', maxWidth: '300px', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
        <span>💣 지뢰: {minesCount}</span>
        <span style={{ fontSize: '1.2rem', cursor: 'pointer' }} onClick={initBoard}>
          {win ? <Smile className="text-neon-cyan" /> : gameOver ? <Frown style={{ color: '#ef4444' }} /> : '😊'}
        </span>
        <span>🚩 깃발: {flagsCount}</span>
      </div>

      {board.length > 0 && (
        <div className="minesweeper-board" style={{ gridTemplateColumns: `repeat(${config[diff].c}, 32px)` }}>
          {board.map((row, rIdx) => 
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => revealCell(rIdx, cIdx)}
                onContextMenu={(e) => flagCell(e, rIdx, cIdx)}
                className={`minesweeper-tile ${cell.revealed ? 'minesweeper-tile-revealed' : ''} ${cell.mine && cell.revealed ? 'minesweeper-tile-mine' : ''}`}
                style={{
                  color: cell.revealed && !cell.mine && cell.count > 0 ? 
                    ['#3b82f6', '#10b981', '#ef4444', '#9b51e0', '#fbbf24', '#06b6d4', '#ec4899', '#ffffff'][cell.count - 1] : 'inherit'
                }}
              >
                {cell.flagged && !cell.revealed && '🚩'}
                {cell.revealed && cell.mine && '💣'}
                {cell.revealed && !cell.mine && cell.count > 0 && cell.count}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. Pong Game Component
   ========================================================================== */
function PongGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const ball = useRef({ x: 200, y: 200, vx: 3, vy: 1.5, radius: 6 });
  const playerY = useRef(160);
  const aiY = useRef(160);

  const PADDLE_HEIGHT = 80;
  const PADDLE_WIDTH = 10;
  const PADDLE_SPEED = 6;
  const keyState = useRef({});

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { keyState.current[e.key] = true; };
    const handleKeyUp = (e) => { keyState.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const update = () => {
    // Player movement
    if (keyState.current['ArrowUp'] || keyState.current['w']) {
      playerY.current = Math.max(0, playerY.current - PADDLE_SPEED);
    }
    if (keyState.current['ArrowDown'] || keyState.current['s']) {
      playerY.current = Math.min(320, playerY.current + PADDLE_SPEED);
    }

    const b = ball.current;
    b.x += b.vx;
    b.y += b.vy;

    // AI movement tracking ball y
    const aiTarget = b.y - PADDLE_HEIGHT / 2;
    if (aiY.current < aiTarget) aiY.current = Math.min(320, aiY.current + 3.2);
    else if (aiY.current > aiTarget) aiY.current = Math.max(0, aiY.current - 3.2);

    // Wall bounce
    if (b.y <= b.radius || b.y >= 400 - b.radius) {
      b.vy = -b.vy;
      playBeep(440, 0.05);
    }

    // Player collision
    if (b.x <= PADDLE_WIDTH + 10 && b.y >= playerY.current && b.y <= playerY.current + PADDLE_HEIGHT) {
      b.vx = -b.vx * 1.05; // speed up slightly
      b.x = PADDLE_WIDTH + 11;
      playBeep(660, 0.08, 'triangle');
    }

    // AI collision
    if (b.x >= 390 - PADDLE_WIDTH && b.y >= aiY.current && b.y <= aiY.current + PADDLE_HEIGHT) {
      b.vx = -b.vx * 1.05;
      b.x = 389 - PADDLE_WIDTH;
      playBeep(660, 0.08, 'triangle');
    }

    // Score point check
    if (b.x < 0) {
      setAiScore(prev => {
        const next = prev + 1;
        if (next >= 5) triggerEnd();
        return next;
      });
      resetBall(1);
    }
    if (b.x > 400) {
      setPlayerScore(prev => {
        const next = prev + 1;
        if (next >= 5) triggerEnd();
        return next;
      });
      resetBall(-1);
    }
  };

  const resetBall = (dir) => {
    ball.current = { x: 200, y: 200, vx: dir * 3, vy: (Math.random() - 0.5) * 3, radius: 6 };
    playBeep(330, 0.15);
  };

  const triggerEnd = () => {
    setIsPlaying(false);
    setGameOver(true);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 400);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00f2fe';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2fe';
    ctx.fillRect(10, playerY.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = '#9b51e0';
    ctx.shadowColor = '#9b51e0';
    ctx.fillRect(380, aiY.current, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#white';
    ctx.shadowColor = 'white';
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  const start = () => {
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    playerY.current = 160;
    aiY.current = 160;
    resetBall(1);
    setIsPlaying(true);
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '400px', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
        <span className="text-neon-cyan">{playerScore}</span>
        <span style={{ color: 'var(--color-text-muted)' }}>:</span>
        <span className="text-neon-purple">{aiScore}</span>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} width={400} height={400} className="canvas-element" />
        {(!isPlaying || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red">{playerScore > aiScore ? '당신의 승리!' : '패배했습니다.'}</h3>}
            <button onClick={start} className="glow-btn overlay-btn">
              {gameOver ? '다시 도전' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. Space Invaders (Cyber Shooter) Game Component
   ========================================================================== */
function ShooterGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const playerX = useRef(180);
  const lasers = useRef([]);
  const enemies = useRef([]);
  const keyState = useRef({});

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keyState.current[e.key] = true;
      if (e.key === ' ' && isPlaying) {
        lasers.current.push({ x: playerX.current + 18, y: 360, vy: -5 });
        playBeep(700, 0.05, 'triangle');
      }
    };
    const handleKeyUp = (e) => { keyState.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  const spawnEnemies = () => {
    enemies.current = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 6; c++) {
        enemies.current.push({
          x: c * 50 + 50,
          y: r * 40 + 40,
          w: 30,
          h: 20,
          vx: 0.8,
          dir: 1
        });
      }
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const update = () => {
    // Player controls
    if (keyState.current['ArrowLeft'] || keyState.current['a']) {
      playerX.current = Math.max(0, playerX.current - 4);
    }
    if (keyState.current['ArrowRight'] || keyState.current['d']) {
      playerX.current = Math.min(360, playerX.current + 4);
    }

    // Bullet update
    lasers.current = lasers.current.filter(l => {
      l.y += l.vy;
      return l.y > 0;
    });

    // Enemy movement
    let dropDown = false;
    enemies.current.forEach(e => {
      e.x += e.vx * e.dir;
      if (e.x <= 0 || e.x >= 400 - e.w) dropDown = true;
    });

    if (dropDown) {
      enemies.current.forEach(e => {
        e.dir = -e.dir;
        e.y += 10;
        if (e.y >= 350) triggerEnd();
      });
    }

    // Collision detection
    lasers.current.forEach((l, lIdx) => {
      enemies.current.forEach((e, eIdx) => {
        if (l.x >= e.x && l.x <= e.x + e.w && l.y >= e.y && l.y <= e.y + e.h) {
          enemies.current.splice(eIdx, 1);
          lasers.current.splice(lIdx, 1);
          setScore(prev => prev + 10);
          playBeep(980, 0.08, 'sawtooth');
        }
      });
    });

    if (enemies.current.length === 0) {
      spawnEnemies(); // next level
      playBeep(1100, 0.2);
    }
  };

  const triggerEnd = () => {
    setIsPlaying(false);
    setGameOver(true);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw lasers
    ctx.fillStyle = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f2fe';
    lasers.current.forEach(l => {
      ctx.fillRect(l.x, l.y, 4, 10);
    });

    // Draw enemies
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff3366';
    enemies.current.forEach(e => {
      ctx.fillRect(e.x, e.y, e.w, e.h);
    });

    // Draw player ship
    ctx.fillStyle = '#9b51e0';
    ctx.shadowColor = '#9b51e0';
    ctx.beginPath();
    ctx.moveTo(playerX.current + 20, 360);
    ctx.lineTo(playerX.current, 380);
    ctx.lineTo(playerX.current + 40, 380);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
  };

  const start = () => {
    playerX.current = 180;
    lasers.current = [];
    setScore(0);
    setGameOver(false);
    spawnEnemies();
    setIsPlaying(true);
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '400px', justifyContent: 'space-between' }}>
        <span>Score: {score}</span>
        <span>Space: 미사일 발사</span>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} width={400} height={400} className="canvas-element" />
        {(!isPlaying || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red">GAME OVER ({score})</h3>}
            <button onClick={start} className="glow-btn overlay-btn">
              {gameOver ? '다시 도전' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   6. Brick Breaker Game Component
   ========================================================================== */
function BricksGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const ball = useRef({ x: 200, y: 340, vx: 2.5, vy: -2.5, r: 6 });
  const paddleX = useRef(160);
  const bricks = useRef([]);
  const keyState = useRef({});

  const PADDLE_W = 80;
  const PADDLE_H = 10;
  const COLS = 6;
  const ROWS = 4;

  useEffect(() => {
    draw();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => { keyState.current[e.key] = true; };
    const handleKeyUp = (e) => { keyState.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const initBricks = () => {
    bricks.current = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        bricks.current.push({
          x: c * 60 + 25,
          y: r * 25 + 40,
          w: 50,
          h: 15,
          alive: true
        });
      }
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const update = () => {
    // Paddle movement
    if (keyState.current['ArrowLeft'] || keyState.current['a']) {
      paddleX.current = Math.max(0, paddleX.current - 5);
    }
    if (keyState.current['ArrowRight'] || keyState.current['d']) {
      paddleX.current = Math.min(400 - PADDLE_W, paddleX.current + 5);
    }

    const b = ball.current;
    b.x += b.vx;
    b.y += b.vy;

    // Wall bounce
    if (b.x <= b.r || b.x >= 400 - b.r) {
      b.vx = -b.vx;
      playBeep(440, 0.05);
    }
    if (b.y <= b.r) {
      b.vy = -b.vy;
      playBeep(440, 0.05);
    }

    // Paddle bounce
    if (b.y >= 360 - b.r && b.x >= paddleX.current && b.x <= paddleX.current + PADDLE_W) {
      b.vy = -Math.abs(b.vy);
      // Change bounce angle based on hitting position
      const hit = b.x - (paddleX.current + PADDLE_W / 2);
      b.vx = hit * 0.1;
      playBeep(660, 0.08, 'triangle');
    }

    // Floor lose check
    if (b.y > 400) {
      setIsPlaying(false);
      setGameOver(true);
      playBeep(180, 0.4);
    }

    // Brick collisions
    bricks.current.forEach(bk => {
      if (!bk.alive) return;
      if (b.x + b.r >= bk.x && b.x - b.r <= bk.x + bk.w && b.y + b.r >= bk.y && b.y - b.r <= bk.y + bk.h) {
        bk.alive = false;
        b.vy = -b.vy;
        setScore(prev => prev + 10);
        playBeep(880, 0.08, 'sine');
      }
    });

    if (bricks.current.every(bk => !bk.alive)) {
      initBricks();
      b.x = 200;
      b.y = 300;
      b.vx = 2.5;
      b.vy = -2.5;
      playBeep(1000, 0.2);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Bricks
    bricks.current.forEach((bk, i) => {
      if (!bk.alive) return;
      const colors = ['#00f2fe', '#9b51e0', '#ff3366', '#fbbf24'];
      const c = colors[i % 4];
      ctx.fillStyle = c;
      ctx.shadowBlur = 6;
      ctx.shadowColor = c;
      ctx.fillRect(bk.x, bk.y, bk.w, bk.h);
    });

    // Draw Paddle
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.fillRect(paddleX.current, 360, PADDLE_W, PADDLE_H);

    // Draw Ball
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';
    ctx.beginPath();
    ctx.arc(ball.current.x, ball.current.y, ball.current.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  };

  const start = () => {
    ball.current = { x: 200, y: 300, vx: 2, vy: -3, r: 6 };
    paddleX.current = 160;
    setScore(0);
    setGameOver(false);
    initBricks();
    setIsPlaying(true);
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '400px', justifyContent: 'space-between' }}>
        <span>Score: {score}</span>
        <span>화살표키: 패들 조작</span>
      </div>

      <div className="canvas-container">
        <canvas ref={canvasRef} width={400} height={400} className="canvas-element" />
        {(!isPlaying || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red">GAME OVER ({score})</h3>}
            <button onClick={start} className="glow-btn overlay-btn">
              {gameOver ? '다시 도전' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   7. 2048 Neon Game Component
   ========================================================================== */
function Game2048({ playBeep }) {
  const [board, setBoard] = useState(Array(4).fill().map(() => Array(4).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initBoard();
  }, []);

  const initBoard = () => {
    let grid = Array(4).fill().map(() => Array(4).fill(0));
    addRandom(grid);
    addRandom(grid);
    setBoard(grid);
    setScore(0);
    setGameOver(false);
  };

  const addRandom = (grid) => {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      grid[r][c] = Math.random() > 0.1 ? 2 : 4;
    }
  };

  const slide = (row) => {
    // slide all non-zero cells to the left
    let arr = row.filter(val => val !== 0);
    let missing = 4 - arr.length;
    let zeroes = Array(missing).fill(0);
    return arr.concat(zeroes);
  };

  const merge = (row, scoreAdder) => {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] = row[i] * 2;
        scoreAdder.value += row[i];
        row[i + 1] = 0;
      }
    }
    return row;
  };

  const rotate = (grid) => {
    let rGrid = Array(4).fill().map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        rGrid[c][3 - r] = grid[r][c];
      }
    }
    return rGrid;
  };

  const handleMove = (direction) => {
    if (gameOver) return;
    
    let copy = board.map(row => [...row]);
    let rotated = 0;
    
    // We formulate everything as "slide left". So rotate grid matching slide action.
    if (direction === 'up') { copy = rotate(rotate(rotate(copy))); rotated = 1; }
    else if (direction === 'right') { copy = rotate(rotate(copy)); rotated = 2; }
    else if (direction === 'down') { copy = rotate(copy); rotated = 3; }

    const scoreAdder = { value: 0 };
    let changed = false;

    for (let i = 0; i < 4; i++) {
      const orig = [...copy[i]];
      let slided = slide(copy[i]);
      let merged = merge(slided, scoreAdder);
      let res = slide(merged);
      copy[i] = res;

      if (orig.some((v, idx) => v !== res[idx])) changed = true;
    }

    // Undo rotation
    if (rotated === 1) copy = rotate(copy);
    else if (rotated === 2) copy = rotate(rotate(copy));
    else if (rotated === 3) copy = rotate(rotate(rotate(copy)));

    if (changed) {
      addRandom(copy);
      setBoard(copy);
      setScore(prev => prev + scoreAdder.value);
      playBeep(700, 0.06, 'sine');
      
      // Check gameover
      if (isGameOver(copy)) {
        setGameOver(true);
        playBeep(220, 0.3);
      }
    }
  };

  const isGameOver = (grid) => {
    // Check empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === 0) return false;
      }
    }
    // Check possible merges horizontal
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (grid[r][c] === grid[r][c + 1]) return false;
      }
    }
    // Check possible merges vertical
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c] === grid[r + 1][c]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === 'ArrowUp') handleMove('up');
      if (e.key === 'ArrowDown') handleMove('down');
      if (e.key === 'ArrowLeft') handleMove('left');
      if (e.key === 'ArrowRight') handleMove('right');
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  });

  return (
    <div className="game-2048-wrapper">
      <div className="flex-center-between" style={{ width: '320px', marginBottom: '1rem' }}>
        <span>Score: {score}</span>
        <button onClick={initBoard} className="u-btn btn-action-small u-btn-secondary">다시 시작</button>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="grid-2048">
          {board.map((row, r) => 
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className={`cell-2048 ${cell > 0 ? `tile-${cell}` : ''}`}>
                {cell > 0 ? cell : ''}
              </div>
            ))
          )}
        </div>
        {gameOver && (
          <div className="game-overlay" style={{ borderRadius: '16px' }}>
            <h3 className="overlay-badge-red">GAME OVER</h3>
            <button onClick={initBoard} className="glow-btn overlay-btn">재시도</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   8. Smart Tic-Tac-Toe Game Component
   ========================================================================== */
function TicTacToeGame({ playBeep }) {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [status, setStatus] = useState('play'); // play | win | lose | draw
  const [userTurn, setUserTurn] = useState(true);

  const reset = () => {
    setBoard(Array(9).fill(''));
    setStatus('play');
    setUserTurn(true);
  };

  const handleCellClick = (idx) => {
    if (board[idx] !== '' || status !== 'play' || !userTurn) return;

    let copy = [...board];
    copy[idx] = 'X';
    setBoard(copy);
    playBeep(660, 0.05);

    if (checkWin(copy, 'X')) {
      setStatus('win');
      playBeep(980, 0.25);
      return;
    }
    if (copy.every(c => c !== '')) {
      setStatus('draw');
      playBeep(440, 0.2);
      return;
    }

    setUserTurn(false);
    setTimeout(() => aiMove(copy), 500);
  };

  const aiMove = (grid) => {
    // Minimax search helper for intelligent move selection
    const minimax = (tempGrid, depth, isMax) => {
      if (checkWin(tempGrid, 'O')) return 10 - depth;
      if (checkWin(tempGrid, 'X')) return depth - 10;
      if (tempGrid.every(c => c !== '')) return 0;

      if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
          if (tempGrid[i] === '') {
            tempGrid[i] = 'O';
            best = Math.max(best, minimax(tempGrid, depth + 1, false));
            tempGrid[i] = '';
          }
        }
        return best;
      } else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
          if (tempGrid[i] === '') {
            tempGrid[i] = 'X';
            best = Math.min(best, minimax(tempGrid, depth + 1, true));
            tempGrid[i] = '';
          }
        }
        return best;
      }
    };

    let bestVal = -1000;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (grid[i] === '') {
        grid[i] = 'O';
        let moveVal = minimax(grid, 0, false);
        grid[i] = '';
        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }

    if (bestMove !== -1) {
      grid[bestMove] = 'O';
      setBoard(grid);
      playBeep(523, 0.05);

      if (checkWin(grid, 'O')) {
        setStatus('lose');
        playBeep(220, 0.3);
        return;
      }
      if (grid.every(c => c !== '')) {
        setStatus('draw');
        playBeep(440, 0.2);
        return;
      }
    }
    setUserTurn(true);
  };

  const checkWin = (grid, player) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return lines.some(line => line.every(idx => grid[idx] === player));
  };

  return (
    <div className="ttt-wrapper">
      <div className="flex-center-between" style={{ width: '300px', marginBottom: '1.25rem' }}>
        <span>상대: 인공지능 (O)</span>
        <button onClick={reset} className="u-btn btn-action-small u-btn-secondary">다시 시작</button>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="ttt-board">
          {board.map((cell, idx) => (
            <div key={idx} onClick={() => handleCellClick(idx)} className={`ttt-cell ${cell === 'X' ? 'ttt-x' : cell === 'O' ? 'ttt-o' : ''}`}>
              {cell}
            </div>
          ))}
        </div>

        {status !== 'play' && (
          <div className="game-overlay" style={{ borderRadius: '12px' }}>
            <h3 className="overlay-title-small">
              {status === 'win' && '🎉 당신의 승리!'}
              {status === 'lose' && '🤖 인공지능 승리'}
              {status === 'draw' && '⚖️ 무승부'}
            </h3>
            <button onClick={reset} className="glow-btn overlay-btn">재도전</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   9. Memory Card Match Game Component
   ========================================================================== */
function MemoryGame({ playBeep }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices
  const [matched, setMatched] = useState([]); // matched values
  const [moves, setMoves] = useState(0);
  const [win, setWin] = useState(false);

  const ICONS = ['💻', '🔋', '🔑', '🎨', '🚀', '🛠️', '💎', '📢'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // Duplicate and shuffle
    const combined = [...ICONS, ...ICONS];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    
    setCards(combined);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWin(false);
  };

  const handleCardClick = (idx) => {
    if (flipped.includes(idx) || matched.includes(cards[idx]) || flipped.length >= 2) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    playBeep(660, 0.05);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped;
      
      if (cards[first] === cards[second]) {
        // Matched!
        setTimeout(() => {
          setMatched(prev => {
            const next = [...prev, cards[first]];
            if (next.length === ICONS.length) {
              setWin(true);
              playBeep(980, 0.3);
            }
            return next;
          });
          setFlipped([]);
          playBeep(880, 0.1, 'sine');
        }, 400);
      } else {
        // Unmatched
        setTimeout(() => {
          setFlipped([]);
          playBeep(330, 0.1, 'triangle');
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-wrapper">
      <div className="flex-center-between" style={{ width: '340px', marginBottom: '1rem' }}>
        <span>시도 횟수: {moves} 회</span>
        <button onClick={initGame} className="u-btn btn-action-small u-btn-secondary">셔플 리셋</button>
      </div>

      <div style={{ position: 'relative' }}>
        <div className="memory-board">
          {cards.map((val, idx) => {
            const isFlipped = flipped.includes(idx);
            const isMatched = matched.includes(val);
            return (
              <div 
                key={idx} 
                className={`memory-card ${isFlipped || isMatched ? 'memory-card-flipped' : ''} ${isMatched ? 'memory-card-matched' : ''}`}
                onClick={() => handleCardClick(idx)}
              >
                <div className="memory-card-inner">
                  <div className="memory-card-back">❓</div>
                  <div className="memory-card-front">{val}</div>
                </div>
              </div>
            );
          })}
        </div>

        {win && (
          <div className="game-overlay" style={{ borderRadius: '16px' }}>
            <h3 className="overlay-title-small">🎉 모든 짝을 맞췄습니다!</h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              완료 횟수: {moves}회 시도
            </span>
            <button onClick={initGame} className="glow-btn overlay-btn">다시 시작</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   10. Flappy Cyber Drone Game Component
   ========================================================================== */
function FlappyGame({ playBeep }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const droneY = useRef(200);
  const droneVelocity = useRef(0);
  const obstacles = useRef([]);
  const frameCount = useRef(0);

  const GRAVITY = 0.25;
  const JUMP_FORCE = -4.8;

  useEffect(() => {
    const saved = localStorage.getItem('arcade_flappy_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
    draw();
  }, []);

  const handleAction = () => {
    if (!isPlaying) return;
    droneVelocity.current = JUMP_FORCE;
    playBeep(660, 0.05, 'triangle');
  };

  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleAction();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  });

  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    const loop = () => {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const update = () => {
    frameCount.current++;

    // Gravity calculation
    droneVelocity.current += GRAVITY;
    droneY.current += droneVelocity.current;

    // Floor / Ceiling collisions
    if (droneY.current <= 8 || droneY.current >= 392) {
      triggerEnd();
    }

    // Obstacles scrolling
    if (frameCount.current % 120 === 0) {
      const gap = 110;
      const minH = 40;
      const maxH = 250;
      const topHeight = Math.floor(Math.random() * (maxH - minH)) + minH;
      obstacles.current.push({
        x: 400,
        w: 40,
        top: topHeight,
        bottom: 400 - (topHeight + gap),
        passed: false
      });
    }

    obstacles.current.forEach(obs => {
      obs.x -= 2.2;

      // Obstacle collision check
      const droneX = 80;
      if (droneX + 10 >= obs.x && droneX - 10 <= obs.x + obs.w) {
        if (droneY.current - 10 <= obs.top || droneY.current + 10 >= 400 - obs.bottom) {
          triggerEnd();
        }
      }

      // Point scoring
      if (!obs.passed && obs.x < droneX) {
        obs.passed = true;
        setScore(prev => {
          const next = prev + 1;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('arcade_flappy_highscore', next.toString());
          }
          return next;
        });
        playBeep(880, 0.08, 'sine');
      }
    });

    // Remove off-screen obstacles
    obstacles.current = obstacles.current.filter(obs => obs.x > -obs.w);
  };

  const triggerEnd = () => {
    setIsPlaying(false);
    setGameOver(true);
    playBeep(220, 0.4);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f111a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Obstacles
    ctx.fillStyle = '#ff3366';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff3366';
    obstacles.current.forEach(obs => {
      // Top pipe
      ctx.fillRect(obs.x, 0, obs.w, obs.top);
      // Bottom pipe
      ctx.fillRect(obs.x, 400 - obs.bottom, obs.w, obs.bottom);
    });

    // Draw Drone
    ctx.fillStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.beginPath();
    ctx.arc(80, droneY.current, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  };

  const start = () => {
    droneY.current = 200;
    droneVelocity.current = 0;
    obstacles.current = [];
    frameCount.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="game-screen-col">
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', width: '400px', justifyContent: 'space-between' }}>
        <span>Score: {score}</span>
        <span>Space/Tap: 상승 비행</span>
      </div>

      <div className="canvas-container" onClick={handleAction}>
        <canvas ref={canvasRef} width={400} height={400} className="canvas-element" />
        {(!isPlaying || gameOver) && (
          <div className="game-overlay">
            {gameOver && <h3 className="overlay-badge-red">GAME OVER ({score})</h3>}
            <button onClick={start} className="glow-btn overlay-btn">
              {gameOver ? '다시 도전' : '게임 시작'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
