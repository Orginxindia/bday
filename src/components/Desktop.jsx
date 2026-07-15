import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Gamepad2, 
  Flower2, 
  Gift, 
  Volume2, 
  FolderHeart, 
  Trash2, 
  FileText,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  Clock,
  Folder
} from 'lucide-react';
import { sound } from './SoundManager';
import posterImg from '../assets/poster.jpg';

// Custom flower SVGs matching the mockup
const SproutSVG = () => (
  <svg viewBox="0 0 24 24" width="45" height="45" className="pixel-float">
    <path d="M12 22V9" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M12 12C12 12 9 8 5 10C5 10 8 13 12 12Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
    <path d="M12 10C12 10 15 6 19 8C19 8 16 11 12 10Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
  </svg>
);

const RoseSVG = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" className="heart-beat">
    <path d="M12 22V10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M12 14C12 14 8 12 6 13" stroke="#15803d" strokeWidth="2" fill="none" />
    <path d="M12 16C12 16 16 14 18 15" stroke="#15803d" strokeWidth="2" fill="none" />
    {/* Rose head */}
    <circle cx="12" cy="7" r="7" fill="#f43f5e" stroke="#be185d" strokeWidth="1.5" />
    <circle cx="12" cy="7" r="4.5" fill="#fda4af" stroke="#be185d" strokeWidth="1" />
    <circle cx="12" cy="7" r="2" fill="#be185d" />
  </svg>
);

const SunflowerSVG = () => (
  <svg viewBox="0 0 24 24" width="48" height="48" className="pixel-float">
    <path d="M12 22V10" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Yellow petals */}
    <circle cx="12" cy="8" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
    {/* Center core */}
    <circle cx="12" cy="8" r="4" fill="#713f12" stroke="#451a03" strokeWidth="1" />
  </svg>
);

const LavenderSVG = () => (
  <svg viewBox="0 0 24 24" width="46" height="46" className="heart-beat">
    <path d="M12 22V7" stroke="#16a34a" strokeWidth="2.5" fill="none" />
    {/* Purple buds */}
    <circle cx="12" cy="11" r="3.5" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="9" cy="9" r="3" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="15" cy="9" r="3" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="12" cy="7" r="3" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="10" cy="5" r="2.5" fill="#c084fc" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="14" cy="5" r="2.5" fill="#c084fc" stroke="#6d28d9" strokeWidth="1" />
    <circle cx="12" cy="3" r="2" fill="#8b5cf6" />
  </svg>
);

const LilySVG = () => (
  <svg viewBox="0 0 24 24" width="45" height="45" className="pixel-float">
    <path d="M12 22V9" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* White Petals */}
    <path d="M12 9 C8 4, 4 8, 12 12 C20 8, 16 4, 12 9 Z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
    <path d="M12 9 C12 5, 8 2, 12 9 C16 2, 12 5, 12 9 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
    {/* Yellow pistil */}
    <circle cx="12" cy="7" r="1.5" fill="#fbbf24" />
  </svg>
);

// Custom Hook for Draggable Windows
function useDraggable(initialX, initialY, windowId, setActiveWindow) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const dragStart = useRef(null);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setActiveWindow(windowId);
    
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };

    const handleMouseMove = (moveEvent) => {
      if (!dragStart.current) return;
      
      let newX = moveEvent.clientX - dragStart.current.x;
      let newY = moveEvent.clientY - dragStart.current.y;

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      newX = Math.max(10, Math.min(newX, containerWidth - 150));
      newY = Math.max(10, Math.min(newY, containerHeight - 120));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      dragStart.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return { position, handleMouseDown };
}

// Window Container Component
function DesktopWindow({ 
  id, 
  title, 
  icon: Icon, 
  children, 
  onClose, 
  onMinimize,
  activeWindow, 
  setActiveWindow, 
  initialX, 
  initialY,
  width = '450px',
  height = '380px'
}) {
  const isActive = activeWindow === id;
  const { position, handleMouseDown } = useDraggable(
    initialX, 
    initialY, 
    id, 
    setActiveWindow
  );

  return (
    <div
      className="retro-window"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: width,
        height: height,
        zIndex: isActive ? 2000 : 1000,
        opacity: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={() => setActiveWindow(id)}
    >
      <div 
        className="retro-titlebar" 
        onMouseDown={handleMouseDown}
        style={{ cursor: 'move', userSelect: 'none' }}
      >
        <div className="retro-titlebar-text">
          {Icon && <Icon size={12} className="heart-beat" />}
          <span>{title}</span>
        </div>
        <div className="retro-titlebar-buttons">
          <div className="retro-titlebar-btn" onClick={(e) => { e.stopPropagation(); onMinimize(id); }}>_</div>
          <div className="retro-titlebar-btn" onClick={(e) => { e.stopPropagation(); onClose(id); }}>X</div>
        </div>
      </div>
      <div className="retro-window-body" style={{ overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function Desktop({ onTriggerBSOD, onGardenBloom, isMuted, setIsMuted, onClockClick, onReadLetter }) {
  const [openWindows, setOpenWindows] = useState({
    letter: true,
    garden: false,
    song: true,
    wrapped: false,
    capsule: false,
    coupons: false,
    game: false,
    recycle: false,
    timeline: false,
    dreams: false,
    reasons: false,
    forever: false,
    counter: false,
    poster: false
  });
  
  const [minimizedWindows, setMinimizedWindows] = useState({});
  const [activeWindow, setActiveWindow] = useState('letter');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isPlayingSong, setIsPlayingSong] = useState(true);

  const [scatteredNotes, setScatteredNotes] = useState([
    { id: 1, top: '120px', right: '320px', rotation: '-2deg', title: "Sweet Thought", text: "You are the primary reason I look forward to tomorrow. ❤️", isOpen: false },
    { id: 2, top: '480px', left: '160px', rotation: '3deg', title: "Cute Reminder", text: "Your smile is literally my favorite thing in the whole world. 😊", isOpen: false },
    { id: 3, top: '240px', left: '500px', rotation: '-1deg', title: "Secret Note", text: "I fell in love with your soul before I could even hold your hand. 🌸", isOpen: false },
    { id: 4, top: '100px', left: '260px', rotation: '4deg', title: "Cheesy Spark", text: "Are you a magician? Because whenever I look at you, everyone else disappears. ✨", isOpen: false },
    { id: 5, top: '380px', right: '140px', rotation: '-3deg', title: "Sweet Fact", text: "If I could rank my favorite things, your laugh is #1, and you are #0. ❤️", isOpen: false },
    { id: 6, top: '530px', right: '420px', rotation: '2deg', title: "Pickup Line", text: "Do you have a map? Because I keep getting lost in your eyes. 👀", isOpen: false },
    { id: 7, top: '280px', right: '280px', rotation: '-4deg', title: "Cute Line", text: "My heart beats in 120 FPS whenever you text me. 💓", isOpen: false },
    { id: 8, top: '160px', left: '720px', rotation: '2deg', title: "Secret note", text: "Are you Wi-Fi? Because I'm feeling a really strong connection. 📶", isOpen: false },
    { id: 9, top: '440px', left: '550px', rotation: '-2deg', title: "Warm Thought", text: "You're like my favorite song—I could listen to you on repeat forever. 🎵", isOpen: false },
    { id: 10, top: '90px', left: '440px', rotation: '3deg', title: "Pickup Line", text: "I must be a snowflake, because I've fallen for you. ❄️❤️", isOpen: false }
  ]);

  const [couponStatus, setCouponStatus] = useState({ hug: false, date: false, movie: false, call: false, wish: false, cuddles: false });

  // Clock sync
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      const options = { day: 'numeric', month: 'long' };
      setCurrentDate(date.toLocaleDateString('en-GB', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync volume state
  useEffect(() => {
    setIsPlayingSong(sound.isPlayingMusic);
    const interval = setInterval(() => {
      setIsPlayingSong(sound.isPlayingMusic);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handlePlayPause = () => {
    sound.playClick();
    if (isPlayingSong) {
      sound.stopMusic();
      setIsPlayingSong(false);
      setIsMuted(true);
    } else {
      sound.startMusic();
      setIsPlayingSong(true);
      setIsMuted(false);
    }
  };

  const closeWindow = (id) => {
    sound.playClick();
    setOpenWindows(prev => ({ ...prev, [id]: false }));
  };

  const minimizeWindow = (id) => {
    sound.playClick();
    setMinimizedWindows(prev => ({ ...prev, [id]: true }));
    if (activeWindow === id) {
      const remaining = Object.keys(openWindows).find(w => openWindows[w] && !minimizedWindows[w] && w !== id);
      setActiveWindow(remaining || '');
    }
  };

  const openWindow = (id) => {
    sound.playClick();
    setOpenWindows(prev => ({ ...prev, [id]: true }));
    setMinimizedWindows(prev => ({ ...prev, [id]: false }));
    setActiveWindow(id);
  };

  const toggleWindowMinimize = (id) => {
    sound.playClick();
    if (minimizedWindows[id]) {
      setMinimizedWindows(prev => ({ ...prev, [id]: false }));
      setActiveWindow(id);
    } else if (activeWindow === id) {
      minimizeWindow(id);
    } else {
      setActiveWindow(id);
    }
  };

  const handleReadLetter = () => {
    setOpenWindows(prev => ({
      ...prev,
      letter: false,
      garden: true,
      song: true,
      timeline: true
    }));
    setActiveWindow('garden');
    if (onReadLetter) {
      onReadLetter();
    }
  };

  const letterWidth = window.innerWidth > 680 ? 640 : Math.floor(window.innerWidth * 0.9);
  const letterHeight = window.innerHeight > 680 ? 530 : Math.floor(window.innerHeight * 0.82);
  const letterX = window.innerWidth > 680 ? Math.floor((window.innerWidth - letterWidth) / 2) : 10;
  const letterY = window.innerHeight > 680 ? Math.floor((window.innerHeight - letterHeight) / 2) : 65;

  return (
    <div 
      className="desktop-workspace"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        padding: '50px 20px 20px 130px',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP SYSTEM BAR */}
      <div className="retro-taskbar">
        <div className="taskbar-left">
          <span>💖 sadhu's 20's ❤️</span>
        </div>
        <div className="taskbar-right">
          <div 
            className="taskbar-battery" 
            onClick={() => alert("I Love You ❤️")} 
            style={{ cursor: 'pointer' }}
            title="Heart Meter"
          >
            <span>❤️</span> 100%
          </div>
          <div className="retro-titlebar-buttons">
            <div className="retro-titlebar-btn">_</div>
            <div className="retro-titlebar-btn">#</div>
            <div className="retro-titlebar-btn">X</div>
          </div>
        </div>
      </div>

      {/* 2. SIDEBAR SHORTCUTS COLUMN */}
      <div 
        className="desktop-sidebar"
        style={{
          position: 'absolute', top: '55px', left: '15px',
          display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 100
        }}
      >
        <DesktopIcon title="Love Letter" icon={MessageSquare} onClick={() => openWindow('letter')} isOpen={openWindows.letter} />
        <DesktopIcon title="Memory Box" icon={FolderHeart} onClick={() => openWindow('wrapped')} isOpen={openWindows.wrapped} />
        <DesktopIcon title="Catch Hearts" icon={Gamepad2} onClick={() => openWindow('game')} isOpen={openWindows.game} />
        <DesktopIcon title="Virtual Garden" icon={Flower2} onClick={() => openWindow('garden')} isOpen={openWindows.garden} />
        <DesktopIcon title="Surprises" icon={Gift} onClick={() => openWindow('capsule')} isOpen={openWindows.capsule} />
        <DesktopIcon title="Love Coupons" icon={Gift} onClick={() => openWindow('coupons')} isOpen={openWindows.coupons} style={{ color: '#ec4899' }} />
        <DesktopIcon title="Our Playlist" icon={Volume2} onClick={() => openWindow('song')} isOpen={openWindows.song} />
        
        {/* NEW V2.0 APPS SHORTCUTS */}
        <DesktopIcon title="Timeline" icon={Clock} onClick={() => openWindow('timeline')} isOpen={openWindows.timeline} style={{ color: '#0ea5e9' }} />
        <DesktopIcon title="Future Dreams" icon={Sparkles} onClick={() => openWindow('dreams')} isOpen={openWindows.dreams} style={{ color: '#f59e0b' }} />
        <DesktopIcon title="I Love You" icon={Heart} onClick={() => openWindow('reasons')} isOpen={openWindows.reasons} style={{ color: '#ef4444' }} />
        <DesktopIcon title="Forever Folder" icon={Folder} onClick={() => openWindow('forever')} isOpen={openWindows.forever} style={{ color: '#10b981' }} />
        <DesktopIcon title="Love Counter" icon={Heart} onClick={() => openWindow('counter')} isOpen={openWindows.counter} style={{ color: '#ec4899' }} />
        <DesktopIcon title="Sadhu's Poster" icon={Sparkles} onClick={() => openWindow('poster')} isOpen={openWindows.poster} style={{ color: '#f59e0b' }} />
        
        <DesktopIcon title="Recycle Bin" icon={Trash2} onClick={() => openWindow('recycle')} isOpen={openWindows.recycle} style={{ color: '#888' }} />
      </div>

      {/* 3. WIDGET: Yellow Sticky Note (Bottom Center) */}
      <div className="sticky-note" style={{ width: '250px', left: '50%', bottom: '55px', transform: 'translateX(-50%)', zIndex: 50 }}>
        <div className="sticky-note-tape"></div>
        <h4 style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px dashed #eab308', paddingBottom: '3px' }}>
          Note from me 💌
        </h4>
        <p style={{ fontSize: '12px', fontStyle: 'italic', lineHeight: '1.4', color: '#451a03' }}>
          No matter where life takes us,<br />
          I'll always choose you.<br />
          Today. Tomorrow. Forever.
        </p>
      </div>

      {/* 4. WIDGET: Digital Clock Widget (Bottom Right) */}
      <div className="retro-window clock-widget" style={{ position: 'absolute', bottom: '55px', right: '30px', width: '220px', zIndex: 50 }}>
        <div className="retro-window-body" style={{ padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div 
            onClick={onClockClick}
            style={{ cursor: 'pointer', fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--pixel-red)', letterSpacing: '1px' }}
            title="Click 20 times for a surprise!"
          >
            {currentTime}
          </div>
          <div style={{ fontSize: '11px', color: '#555', fontWeight: 'bold' }}>
            {currentDate}
          </div>
          <button className="retro-button" onClick={() => sound.playSuccess()} style={{ marginTop: '3px', width: '100%', color: 'var(--pixel-red)', borderColor: 'var(--pixel-pink)', fontSize: '10px' }}>
            Happy 20th Birthday! 🎂
          </button>
        </div>
      </div>

      {/* Scattered Secret Notes */}
      {scatteredNotes.map(note => (
        <div
          key={note.id}
          className="sticky-note scattered"
          onClick={() => {
            sound.playClick();
            setScatteredNotes(prev => prev.map(n => n.id === note.id ? { ...n, isOpen: !n.isOpen } : n));
          }}
          style={{
            position: 'absolute',
            top: note.top,
            left: note.left,
            right: note.right,
            transform: `rotate(${note.rotation})`,
            width: '130px',
            padding: '10px',
            backgroundColor: '#fef9c3',
            fontSize: '11px',
            border: '1.5px solid #eab308'
          }}
        >
          <div className="sticky-note-tape" style={{ width: '40px' }}></div>
          <div style={{ fontWeight: 'bold', borderBottom: '1px dashed #eab308', paddingBottom: '2px', marginBottom: '4px' }}>
            {note.title} 📌
          </div>
          <p style={{ fontStyle: 'italic', lineHeight: '1.3', color: '#451a03' }}>
            {note.isOpen ? note.text : "Click to read secret thought..."}
          </p>
        </div>
      ))}

      {/* 5. WINDOWS RENDERING */}

      {/* love_letter.txt */}
      {openWindows.letter && !minimizedWindows.letter && (
        <DesktopWindow id="letter" title="love_letter.txt" icon={MessageSquare} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={letterX} initialY={letterY} width={`${letterWidth}px`} height={`${letterHeight}px`}>
          <LoveLetterApp onReadLetter={handleReadLetter} />
        </DesktopWindow>
      )}

      {/* virtual_garden.exe */}
      {openWindows.garden && !minimizedWindows.garden && (
        <DesktopWindow id="garden" title="virtual_garden.exe" icon={Flower2} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={550} initialY={65} width="580px" height="425px">
          <VirtualGardenApp onGardenBloom={onGardenBloom} />
        </DesktopWindow>
      )}

      {/* our_song.mp3 */}
      {openWindows.song && !minimizedWindows.song && (
        <DesktopWindow id="song" title="our_song.mp3" icon={Volume2} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={140} initialY={520} width="360px" height="150px">
          <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div 
                className={isPlayingSong ? "heart-beat" : ""}
                style={{ 
                  width: '45px', height: '45px', background: '#fbcfe8', border: '2px solid #000',
                  display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', color: 'var(--pixel-red)', boxShadow: '2px 2px 0px rgba(0,0,0,0.1)'
                }}
              >
                <Heart size={20} fill={isPlayingSong ? 'var(--pixel-red)' : 'none'} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#111' }}>You are my favorite song 💕</h4>
                <p style={{ fontSize: '10.5px', color: '#888', textTransform: 'uppercase', fontFamily: 'var(--font-pixel)', fontSize: '8px', marginTop: '4px' }}>
                  Kannaana Kanne.mp3
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>1:24</span>
              <div style={{ flexGrow: 1, height: '6px', background: '#ccc', border: '1px solid #999', position: 'relative' }}>
                <div style={{ width: '35%', height: '100%', background: 'var(--pixel-red)' }}></div>
                <div style={{ width: '8px', height: '12px', background: '#fff', border: '1px solid #000', position: 'absolute', top: '-4px', left: '35%' }}></div>
              </div>
              <span style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>4:10</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button className="retro-button" onClick={() => sound.playClick()} style={{ padding: '4px 8px' }}><SkipBack size={12} /></button>
              <button className="retro-button primary" onClick={handlePlayPause} style={{ padding: '4px 12px' }}>
                {isPlayingSong ? <Pause size={12} fill="#fff" /> : <Play size={12} fill="#fff" />}
              </button>
              <button className="retro-button" onClick={() => sound.playClick()} style={{ padding: '4px 8px' }}><SkipForward size={12} /></button>
            </div>
          </div>
        </DesktopWindow>
      )}

      {/* memory_box.exe */}
      {openWindows.wrapped && !minimizedWindows.wrapped && (
        <DesktopWindow id="wrapped" title="memory_box.exe" icon={FolderHeart} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={180} initialY={100} width="430px" height="390px">
          <MemoryBoxApp />
        </DesktopWindow>
      )}

      {/* surprises.exe */}
      {openWindows.capsule && !minimizedWindows.capsule && (
        <DesktopWindow id="capsule" title="surprises.exe" icon={Gift} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={220} initialY={120} width="440px" height="380px">
          <SurprisesApp />
        </DesktopWindow>
      )}

      {/* love_coupons.exe */}
      {openWindows.coupons && !minimizedWindows.coupons && (
        <DesktopWindow id="coupons" title="love_coupons.exe" icon={Gift} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={200} initialY={150} width="450px" height="390px">
          <LoveCouponsApp status={couponStatus} setStatus={setCouponStatus} />
        </DesktopWindow>
      )}

      {/* heart_catcher.exe */}
      {openWindows.game && !minimizedWindows.game && (
        <DesktopWindow id="game" title="heart_catcher.exe" icon={Gamepad2} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={380} initialY={80} width="400px" height="430px">
          <HeartCatcherGame />
        </DesktopWindow>
      )}

      {/* Recycle Bin */}
      {openWindows.recycle && !minimizedWindows.recycle && (
        <DesktopWindow id="recycle" title="Recycle Bin" icon={Trash2} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={200} initialY={200} width="400px" height="320px">
          <RecycleBinApp onTriggerBSOD={onTriggerBSOD} />
        </DesktopWindow>
      )}

      {/* Timeline Window [NEW] */}
      {openWindows.timeline && !minimizedWindows.timeline && (
        <DesktopWindow id="timeline" title="love_timeline.exe" icon={Clock} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={240} initialY={90} width="420px" height="380px">
          <TimelineApp />
        </DesktopWindow>
      )}

      {/* Future Dreams Map Window [NEW] */}
      {openWindows.dreams && !minimizedWindows.dreams && (
        <DesktopWindow id="dreams" title="future_dreams.exe" icon={Sparkles} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={280} initialY={110} width="440px" height="360px">
          <FutureDreamsApp />
        </DesktopWindow>
      )}

      {/* Reasons I Love You Window [NEW] */}
      {openWindows.reasons && !minimizedWindows.reasons && (
        <DesktopWindow id="reasons" title="reasons_i_love_you.exe" icon={Heart} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={300} initialY={130} width="450px" height="370px">
          <ReasonsApp />
        </DesktopWindow>
      )}

      {/* Forever Folder Password Lock Window [NEW] */}
      {openWindows.forever && !minimizedWindows.forever && (
        <DesktopWindow id="forever" title="Forever Lockbox" icon={Folder} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={220} initialY={180} width="380px" height="280px">
          <ForeverFolderApp onTriggerBSOD={onTriggerBSOD} />
        </DesktopWindow>
      )}

      {/* Love Counter Window [NEW] */}
      {openWindows.counter && !minimizedWindows.counter && (
        <DesktopWindow id="counter" title="love_counter.exe" icon={Heart} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={200} initialY={160} width="400px" height="340px">
          <RelationshipCounterApp />
        </DesktopWindow>
      )}

      {/* Poster Window [NEW] */}
      {openWindows.poster && !minimizedWindows.poster && (
        <DesktopWindow id="poster" title="sadhu_poster.jpg" icon={Sparkles} onClose={closeWindow} onMinimize={minimizeWindow} activeWindow={activeWindow} setActiveWindow={setActiveWindow} initialX={160} initialY={80} width="580px" height="520px">
          <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '10px', alignItems: 'center', backgroundColor: '#fff' }}>
            <img 
              src={posterImg} 
              alt="Birthday Poster" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                border: '3px double #000', 
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)' 
              }} 
            />
          </div>
        </DesktopWindow>
      )}

      {/* Bottom Live Status Bar */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '130px',
          right: '15px',
          height: '24px',
          backgroundColor: '#ffffff',
          borderTop: '2px solid #fff',
          borderLeft: '2px solid #fff',
          borderRight: '2px solid var(--shadow-darker)',
          borderBottom: '2px solid var(--shadow-darker)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          fontFamily: 'var(--font-pixel)',
          fontSize: '7px',
          color: 'var(--window-text)',
          zIndex: 40,
          boxShadow: 'inset -1px -1px 0px var(--shadow-darker), inset 1px 1px 0px #fff',
          padding: '0 8px'
        }}
      >
        <span>Relationship Status: <strong style={{ color: '#16a34a' }}>❤️ Online</strong></span>
        <span>Current Mission: <strong style={{ color: 'var(--pixel-red)' }}>Making Her Smile</strong></span>
        <span>Years Together: <strong>4</strong></span>
        <span>Current Crush Level: <strong style={{ color: 'var(--pixel-red)' }}>∞</strong></span>
        <span>Next Goal: <strong>Growing Old Together</strong></span>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 1. LOVE LETTER APP
// ----------------------------------------------------
function LoveLetterApp({ onReadLetter }) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const letterText = `**Happy 20th Birthday, My Love ❤️**\n\nMy Dearest,\n\nHappy 20th Birthday to the most beautiful soul I've ever known.\n\nSometimes I wonder how I got so lucky. Even after all these years, I still get butterflies every time I see you. People say crushes fade with time, but somehow... mine only grew stronger. You're not just my girlfriend anymore—you'll forever be my favorite person, my safest place, and still the girl I have a crush on every single day.\n\nWatching you step into your twenties fills me with so much pride. I pray this new chapter brings you endless happiness, success, peace, and every dream you've ever wished for.\n\nNo matter what life throws at us, I promise one thing—I will always have your back. During your happiest moments, your hardest days, your biggest victories, and your lowest points... you will never have to face them alone.\n\nThank you for choosing me. Thank you for loving me.\n\nHappy Birthday, my angel.\n\nI love you today.\nI loved you yesterday.\nAnd I'll continue loving you tomorrow.\n\nForever yours,\n\nDharani ❤️`;

  useEffect(() => {
    let index = 0;
    setDisplayText('');
    setIsDone(false);
    
    const timer = setInterval(() => {
      if (index < letterText.length) {
        setDisplayText(letterText.substring(0, index + 4));
        index += 4;
      } else {
        setDisplayText(letterText);
        setIsDone(true);
        clearInterval(timer);
      }
    }, 15);

    return () => clearInterval(timer);
  }, []);

  const handleSkip = () => {
    sound.playClick();
    setDisplayText(letterText);
    setIsDone(true);
  };

  const renderFormattedText = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split('**');
      return (
        <span key={lineIdx} style={{ display: 'block', minHeight: '1.2em', marginBottom: '10px' }}>
          {parts.map((part, partIdx) => {
            if (partIdx % 2 !== 0) {
              return <strong key={partIdx} style={{ fontWeight: '700', color: 'var(--pixel-red)' }}>{part}</strong>;
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <div 
      className="retro-panel" 
      style={{ 
        height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column',
        fontFamily: 'var(--font-sans)', backgroundImage: 'linear-gradient(rgba(255, 230, 235, 0.4) 1px, transparent 1px)',
        backgroundSize: '100% 28px', lineHeight: '28px', padding: '22px', border: '2px solid var(--shadow-dark)',
        position: 'relative', backgroundColor: '#fffbfb'
      }}
    >
      <div 
        style={{ 
          color: 'var(--pixel-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '10px', borderBottom: '2px dashed var(--pixel-pink)'
        }}
      >
        <div style={{ display: 'flex', gap: '6px', paddingBottom: '4px' }}>
          <Heart size={16} className="heart-beat" fill="var(--pixel-red)" color="none" />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', marginTop: '2px' }}>MY DEAR...</span>
          <Heart size={16} className="heart-beat" fill="var(--pixel-red)" color="none" style={{ animationDelay: '0.3s' }} />
        </div>
        {!isDone && (
          <button 
            className="retro-button" onClick={handleSkip}
            style={{ fontSize: '7.5px', padding: '2px 5px', fontFamily: 'var(--font-pixel)' }}
          >
            Skip &gt;&gt;
          </button>
        )}
      </div>
      
      <div 
        className={!isDone ? "typing-cursor" : ""}
        style={{ 
          textAlign: 'left', width: '100%', fontSize: '17px', fontWeight: 600,
          color: '#1a1a1a', lineHeight: '1.75', marginBottom: isDone ? '15px' : '0px'
        }}
      >
        {renderFormattedText(displayText)}
      </div>

      {isDone && (
        <button 
          className="retro-button primary heart-beat" 
          onClick={onReadLetter}
          style={{ 
            alignSelf: 'center', 
            marginTop: '15px', 
            padding: '8px 25px', 
            fontSize: '12px',
            backgroundColor: 'var(--pixel-red)',
            color: 'white',
            fontWeight: 'bold',
            border: '2px solid #000',
            boxShadow: '2px 2px 0px #000',
            cursor: 'pointer'
          }}
        >
          ❤️ I Read It!
        </button>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 2. MEMORY BOX APP (Polaroid Flipping Wall)
// ----------------------------------------------------
function MemoryBoxApp() {
  const [flippedCards, setFlippedCards] = useState({});

  const memories = [
    {
      id: 'first',
      title: "Our First Talk",
      backText: "Where our story started. Sparks flew instantly! ❤️ Location: Direct Messages",
      renderFront: () => (
        <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', backgroundColor: '#fff5f7' }}>
          <circle cx="35" cy="40" r="15" fill="#ffd0d9" />
          <circle cx="65" cy="40" r="15" fill="#d0e8ff" />
          <g transform="translate(45, 20) scale(0.6)" className="heart-beat">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d"/>
          </g>
        </svg>
      )
    },
    {
      id: 'calls',
      title: "Late Night Calls",
      backText: "Hours spent laughing about everything and nothing. 📞 Location: Midnight Chats",
      renderFront: () => (
        <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}>
          <circle cx="75" cy="20" r="7" fill="#fef08a" />
          <circle cx="72" cy="18" r="6" fill="#0f172a" />
          <rect x="15" y="30" width="40" height="15" rx="3" fill="#38bdf8" />
          <rect x="45" y="50" width="40" height="15" rx="3" fill="#f43f5e" />
        </svg>
      )
    },
    {
      id: 'cozy',
      title: "Cozy Sundays",
      backText: "Warm coffee, cozy blankets, and the happiest moments. ☕ Location: Cozy Room",
      renderFront: () => (
        <svg viewBox="0 0 100 80" style={{ width: '100%', height: '100%', backgroundColor: '#fafaf9' }}>
          <rect x="15" y="35" width="70" height="25" fill="#f3f4f6" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="42" y="45" width="16" height="12" rx="1" fill="#f43f5e" />
        </svg>
      )
    }
  ];

  const toggleFlip = (id) => {
    sound.playClick();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '10px' }}>
      <p style={{ fontSize: '9.5px', color: '#666', fontFamily: 'var(--font-pixel)', textAlign: 'center', marginBottom: '8px' }}>
        Click a polaroid to flip and read!
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
        {memories.map(mem => (
          <div 
            key={mem.id}
            className={`polaroid-card ${flippedCards[mem.id] ? 'flipped' : ''}`}
            onClick={() => toggleFlip(mem.id)}
          >
            <div className="polaroid-inner">
              <div className="polaroid-front">
                <div className="polaroid-img-box">
                  {mem.renderFront()}
                </div>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                  {mem.title}
                </span>
              </div>

              <div className="polaroid-back">
                <p style={{ fontSize: '9.5px', color: '#be185d', fontWeight: 'bold', lineHeight: '1.3' }}>
                  {mem.backText}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. SURPRISES APP (20 Sequential Gifts)
// ----------------------------------------------------
function SurprisesApp() {
  const [openedGifts, setOpenedGifts] = useState([]);
  const [modalSurprise, setModalSurprise] = useState(null);

  const surprises = [
    { id: 1, type: "Story", title: "our_story.exe", content: "Ours was written in school corridors, stolen glances, late-night calls, shared laughs, little fights, endless memories, and unconditional love.\n\nIt all started with a simple crush.\n\nThat crush slowly became friendship.\n\nFriendship became love.\n\nLove became home.\n\nAnd today...\n\nYou're still the first person I want to tell everything to.\n\nYou're still the first notification I wait for.\n\nYou're still the most beautiful part of every day. ❤️" },
    { id: 2, type: "Date", title: "anniversary.exe", content: "10 • 12 • 2022 ❤️\n\nThis wasn't just another date.\n\nIt became the day our forever officially began.\n\nNow...\n\nAlmost four beautiful years of togetherness.\n\nThousands of conversations.\n\nCountless smiles.\n\nA million memories.\n\nAnd one promise—\n\nNo matter how much time passes...\n\nI'll still choose you.\n\nAgain.\n\nAnd again.\n\nAnd again." },
    { id: 3, type: "Sight", title: "first_sight.exe", content: "16 • 07 • 2021\n\nThe Day Everything Changed\n\nI still remember it.\n\nLike it happened yesterday.\n\nThe moment my eyes met yours...\n\nTime slowed down.\n\nThe world became quiet.\n\nAnd there you were...\n\nStanding there in your beautiful blue dress.\n\nYou looked so effortlessly beautiful that I completely forgot everything around me.\n\nI didn't know then...\n\nThat the girl standing in front of me would someday become my entire world.\n\nThat moment will always remain my favorite memory. 💙" },
    { id: 4, type: "Calls", title: "late_night_calls.txt", content: "The Calls I'll Never Forget\n\nThose late-night conversations...\n\nTalking until one of us accidentally fell asleep.\n\nRandom laughs.\n\nSerious talks.\n\nDreams.\n\nFuture plans.\n\nComfortable silence.\n\nSometimes we talked about everything.\n\nSometimes about nothing.\n\nYet somehow...\n\nThose were the moments that made me fall in love with you even more. 📞" },
    { id: 5, type: "IceCream", title: "first_icecream.exe", content: "Our First Ice Cream\n\nPeople may forget expensive gifts.\n\nBut they never forget simple moments shared with the right person.\n\nThat first ice cream wasn't just dessert.\n\nIt became a memory.\n\nEvery bite came with laughter.\n\nEvery smile became unforgettable.\n\nSometimes happiness really is that simple. 🍦" },
    { id: 6, type: "Shopping", title: "shopping_day.exe", content: "Shopping With You\n\nYou know...\n\nShopping was never about buying things.\n\nIt was about watching you smile.\n\nWatching you get excited over little things.\n\nWatching you ask,\n\n\"How does this look?\"\n\nAnd secretly thinking...\n\n\"You'd look beautiful in anything.\" 🛍️" },
    { id: 7, type: "Crush", title: "still_crushing.txt", content: "My Forever Crush\n\nPeople ask,\n\n\"How can you still have a crush on your own girlfriend?\"\n\nThe answer is simple.\n\nBecause every single day...\n\nYou give me another reason to fall for you.\n\nEvery smile.\n\nEvery laugh.\n\nEvery tiny habit.\n\nEvery silly moment.\n\nI still look at you the same way I did years ago.\n\nMaybe even more.\n\nYou're still my biggest crush. 💖" },
    { id: 8, type: "Promise", title: "promise.txt", content: "One Promise\n\nLife won't always be perfect.\n\nThere will be difficult days.\n\nUnexpected problems.\n\nMoments where everything feels heavy.\n\nBut I want you to remember one thing.\n\nYou'll never walk through them alone.\n\nI will always stand beside you.\n\nNot because I have to.\n\nBecause I want to.\n\nBecause loving you means choosing you...\n\nEvery single day. 🤝" },
    { id: 9, type: "Future", title: "future.exe", content: "Our Future\n\nMore walks.\n\nMore ice creams.\n\nMore birthdays.\n\nMore road trips.\n\nMore photos.\n\nMore hugs.\n\nMore dreams.\n\nMore achievements.\n\nMore laughter.\n\nMore \"I love you.\"\n\nAnd hopefully...\n\nMany more years together. 🌎" },
    { id: 10, type: "BirthdayMsg", title: "birthday_message.txt", content: "Welcome to Your Twenties ❤️\n\nHappy 20th Birthday, my love.\n\nMay this decade become the most beautiful chapter of your life.\n\nMay you smile more.\n\nCry less.\n\nDream bigger.\n\nTravel farther.\n\nLaugh louder.\n\nLove deeper.\n\nAnd may every dream you've ever whispered to yourself become reality.\n\nI'll always be cheering for you.\n\nAlways believing in you.\n\nAlways loving you.\n\nHappy Birthday, My Angel. 🎂" },
    { id: 11, type: "Us", title: "The Day We Became Us ❤️", content: "The Day We Became Us\n\nThis wasn't just another date on the calendar. This was the day our love story officially began. 10.12.2022 ❤️" },
    { id: 12, type: "Years", title: "Four Beautiful Years ⏳", content: "Four Beautiful Years\n\nAlmost four years of memories, laughter, little fights, endless love, growth, and choosing each other every single day." },
    { id: 13, type: "Miss You", title: "Every 'I Miss You' 🥺", content: "Every 'I Miss You'\n\nDistance was never measured in kilometers. It was measured by how much I missed hearing your voice and seeing your smile." },
    { id: 14, type: "Fights", title: "Every Little Fight ❤️", content: "Every Little Fight\n\nWe argued. We got upset. But somehow, every misunderstanding only taught us how to love each other better." },
    { id: 15, type: "Laugh", title: "Every Laugh 😂", content: "Every Laugh\n\nYour laughter became my favorite sound. If I could keep one sound forever, it would be you laughing." },
    { id: 16, type: "Thanks", title: "Thank You 🌸", content: "Thank You\n\nThank you for believing in me when I couldn't believe in myself. Thank you for loving every version of me." },
    { id: 17, type: "Crush", title: "You're Still My Crush 💖", content: "You're Still My Crush\n\nPeople say you stop having a crush after you start dating. I never did. Every single day, I still look at you like the first time I saw you." },
    { id: 18, type: "Promise", title: "My Promise 🤝", content: "My Promise\n\nNo matter where life takes us, no matter how difficult things become, I've always got your back. Your victories will be my celebrations, and your struggles will never be yours alone." },
    { id: 19, type: "Future", title: "Our Future 🌍", content: "Our Future\n\nMore birthdays. More random walks. More late-night calls. More adventures. More dreams. More memories. And hopefully... a lifetime together." },
    { id: 20, type: "Forever", title: "Forever ❤️", content: "Forever\n\nAmong billions of people in this world, my heart chose you. If I had another life, I'd search for you again. I'd fall in love with you again. And I'd still choose you, every single time.\n\nHappy 20th Birthday, my angel. Thank you for making my life beautiful. I love you more than words will ever be able to express." }
  ];

  const handleOpenGift = (gift) => {
    sound.playClick();
    if (!openedGifts.includes(gift.id)) {
      setOpenedGifts([...openedGifts, gift.id]);
    }
    setModalSurprise(gift);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '8px', position: 'relative' }}>
      <p style={{ fontSize: '8px', fontFamily: 'var(--font-pixel)', color: '#888', borderBottom: '1px dashed #ffccd5', paddingBottom: '4px', marginBottom: '8px', textAlign: 'center' }}>
        OPENS IN ORDER: {openedGifts.length} / 20 GIFTS CLAIMED
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', overflowY: 'auto', flexGrow: 1, justifyItems: 'center', alignItems: 'center' }}>
        {surprises.map(gift => {
          const isOpened = openedGifts.includes(gift.id);
          const isPlayable = gift.id === 1 || openedGifts.includes(gift.id - 1);
          
          return (
            <div
              key={gift.id}
              onClick={() => isPlayable && handleOpenGift(gift)}
              style={{
                width: '46px', height: '46px', border: '2px solid #000',
                background: isOpened ? '#f3f4f6' : isPlayable ? '#ffd3dc' : '#e5e7eb',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: isPlayable ? 'pointer' : 'not-allowed', boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                opacity: isPlayable ? 1 : 0.4
              }}
              className={isPlayable && !isOpened ? "heart-beat" : ""}
            >
              <Gift size={16} color={isOpened ? '#888' : 'var(--pixel-red)'} />
              <span style={{ fontSize: '8px', fontFamily: 'var(--font-pixel)', marginTop: '2px' }}>{gift.id}</span>
            </div>
          );
        })}
      </div>

      {modalSurprise && (
        <div 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)', zIndex: 100,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '15px',
            border: '2px solid var(--pixel-blue)'
          }}
        >
          <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: 'var(--pixel-blue)' }}>
              📄 surprises.exe / {modalSurprise.title}
            </span>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '15px 0', overflowY: 'auto' }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#be185d', lineHeight: '1.4', whiteSpace: 'pre-wrap', maxWidth: '380px' }}>
              {modalSurprise.content}
            </p>
          </div>

          <button 
            className="retro-button primary" 
            onClick={() => { sound.playClick(); setModalSurprise(null); }}
            style={{ alignSelf: 'center', padding: '4px 15px', fontSize: '10px' }}
          >
            Close Gift
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. VIRTUAL GARDEN APP (Upgraded SVG, sill, sunset bg)
// ----------------------------------------------------
function VirtualGardenApp({ onGardenBloom }) {
  const [garden, setGarden] = useState([
    { id: 0, type: 'Sprout', renderIcon: () => <SproutSVG />, state: 'empty', water: 0, text: 'You make me smile.' },
    { id: 1, type: 'Rose', renderIcon: () => <RoseSVG />, state: 'empty', water: 0, text: 'You are my peace.' },
    { id: 2, type: 'Sunflower', renderIcon: () => <SunflowerSVG />, state: 'empty', water: 0, text: 'You understand me.' },
    { id: 3, type: 'Lavender', renderIcon: () => <LavenderSVG />, state: 'empty', water: 0, text: 'You inspire me.' },
    { id: 4, type: 'Lily', renderIcon: () => <LilySVG />, state: 'empty', water: 0, text: "You're my favorite person." }
  ]);
  const [waterCount, setWaterCount] = useState(15);

  const waterPlant = (id) => {
    const targetSlot = garden.find(slot => slot.id === id);
    if (targetSlot && targetSlot.state === 'bloom') return; // Do not waste water if already bloomed!

    if (waterCount <= 0) return;
    sound.playWater();
    setWaterCount(prev => prev - 1);
    setGarden(prev => prev.map(slot => {
      if (slot.id === id) {
        const nextWater = slot.water + 1;
        let nextState = slot.state;
        if (nextWater === 1) nextState = 'sprout';
        if (nextWater === 2) nextState = 'bud';
        if (nextWater >= 3) nextState = 'bloom';
        return { ...slot, water: nextWater, state: nextState };
      }
      return slot;
    }));
  };

  const getPercentage = () => {
    const totalWaterings = garden.reduce((sum, item) => sum + Math.min(item.water, 3), 0);
    return Math.floor((totalWaterings / 15) * 100);
  };

  const allBloomed = garden.every(slot => slot.state === 'bloom');

  useEffect(() => {
    if (allBloomed && onGardenBloom) {
      onGardenBloom();
    }
  }, [allBloomed]);

  const getPotColor = (id) => {
    const colors = ['#f43f5e', '#fb923c', '#d97706', '#8b5cf6', '#a855f7'];
    return colors[id % colors.length];
  };

  return (
    <div style={{ display: 'flex', gap: '10px', height: '100%', position: 'relative' }}>
      <div 
        className="retro-panel" 
        style={{ 
          flexGrow: 1, display: 'flex', flexDirection: 'column', 
          justifyContent: 'space-between', padding: '10px', 
          background: 'linear-gradient(180deg, #ffccd5 0%, #ffedd5 100%)', // sunset gradient
          position: 'relative'
        }}
      >
        {/* Hanging Ivy SVGs */}
        <div style={{ position: 'absolute', top: 0, left: 0, color: '#16a34a', opacity: 0.85 }}>
          <svg viewBox="0 0 100 50" width="80" height="40" fill="currentColor">
            <path d="M0,0 Q20,10 40,0 T80,5 C80,5 60,25 40,10 C20,25 0,0 0,0 Z" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 0, right: 0, color: '#16a34a', opacity: 0.85, transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 100 50" width="80" height="40" fill="currentColor">
            <path d="M0,0 Q20,10 40,0 T80,5 C80,5 60,25 40,10 C20,25 0,0 0,0 Z" />
          </svg>
        </div>

        <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', textAlign: 'center', color: '#2f5687', marginBottom: '10px', textShadow: '1px 1px 0px #fff' }}>
          💧 WATER THEM TO BLOOM 💧
        </h3>

        {/* Pots on Wooden Shelf */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexGrow: 1, gap: '4px', marginBottom: '5px', position: 'relative', height: '130px' }}>
          {garden.map(slot => {
            const isBloomed = slot.state === 'bloom';
            
            return (
              <div key={slot.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '78px', position: 'relative' }}>
                {isBloomed && (
                  <div className="speech-bubble" style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '75px', height: '48px', overflowY: 'auto' }}>
                    {slot.text}
                  </div>
                )}

                <div style={{ height: '70px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '2px' }}>
                  {slot.state === 'sprout' && (
                    <div className="pixel-float" style={{ fontSize: '20px' }}>🌱</div>
                  )}
                  {slot.state === 'bud' && (
                    <div className="pixel-float" style={{ fontSize: '22px' }}>🌿</div>
                  )}
                  {slot.state === 'bloom' && slot.renderIcon()}
                </div>

                <div 
                  onClick={() => waterPlant(slot.id)}
                  style={{
                    width: '38px', height: '26px', background: getPotColor(slot.id), border: '2px solid #000',
                    borderTop: '0', borderRadius: '0 0 5px 5px', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                    boxShadow: '1px 2px 0 rgba(0,0,0,0.15)', zIndex: 5
                  }}
                >
                  <span style={{ fontSize: '7px', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 0px #000' }}>{slot.type}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wooden Window Sill */}
        <div style={{ height: '10px', background: '#78350f', borderTop: '2px solid #000', borderBottom: '1px solid #451a03', width: '100%', marginBottom: '10px' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2.5px solid #000', paddingTop: '10px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '26px' }}>🛢️</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#333' }}>Water Can</span>
              {waterCount === 0 && !allBloomed ? (
                <button 
                  className="retro-button"
                  onClick={() => { sound.playSuccess(); setWaterCount(15); }}
                  style={{ fontSize: '7px', padding: '2px 4px', fontFamily: 'var(--font-pixel)', marginTop: '2px', cursor: 'pointer' }}
                >
                  Refill 💧
                </button>
              ) : (
                <span style={{ color: '#555', fontFamily: 'var(--font-pixel)', fontSize: '7px' }}>💧 x {waterCount}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '220px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5px', fontWeight: 'bold', color: 'var(--pixel-red)' }}>
              <span>Our Happiness</span>
              <span>{getPercentage()}%</span>
            </div>
            <div style={{ height: '14px', background: '#e2e8f0', border: '1px solid #94a3b8', borderRadius: '8px', overflow: 'hidden', padding: '1px' }}>
              <div style={{ height: '100%', width: `${getPercentage()}%`, background: 'linear-gradient(90deg, #ec4899, #f43f5e)', borderRadius: '6px', transition: 'width 0.4s ease' }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="retro-window" style={{ width: '150px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div className="retro-titlebar" style={{ padding: '3px 6px', fontSize: '8px' }}>
          <span>Garden Status</span>
        </div>
        <div className="retro-window-body" style={{ padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#fcfcfc' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {garden.map(slot => {
              const isChecked = slot.state === 'bloom';
              return (
                <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                  <div style={{ width: '12px', height: '12px', border: '1px solid #000', background: isChecked ? '#ffccd5' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                    {isChecked && '✓'}
                  </div>
                  <span>{slot.type}</span>
                </div>
              );
            })}
          </div>

          {allBloomed ? (
            <div style={{ background: '#ffd3dc', border: '1px dashed var(--pixel-red)', borderRadius: '4px', padding: '6px', fontSize: '8.5px', color: 'var(--pixel-red)', textAlign: 'center', lineHeight: '1.3', fontWeight: 'bold' }}>
              Our Love Bloomed ❤️<br />
              Just like our love grows everyday 💕
            </div>
          ) : (
            <div style={{ fontSize: '8px', color: '#888', textAlign: 'center', fontStyle: 'italic' }}>
              Water all plants to bloom 100%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. SURPRISE COUPONS APP
// ----------------------------------------------------
function LoveCouponsApp({ status, setStatus }) {
  const claimCoupon = (couponKey) => {
    sound.playSuccess();
    setStatus(prev => ({ ...prev, [couponKey]: true }));
  };

  const coupons = [
    { key: "hug", title: "FREE HUGS PASS", desc: "Good for 1x premium, extra-warm hug. Validity: Forever.", color: "#ffdce3", textColor: "#ff4d6d" },
    { key: "date", title: "COFFEE DATE PASS", desc: "Good for one afternoon coffee date + dessert on me.", color: "#e0f2fe", textColor: "#0284c7" },
    { key: "movie", title: "MOVIE CHOICE TICKET", desc: "You choose the movie, I pay for snacks. No complaints!", color: "#fef9c3", textColor: "#ca8a04" },
    { key: "call", title: "LONG MIDNIGHT CALL", desc: "No time limit, we talk until the sunrise.", color: "#fae8ff", textColor: "#a21caf" },
    { key: "wish", title: "ONE ROMANTIC WISH", desc: "Redeem for any romantic wish. Unlimited possibilities.", color: "#dcfce7", textColor: "#15803d" },
    { key: "cuddles", title: "UNLIMITED CUDDLES", desc: "Validity: Forever. Claim whenever you need a cuddle.", color: "#fee2e2", textColor: "#b91c1c" }
  ];

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', gap: '10px' }}>
      <p style={{ fontSize: '9px', textAlign: 'center', color: '#666', fontFamily: 'var(--font-pixel)', marginBottom: '4px' }}>
        CLAIM YOUR ROMANTIC COUPONS
      </p>

      {coupons.map(coupon => {
        const isClaimed = status[coupon.key];

        return (
          <div
            key={coupon.key}
            style={{
              backgroundColor: coupon.color, border: '2px dashed #000', borderRadius: '6px',
              padding: '8px 12px', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', boxShadow: '2px 2px 0px rgba(0,0,0,0.05)', position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isClaimed && (
              <div 
                style={{
                  position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.75)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', zIndex: 2, fontFamily: 'var(--font-pixel)', fontSize: '11px',
                  color: 'var(--pixel-red)', fontWeight: 'bold', transform: 'rotate(-3deg)'
                }}
              >
                💝 CLAIMED & REDEEMED!
              </div>
            )}

            <div style={{ maxWidth: '70%' }}>
              <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '8.5px', color: coupon.textColor, marginBottom: '2px' }}>
                {coupon.title}
              </h4>
              <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.25' }}>
                {coupon.desc}
              </p>
            </div>

            <button
              className="retro-button primary"
              onClick={() => claimCoupon(coupon.key)}
              disabled={isClaimed}
              style={{ fontSize: '9px', padding: '4px 8px', zIndex: 1, opacity: isClaimed ? 0.3 : 1 }}
            >
              Redeem
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ----------------------------------------------------
// 6. RELATIONSHIP TIMELINE APP
// ----------------------------------------------------
function TimelineApp() {
  const milestones = [
    { date: "16 July 2021", title: "First Sight (The Day Everything Changed)", desc: "Dharani saw you standing there in your beautiful blue dress. Efforlessly beautiful! 💙" },
    { date: "15 May 2022", title: "First Conversation", desc: "A simple text message that sparked a beautiful, endless conversation. Sparks flew instantly! ❤️" },
    { date: "02 July 2022", title: "First Phone Call", desc: "Losing track of time talking for 4 hours until the sunrise. 📞" },
    { date: "10 December 2022", title: "Our Anniversary Began", desc: "The day our forever officially started. 4 beautiful years of togetherness! 💍" },
    { date: "Today 🎂", title: "Your 20th Birthday", desc: "Celebrating the amazing, beautiful girl you are today. Happy Birthday! 🎉" }
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (idx) => {
    sound.playClick();
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '12px', overflowY: 'auto' }}>
      <p style={{ fontSize: '9.5px', fontFamily: 'var(--font-pixel)', color: '#888', borderBottom: '1px dashed var(--pixel-pink)', paddingBottom: '4px', marginBottom: '15px', textAlign: 'center' }}>
        📅 LOVE TIMELINE - CLICK NODE TO EXPAND
      </p>

      <div className="timeline-container">
        <div className="timeline-line"></div>
        {milestones.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div key={idx} className="timeline-item" onClick={() => toggleExpand(idx)}>
              <div className="timeline-node"></div>
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#111' }}>{item.title}</div>
                {isExpanded && (
                  <p style={{ marginTop: '5px', fontSize: '12px', color: '#555', lineHeight: '1.4', borderTop: '1px dashed #eee', paddingTop: '4px' }}>
                    {item.desc}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 7. FUTURE DREAMS APP
// ----------------------------------------------------
function FutureDreamsApp() {
  const pins = [
    { name: "Paris 🗼", top: "35%", left: "43%", desc: "🇫🇷 Paris: Walking down the Seine river and drinking warm coffee under the Eiffel Tower. Someday we'll go here together." },
    { name: "Japan 🌸", top: "45%", left: "82%", desc: "🇯🇵 Japan: Visiting Kyoto's cherry blossoms and exploring Tokyo's arcade lights. Someday we'll go here together." },
    { name: "Goa 🏖️", top: "62%", left: "68%", desc: "🇮🇳 Goa: Watching the sunset over the quiet beach waves together. Someday we'll go here together." },
    { name: "Our Home 🏡", top: "54%", left: "55%", desc: "🏡 Our Home: Building our own cozy space filled with books, coffee, and endless laughter. Someday we'll be here together." }
  ];

  const [selectedPin, setSelectedPin] = useState(null);

  const handlePinClick = (pin) => {
    sound.playClick();
    setSelectedPin(pin);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '10px', position: 'relative' }}>
      <p style={{ fontSize: '9px', fontFamily: 'var(--font-pixel)', color: '#888', borderBottom: '1px dashed var(--pixel-pink)', paddingBottom: '4px', marginBottom: '8px', textAlign: 'center' }}>
        ⭐ FUTURE DREAMS MAP - CLICK THE PINS
      </p>

      <div 
        style={{ 
          position: 'relative', width: '100%', height: '180px', background: '#e0f2fe', 
          border: '2px solid #000', overflow: 'hidden' 
        }}
      >
        <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
          <path d="M 20,40 Q 60,30 80,60 T 150,50 T 200,80 T 180,120 Z" fill="#cbd5e1" stroke="#94a3b8" />
          <path d="M 220,90 Q 260,80 280,110 T 320,100 Z" fill="#cbd5e1" stroke="#94a3b8" />
          <path d="M 290,30 Q 330,40 350,60 T 370,110 Z" fill="#cbd5e1" stroke="#94a3b8" />
        </svg>

        {pins.map((pin, idx) => (
          <div 
            key={idx} 
            className="map-pin"
            onClick={() => handlePinClick(pin)}
            style={{ top: pin.top, left: pin.left }}
          >
            <div className="map-pin-label">{pin.name}</div>
          </div>
        ))}
      </div>

      <div 
        style={{ 
          flexGrow: 1, marginTop: '10px', padding: '8px', background: '#fff', 
          border: '1px inset #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}
      >
        <p style={{ fontSize: '12.5px', color: '#1e3a8a', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.4' }}>
          {selectedPin ? selectedPin.desc : "Click any glowing pin on the map to see our future plans... ⭐"}
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 8. REASONS I LOVE YOU APP
// ----------------------------------------------------
function ReasonsApp() {
  const reasonsList = [
    "Your laugh makes my entire day.",
    "The way you care for people.",
    "Your beautiful, kind eyes.",
    "You understand my silence.",
    "Your passion for your dreams.",
    "The warmth of your hugs.",
    "You make me want to grow.",
    "Your silly morning texts.",
    "How you hold my hand.",
    "You are my absolute peace.",
    "You believe in me always.",
    "Your incredible strength.",
    "How cute you look smiling.",
    "Your patient heart.",
    "You are my safest home.",
    "The way you support me.",
    "Your gorgeous, kind soul.",
    "How ordinary days feel magical.",
    "You are so rare and genuine.",
    "You choose me every single day."
  ];

  const [flippedCards, setFlippedCards] = useState([]);

  const handleCardClick = (idx) => {
    sound.playClick();
    if (flippedCards.includes(idx)) {
      setFlippedCards(prev => prev.filter(c => c !== idx));
    } else {
      setFlippedCards(prev => [...prev, idx]);
    }
  };

  const handleShuffle = () => {
    sound.playClick();
    setFlippedCards([]);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '8px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--pixel-pink)', paddingBottom: '4px', marginBottom: '8px' }}>
        <span style={{ fontSize: '9px', fontFamily: 'var(--font-pixel)', color: '#888' }}>
          💖 20 REASONS I LOVE YOU
        </span>
        <button className="retro-button" onClick={handleShuffle} style={{ fontSize: '7.5px', padding: '2px 6px' }}>
          Reset Cards
        </button>
      </div>

      <div className="reasons-grid">
        {reasonsList.map((reason, idx) => {
          const isFlipped = flippedCards.includes(idx);
          return (
            <div 
              key={idx} 
              className={`reason-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <div className="reason-inner">
                <div className="reason-front">
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>❤️ #{idx + 1}</span>
                </div>
                <div className="reason-back">
                  <span>{reason}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 9. FOREVER FOLDER PASSWORD LOCK APP
// ----------------------------------------------------
function ForeverFolderApp({ onTriggerBSOD }) {
  const [pass, setPass] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const checkPassword = (e) => {
    e.preventDefault();
    const cleanPass = pass.trim().toLowerCase();
    const valid = ["rowdy", "chinnu", "baby", "babe", "cutie", "rowdy baby", "dharani", "love", "darl"];
    
    if (valid.includes(cleanPass)) {
      sound.playSuccess();
      setUnlocked(true);
      setErrorMsg('');
    } else {
      sound.playHit();
      setErrorMsg("Incorrect nickname! Think of your favorite nickname... 🥺");
    }
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '10px', justifyContent: 'center' }}>
      {!unlocked ? (
        <form onSubmit={checkPassword} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <div style={{ fontSize: '28px' }} className="heart-beat">🔐</div>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>This folder is password-protected</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '4px' }}>
            <input 
              type="password" 
              className="login-input" 
              value={pass}
              onChange={(e) => { setPass(e.target.value); setErrorMsg(''); }}
              placeholder="Enter password..."
              autoFocus
              style={{ textAlign: 'center' }}
            />
            <p style={{ fontSize: '9.5px', color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '3px' }}>
              Hint: "The nickname I call you."
            </p>
          </div>

          {errorMsg && (
            <p style={{ fontSize: '10px', color: 'var(--pixel-red)', fontStyle: 'italic' }}>{errorMsg}</p>
          )}

          <button type="submit" className="retro-button primary" style={{ padding: '4px 15px', fontSize: '11px' }}>
            Unlock
          </button>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center', padding: '10px' }}>
          <div style={{ color: 'var(--pixel-red)', fontSize: '26px' }} className="heart-beat">💍</div>
          <div>
            <h4 style={{ fontWeight: 'bold', color: 'var(--pixel-red)', fontSize: '14px', marginBottom: '8px' }}>
              sadhu's 20's Secret Folder Unlocked!
            </h4>
            <p style={{ fontSize: '12px', color: '#444', lineHeight: '1.4' }}>
              You found my final secret. Inside represents all our future milestones.<br />
              Click the button below to complete sadhu's 20's...
            </p>
          </div>

          <button 
            className="retro-button primary" 
            onClick={onTriggerBSOD}
            style={{ fontSize: '10px', padding: '8px 20px', animation: 'heartBeat 1.5s infinite' }}
          >
            Redeem Final surprise
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 10. RECYCLE BIN APP
// ----------------------------------------------------
function RecycleBinApp({ onTriggerBSOD }) {
  const [isOpenText, setIsOpenText] = useState(false);

  const handleOpenText = () => {
    sound.playClick();
    setIsOpenText(true);
  };

  const handleCloseText = () => {
    sound.playClick();
    setIsOpenText(false);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '10px' }}>
      {!isOpenText ? (
        <div>
          <p style={{ fontSize: '8.5px', color: '#888', fontStyle: 'italic', marginBottom: '15px', fontFamily: 'var(--font-pixel)' }}>
            Deleted elements...
          </p>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7, width: '70px' }}>
              <FileText size={28} />
              <span style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Arguments.tmp</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7, width: '70px' }}>
              <FileText size={28} />
              <span style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Jealousy.exe</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.7, width: '70px' }}>
              <FileText size={28} />
              <span style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>Sad Days.dll</span>
            </div>

            <div 
              onClick={handleOpenText}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', textAlign: 'center', width: '70px' }}
            >
              <div style={{ color: '#808080' }} className="heart-beat">
                <FileText size={28} />
              </div>
              <span style={{ fontSize: '10px', color: '#000', marginTop: '2px', textDecoration: 'underline' }}>
                Forever.txt
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--pixel-red)' }}>Forever.txt</span>
            <button className="retro-button" onClick={handleCloseText} style={{ fontSize: '9px', padding: '2px 8px' }}>
              Close
            </button>
          </div>
          
          <div 
            style={{
              flexGrow: 1, padding: '15px', backgroundColor: '#ffeff1', border: '1px inset #ccc',
              fontSize: '12.5px', color: '#111', overflowY: 'auto', textAlign: 'left',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px'
            }}
          >
            <p style={{ fontWeight: '500', lineHeight: '1.6', color: '#be185d' }}>
              "If somehow we could start life all over again...<br /><br />
              I would still search for you.<br />
              Still smile at you.<br />
              Still fall in love with you.<br />
              Still hold your hand.<br />
              Still choose you.<br /><br />
              Because no matter how many lifetimes exist... my favorite place will always be beside you. Forever and Always. ❤️"
            </p>
            
            <button 
              className="retro-button primary" 
              onClick={onTriggerBSOD}
              style={{ fontSize: '10px', padding: '6px 14px', alignSelf: 'center', animation: 'heartBeat 1.2s infinite' }}
            >
              🎁 Redeem Final Surprise
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// HEART CATCHER GAME APP
// ----------------------------------------------------
function HeartCatcherGame() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartPos, setHeartPos] = useState({ x: 50, y: 0 });
  const [bucketX, setBucketX] = useState(50); // percentage 0-100
  const gameAreaRef = useRef(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft') {
        setBucketX(prev => Math.max(0, prev - 8));
      } else if (e.key === 'ArrowRight') {
        setBucketX(prev => Math.min(90, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setHeartPos(prev => {
        const newY = prev.y + 1.8; // Slow fallback speed as requested
        
        // If heart reaches the bottom
        if (newY >= 85) {
          const heartX = prev.x;
          const bucketLeft = bucketX;
          const bucketRight = bucketX + 15;

          if (heartX >= bucketLeft && heartX <= bucketRight) {
            sound.playSuccess();
            setScore(s => s + 1);
          } else {
            sound.playHit();
          }

          // Spawn new heart at random x
          return { x: Math.floor(Math.random() * 85), y: 0 };
        }

        return { ...prev, y: newY };
      });
    }, 30); // 30ms tick rate

    return () => clearInterval(interval);
  }, [isPlaying, bucketX]);

  const startGame = () => {
    sound.playClick();
    setScore(0);
    setHeartPos({ x: Math.floor(Math.random() * 85), y: 0 });
    setIsPlaying(true);
  };

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '10px', justifyContent: 'space-between', backgroundColor: '#fff5f7' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--pixel-pink)', paddingBottom: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--pixel-red)', fontWeight: 'bold' }}>
          ❤️ SCORE: {score} / 10
        </span>
        <span style={{ fontSize: '8px', color: '#666' }}>Use Left/Right Arrows</span>
      </div>

      {score >= 10 ? (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', gap: '15px' }}>
          <div style={{ fontSize: '40px' }} className="heart-beat">🏆❤️</div>
          <h4 style={{ fontWeight: 'bold', color: 'var(--pixel-red)', fontSize: '15px' }}>You Won My Whole Heart!</h4>
          <p style={{ fontSize: '11px', color: '#555', lineHeight: '1.4', fontStyle: 'italic', background: '#fff', border: '1px dashed #ec4899', padding: '10px', borderRadius: '4px' }}>
            "No matter how many hearts fall, you'll always catch mine. You are my greatest win. I love you, Golduhhhh! ❤️"
          </p>
          <button className="retro-button primary" onClick={startGame} style={{ fontSize: '10px', padding: '6px 15px' }}>
            Play Again
          </button>
        </div>
      ) : isPlaying ? (
        <div 
          ref={gameAreaRef}
          style={{ 
            flexGrow: 1, background: '#fee2e2', border: '2px solid #000', 
            position: 'relative', overflow: 'hidden', height: '220px', borderRadius: '4px' 
          }}
        >
          {/* Falling Heart */}
          <div 
            style={{ 
              position: 'absolute', left: `${heartPos.x}%`, top: `${heartPos.y}%`, 
              fontSize: '24px', transition: 'top 0.03s linear' 
            }}
          >
            ❤️
          </div>

          {/* Catching Bucket */}
          <div 
            style={{ 
              position: 'absolute', bottom: '5px', left: `${bucketX}%`, 
              width: '50px', height: '18px', background: 'var(--pixel-red)', 
              border: '2px solid #000', borderRadius: '0 0 8px 8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '1px 2px 0 rgba(0,0,0,0.1)'
            }}
          >
            <span style={{ fontSize: '7px', color: 'white', fontWeight: 'bold', fontFamily: 'var(--font-pixel)' }}>CATCH</span>
          </div>
        </div>
      ) : (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '15px' }}>
          <div style={{ fontSize: '32px' }} className="heart-beat">🧺❤️</div>
          <h4 style={{ fontWeight: 'bold', fontSize: '13px' }}>Catch the Falling Hearts!</h4>
          <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.4', maxWidth: '280px' }}>
            Catch 10 hearts to reveal a special note! Use Left/Right Arrow keys or the controls below.
          </p>
          <button className="retro-button primary" onClick={startGame} style={{ fontSize: '11px', padding: '6px 20px' }}>
            Start Game
          </button>
        </div>
      )}

      {/* Control Buttons for Mobile/Easy Clicks */}
      {isPlaying && score < 10 && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', gap: '15px' }}>
          <button 
            className="retro-button" 
            onClick={() => setBucketX(prev => Math.max(0, prev - 12))}
            style={{ flexGrow: 1, padding: '8px 0', fontSize: '12px', fontWeight: 'bold' }}
          >
            ◀ Move Left
          </button>
          <button 
            className="retro-button" 
            onClick={() => setBucketX(prev => Math.min(90, prev + 12))}
            style={{ flexGrow: 1, padding: '8px 0', fontSize: '12px', fontWeight: 'bold' }}
          >
            Move Right ▶
          </button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// RELATIONSHIP COUNTER APP [NEW]
// ----------------------------------------------------
function RelationshipCounterApp() {
  const [timeDiff, setTimeDiff] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
    totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date("2022-12-10T18:55:00");
      const now = new Date();
      const diffMs = now - start;

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      if (seconds < 0) {
        minutes -= 1;
        seconds += 60;
      }
      if (minutes < 0) {
        hours -= 1;
        minutes += 60;
      }
      if (hours < 0) {
        days -= 1;
        hours += 60;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months -= 1;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const totalSeconds = Math.floor(diffMs / 1000);

      setTimeDiff({
        years, months, days, hours, minutes, seconds,
        totalDays, totalHours, totalMinutes, totalSeconds
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="retro-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '2px solid var(--shadow-dark)', padding: '12px', justifyContent: 'space-between', backgroundColor: '#fffbfb' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px dashed var(--pixel-pink)', paddingBottom: '6px', marginBottom: '8px' }}>
        <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--pixel-red)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="heart-beat">❤️</span> TOGETHER SINCE 10.12.2022 <span className="heart-beat">❤️</span>
        </h4>
        <p style={{ fontSize: '9px', color: '#666', marginTop: '2.5px', fontStyle: 'italic' }}>
          Started at 06:55 PM on our special day
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
        <div style={{ backgroundColor: '#ffdce3', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--pixel-red)' }}>{timeDiff.years}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Years</div>
        </div>
        <div style={{ backgroundColor: '#ffdce3', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--pixel-red)' }}>{timeDiff.months}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Months</div>
        </div>
        <div style={{ backgroundColor: '#ffdce3', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--pixel-red)' }}>{timeDiff.days}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Days</div>
        </div>
        <div style={{ backgroundColor: '#fff5f7', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#be185d' }}>{timeDiff.hours}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Hours</div>
        </div>
        <div style={{ backgroundColor: '#fff5f7', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#be185d' }}>{timeDiff.minutes}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Minutes</div>
        </div>
        <div style={{ backgroundColor: '#fff5f7', border: '1.5px solid #000', borderRadius: '4px', padding: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#be185d' }} className="heart-beat">{timeDiff.seconds}</div>
          <div style={{ fontSize: '8.5px', fontFamily: 'var(--font-pixel)', color: '#444', marginTop: '2px' }}>Seconds</div>
        </div>
      </div>

      <div style={{ background: '#f8fafc', border: '1px inset #ccc', borderRadius: '4px', padding: '8px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Days:</span>
          <strong>{timeDiff.totalDays.toLocaleString()} days</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Hours:</span>
          <strong>{timeDiff.totalHours.toLocaleString()} hours</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Total Seconds:</span>
          <strong style={{ color: 'var(--pixel-red)' }}>{timeDiff.totalSeconds.toLocaleString()} s</strong>
        </div>
      </div>
    </div>
  );
}

// Sidebar Icon Component
function DesktopIcon({ title, icon: Icon, onClick, isOpen, style = {} }) {
  return (
    <div 
      className="desktop-icon-btn"
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', textAlign: 'center', padding: '2px', width: '75px', height: '75px',
        border: '1px dashed transparent', transition: 'all 0.1s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.border = '1px dashed #ffffff'}
      onMouseLeave={(e) => e.currentTarget.style.border = '1px dashed transparent'}
    >
      <div 
        style={{
          width: '32px', height: '32px', backgroundColor: isOpen ? '#ffe4e6' : '#ffffff',
          border: '2px solid #000', boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pixel-red)',
          marginBottom: '3px', transition: 'all 0.1s', ...style
        }}
      >
        <Icon size={16} className={isOpen ? 'heart-beat' : ''} />
      </div>
      <span 
        style={{
          fontFamily: 'var(--font-pixel)', 
          fontSize: '9px', 
          color: '#ffffff',
          textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000', 
          lineHeight: '1.3', 
          wordBreak: 'break-word', 
          maxWidth: '75px',
          marginTop: '4px'
        }}
      >
        {title}
      </span>
    </div>
  );
}
