import React, { useState, useEffect, useRef } from 'react';
import IntroScreen from './components/IntroScreen';
import Desktop from './components/Desktop';
import BirthdayCake from './components/BirthdayCake';
import { sound } from './components/SoundManager';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('boot'); // boot -> login -> intro -> desktop -> bsod -> cake
  const [bootProgress, setBootProgress] = useState(0);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  // Easter Eggs & Micro Animations States
  const [sparkles, setSparkles] = useState([]);
  const [petals, setPetals] = useState([]);
  const [isGardenBloomed, setIsGardenBloomed] = useState(false);
  const [clockClickCount, setClockClickCount] = useState(0);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showLoveModal, setShowLoveModal] = useState(false);
  const [wallpaperQuote, setWallpaperQuote] = useState(null);

  // Konami Code sequence tracker
  const konamiSeq = useRef([]);

  // 1. Boot Progress Simulation
  useEffect(() => {
    if (gameState !== 'boot') return;
    
    setBootProgress(0);
    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGameState('login');
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [gameState]);

  // 2. Cursor Sparkles trail tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Limit frequency of sparkles spawned to keep performance solid
      if (Math.random() > 0.15) return;
      
      const newSparkle = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: ['#f43f5e', '#ff8ca3', '#fca5a5', '#fbbf24', '#fff'][Math.floor(Math.random() * 5)],
        char: ['✨', '❤️', '🌸', '★'][Math.floor(Math.random() * 4)],
        offsetX: Math.random() * 30 - 15,
        offsetY: Math.random() * 30 - 15
      };

      setSparkles(prev => [...prev, newSparkle]);

      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Konami Code Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Konami: Up Up Down Down Left Right Left Right B A
      const codes = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
      ];
      
      konamiSeq.current.push(e.key);
      // Keep only last 10
      if (konamiSeq.current.length > 10) {
        konamiSeq.current.shift();
      }

      if (JSON.stringify(konamiSeq.current) === JSON.stringify(codes)) {
        sound.playSuccess();
        setShowFireworks(true);
        konamiSeq.current = []; // Reset
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 4. Floating Flower Petals Generator
  useEffect(() => {
    if (!isGardenBloomed) return;

    // Spawn falling petals continuously
    const spawnPetal = () => {
      const newPetal = {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        color: ['#fbcfe8', '#fecdd3', '#fda4af', '#fca5a5'][Math.floor(Math.random() * 4)],
        size: Math.random() * 10 + 8,
        drift: Math.random() * 150 - 75
      };

      setPetals(prev => [...prev, newPetal]);
      
      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.id !== newPetal.id));
      }, 6000);
    };

    const interval = setInterval(spawnPetal, 400);
    return () => clearInterval(interval);
  }, [isGardenBloomed]);

  // Login click Ok handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError("Please enter the password!");
      return;
    }
    sound.playBootChime();
    setGameState('intro');
  };

  const handleAcceptSurprise = () => {
    sound.playSuccess();
    setGameState('desktop');
    sound.startMusic();
  };

  const triggerBSOD = () => {
    sound.playHit();
    sound.stopMusic();
    setGameState('bsod');
  };

  const exitBSOD = () => {
    sound.playSuccess();
    setGameState('cake');
    sound.startMusic();
  };

  // Clock click counter clicker
  const handleClockClick = () => {
    sound.playClick();
    setClockClickCount(prev => {
      const next = prev + 1;
      if (next >= 20) {
        sound.playSuccess();
        setShowFireworks(true);
        return 0; // Reset
      }
      return next;
    });
  };

  // Double click wallpaper quote selector
  const handleDoubleClickWallpaper = (e) => {
    // Only trigger if clicking actual background, not window elements
    if (e.target.className === 'desktop-workspace') {
      sound.playClick();
      const quotes = [
        "I still smile when your name appears on my screen. ❤️",
        "I pray for your happiness every single day. 🙏",
        "Before you came, happiness was a moment. Now it is you. ❤️",
        "Every second spent with you is my favorite memory. ✨",
        "You are my peace in the middle of chaos. ⚓"
      ];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setWallpaperQuote(randomQuote);
    }
  };

  return (
    <div 
      onDoubleClick={handleDoubleClickWallpaper}
      style={{ width: '100%', height: '100%', outline: 'none' }}
    >
      {/* CRT Scanline overlay effect */}
      <div className="crt-overlay" />

      {/* Floating cursor trails */}
      {sparkles.map(s => (
        <span
          key={s.id}
          className="sparkle-particle"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            color: s.color,
            textShadow: `0 0 3px ${s.color}`,
            '--x': `${s.offsetX}px`,
            '--y': `${s.offsetY}px`
          }}
        >
          {s.char}
        </span>
      ))}

      {/* Floating flower petals */}
      {petals.map(p => (
        <div
          key={p.id}
          className="petal-particle"
          style={{
            left: `${p.x}px`,
            top: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0.8,
            '--x': `${p.drift}px`
          }}
        >
          <Heart size={p.size} fill={p.color} color="none" />
        </div>
      ))}

      {/* Fireworks / Birthday screen cover */}
      {showFireworks && (
        <div className="firework-overlay" onClick={() => setShowFireworks(false)}>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '18px', color: '#db2777', textShadow: '2px 2px #fff', marginBottom: '20px', animation: 'heartBeat 1s infinite', textAlign: 'center' }}>
            🎆 HAPPY BIRTHDAY FOREVER! 🎆
          </h2>
          <p style={{ color: '#fff', fontSize: '12px', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
            Click anywhere on the screen to return.
          </p>
          {/* Mock exploding CSS particles */}
          <div className="firework" style={{ backgroundColor: '#db2777', top: '30%', left: '40%' }}></div>
          <div className="firework" style={{ backgroundColor: '#eab308', top: '50%', left: '60%', animationDelay: '0.2s' }}></div>
          <div className="firework" style={{ backgroundColor: '#3b82f6', top: '40%', left: '70%', animationDelay: '0.4s' }}></div>
          <div className="firework" style={{ backgroundColor: '#22c55e', top: '60%', left: '30%', animationDelay: '0.6s' }}></div>
        </div>
      )}

      {/* Wallpaper Double-click Love Quotes Modal */}
      {wallpaperQuote && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 12000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setWallpaperQuote(null)}
        >
          <div 
            className="retro-window" 
            style={{ width: '310px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="retro-titlebar">
              <div className="retro-titlebar-text">💭 Romantic Quote</div>
              <div className="retro-titlebar-btn" onClick={() => setWallpaperQuote(null)}>X</div>
            </div>
            <div className="retro-window-body" style={{ padding: '20px', backgroundColor: '#fff', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#be185d', lineHeight: '1.4', marginBottom: '15px' }}>
                "{wallpaperQuote}"
              </p>
              <button className="retro-button primary" onClick={() => setWallpaperQuote(null)} style={{ padding: '4px 15px', fontSize: '11px' }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A. BOOT SCREEN */}
      {gameState === 'boot' && (
        <div className="boot-screen">
          <div className="boot-logo-box">
            <h1 className="boot-logo-text">LoveOS</h1>
            <div style={{ fontSize: '8px', color: '#c0c0c0', borderTop: '1px solid #c0c0c0', paddingTop: '4px' }}>
              SYSTEM VERSION 20.0
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>Loading system files... {bootProgress}%</div>
          <div className="boot-progress-container">
            <div className="boot-progress-bar" style={{ width: `${bootProgress}%` }}></div>
          </div>
          <div style={{ marginTop: '50px', fontSize: '7px', color: '#555' }}>
            Microsoft Windows 98 © 1998 Modified for Love
          </div>
        </div>
      )}

      {/* B. LOGIN SCREEN */}
      {gameState === 'login' && (
        <div className="login-screen">
          <form 
            onSubmit={handleLoginSubmit}
            className="retro-window" 
            style={{ width: '330px', boxShadow: '5px 5px 15px rgba(0,0,0,0.3)' }}
          >
            <div className="retro-titlebar">
              <div className="retro-titlebar-text">🔐 System Logon</div>
            </div>
            
            <div className="retro-window-body" style={{ padding: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ fontSize: '28px' }} className="heart-beat">🔑</div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Welcome to LoveOS v20.0</p>
                  <p style={{ fontSize: '11px', color: '#555' }}>Please log on to connect to Dharani's heart.</p>
                </div>
              </div>

              <div className="login-row">
                <label className="login-label">User name:</label>
                <input 
                  type="text" 
                  className="login-input" 
                  value="Birthday Girl" 
                  disabled 
                  style={{ backgroundColor: '#e2e8f0', color: '#555' }}
                />
              </div>

              <div className="login-row">
                <label className="login-label">Password:</label>
                <input 
                  type="password" 
                  className="login-input" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  autoFocus
                  placeholder="********"
                />
              </div>

              <p 
                style={{ 
                  fontSize: '10.5px', color: '#b91c1c', fontStyle: 'italic', 
                  textAlign: 'center', marginBottom: '8px', minHeight: '1.2em' 
                }}
              >
                {loginError || `Hint: "The nickname I call you."`}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="submit" 
                  className="retro-button primary"
                  style={{ padding: '4px 15px', fontSize: '11px' }}
                >
                  OK
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* C. YES/NO INTRO SCREEN */}
      {gameState === 'intro' && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#9fb8d4',
            zIndex: 5100
          }}
        >
          <IntroScreen onAccept={handleAcceptSurprise} />
        </div>
      )}

      {/* D. LOVEOS WORKSPACE DESKTOP */}
      {gameState === 'desktop' && (
        <Desktop 
          onTriggerBSOD={triggerBSOD} 
          onGardenBloom={() => setIsGardenBloomed(true)}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onClockClick={handleClockClick}
        />
      )}

      {/* E. BLUE SCREEN OF DEATH (BSOD) */}
      {gameState === 'bsod' && (
        <div className="bsod-screen" onClick={exitBSOD}>
          <div>
            <div className="bsod-text-center">LoveOS</div>
            <p>A fatal exception 0xLOVE2026 has occurred at memory segment DHARANI_HEART.</p>
            <p>The current system session has collapsed due to an overload of cute memories.</p>
            <br />
            <p>Reason for crash: TOO_MANY_BEAUTIFUL_MEMORIES_DETECTED</p>
            <p>Severity: Romantic critical warning</p>
            <br />
            <p>* Click anywhere on the screen or press ENTER to continue loving forever...</p>
            <p>* System will restart into Birthday Celebration mode.</p>
            <p>* No memories were lost in this process.</p>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'Courier New', fontSize: '15px' }}>
            Press any key or click to continue _
          </div>
        </div>
      )}

      {/* F. BIRTHDAY CAKE WISHES SCREEN */}
      {gameState === 'cake' && (
        <BirthdayCake onRestart={() => setGameState('desktop')} />
      )}
    </div>
  );
}
