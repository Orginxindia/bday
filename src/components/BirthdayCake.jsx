import React, { useState, useEffect } from 'react';
import { sound } from './SoundManager';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

export default function BirthdayCake({ onRestart }) {
  const [blownCandles, setBlownCandles] = useState([]);
  const [currentWish, setCurrentWish] = useState("Click on each of the 20 candles to make a wish and blow them out! 🎂");
  const [showFinalLetter, setShowFinalLetter] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const wishes = [
    "1. I wish you endless laughter and joy every single day. 😂",
    "2. I wish you vibrant health, safety, and strength. 💪",
    "3. I wish that all your silent prayers get answered. 🙏",
    "4. I wish you absolute confidence in your beautiful self. ✨",
    "5. I wish to travel the world (Goa, Japan, Paris) with you. 🌍",
    "6. I wish to share late-night coffees and boba with you forever. ☕",
    "7. I wish you grand success in all your career and dreams. 🏆",
    "8. I wish your beautiful smile never, ever fades away. 😊",
    "9. I wish to always be the peace in your chaotic days. ⚓",
    "10. I wish us a future filled with cozy Sunday mornings and blankets. ☀️",
    "11. I wish you find calm and clarity in any storm. 🍃",
    "12. I wish to celebrate all your future birthdays beside you. 🎂",
    "13. I wish you feel cherished, protected, and loved every second. ❤️",
    "14. I wish you strength to conquer any fears or doubts. 🦁",
    "15. I wish you always feel like 'coming home' when you're with me. 🏡",
    "16. I wish we write the most magical chapters of our lives together. 📖",
    "17. I wish to take a million more cute photos of you. 📸",
    "18. I wish you never stop dreaming big and soaring high. 🌠",
    "19. I wish you the warmest, happiest, and most beautiful 20th year. 🎆",
    "20. I wish... to spend my entire forever loving you. 💍"
  ];

  // Blow out candle action
  const handleBlowCandle = (index) => {
    if (blownCandles.includes(index)) return;
    
    sound.playCandle();
    sound.playClick();
    
    const nextBlown = [...blownCandles, index];
    setBlownCandles(nextBlown);
    setCurrentWish(wishes[index]);

    // Add temporary spark/confetti near candle
    triggerLocalConfetti();

    if (nextBlown.length === 20) {
      setTimeout(() => {
        sound.playSuccess();
        setShowFinalLetter(true);
        triggerBigConfetti();
      }, 1000);
    }
  };

  // local small candle blow sparkle
  const triggerLocalConfetti = () => {
    const newItems = Array.from({ length: 6 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * 80 - 40,
      y: Math.random() * -30 - 10,
      color: ['#f43f5e', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
      size: Math.random() * 5 + 4
    }));
    setConfetti(prev => [...prev, ...newItems]);
    // Clear out after 1s
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newItems.includes(c)));
    }, 1000);
  };

  // huge screen-wide falling hearts confetti
  const triggerBigConfetti = () => {
    const newItems = Array.from({ length: 80 }).map((_, i) => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * -200 - 50,
      speedY: Math.random() * 3 + 2,
      speedX: Math.random() * 2 - 1,
      color: ['#f43f5e', '#ec4899', '#fca5a5', '#ffdce3', '#ff8ca3'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 8,
      rotation: Math.random() * 360
    }));
    setConfetti(prev => [...prev, ...newItems]);
  };

  // Animate screen-wide confetti
  useEffect(() => {
    if (confetti.length === 0) return;
    let animId;
    const updateConfetti = () => {
      setConfetti(prev => 
        prev.map(c => {
          if (c.speedY) { // Screen wide confetti
            return {
              ...c,
              y: c.y + c.speedY,
              x: c.x + c.speedX,
              rotation: c.rotation + 1
            };
          }
          return c; // Local sparkles stay static/fade
        }).filter(c => c.y < window.innerHeight)
      );
      animId = requestAnimationFrame(updateConfetti);
    };
    animId = requestAnimationFrame(updateConfetti);
    return () => cancelAnimationFrame(animId);
  }, [confetti]);

  return (
    <div className="cake-screen">
      {/* Falling Confetti Layer */}
      {confetti.map(c => (
        <div
          key={c.id}
          style={{
            position: 'fixed',
            left: c.speedY ? `${c.x}px` : '50%',
            top: c.speedY ? `${c.y}px` : '42%',
            marginLeft: c.speedY ? 0 : `${c.x}px`,
            marginTop: c.speedY ? 0 : `${c.y}px`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            transform: c.speedY ? `rotate(${c.rotation}deg)` : 'none',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9990,
            opacity: 0.85,
            transition: c.speedY ? 'none' : 'opacity 0.8s ease-out'
          }}
        >
          {c.size > 8 && <Heart size={c.size} fill={c.color} color="none" />}
        </div>
      ))}

      {/* Main Container */}
      {!showFinalLetter ? (
        <div 
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', width: '100%', maxWidth: '600px'
          }}
        >
          <div style={{ display: 'flex', gap: '6px', color: 'var(--pixel-red)', marginBottom: '8px' }}>
            <Sparkles size={24} className="heart-beat" />
            <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', textTransform: 'uppercase' }}>
              Blow Out the 20 Candles!
            </h2>
            <Sparkles size={24} className="heart-beat" style={{ animationDelay: '0.4s' }} />
          </div>

          <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', color: '#777', marginBottom: '25px' }}>
            CANDLES BLOWN: {blownCandles.length} / 20
          </div>

          {/* CAKE CONTAINER */}
          <div className="cake-container">
            {/* Plate */}
            <div className="cake-plate"></div>
            
            {/* Bottom Tier */}
            <div className="cake-tier bottom">
              <div className="frosting"></div>
            </div>

            {/* Top Tier */}
            <div className="cake-tier top">
              <div className="frosting"></div>
            </div>

            {/* 20 Candles */}
            <div className="candles-layer">
              {Array.from({ length: 20 }).map((_, idx) => {
                const isBlown = blownCandles.includes(idx);
                return (
                  <div 
                    key={idx} 
                    className={`candle-wrapper ${isBlown ? 'blown' : ''}`}
                    onClick={() => handleBlowCandle(idx)}
                  >
                    <div className="candle-flame"></div>
                    <div className="candle-smoke"></div>
                    <div className="candle-wick"></div>
                    <div className="candle-wax"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WISH BOX */}
          <div 
            className="retro-window" 
            style={{ 
              width: '100%', marginTop: '35px', maxWidth: '480px',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
            }}
          >
            <div className="retro-titlebar">
              <div className="retro-titlebar-text">🎂 Candle Wish Dispenser</div>
            </div>
            <div 
              className="retro-window-body" 
              style={{ 
                padding: '20px', backgroundColor: '#fff', minHeight: '80px', 
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <p 
                style={{ 
                  fontFamily: 'var(--font-sans)', fontSize: '15px', color: '#111', 
                  fontWeight: '500', lineHeight: '1.4'
                }}
              >
                {currentWish}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* FINAL CELEBRATION CARD */
        <div 
          className="retro-window" 
          style={{
            width: '90%', maxWidth: '520px',
            animation: 'float 3s infinite ease-in-out',
            boxShadow: '6px 6px 20px rgba(0,0,0,0.2)'
          }}
        >
          <div className="retro-titlebar">
            <div className="retro-titlebar-text">💝 HAPPY_BIRTHDAY_FOREVER.EXE</div>
          </div>
          <div 
            className="retro-window-body"
            style={{
              background: '#fff0f3', border: '2px inset #fff', padding: '30px 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
            }}
          >
            <div style={{ color: 'var(--pixel-red)', display: 'flex', gap: '8px' }}>
              <Heart size={28} className="heart-beat" fill="var(--pixel-red)" />
              <Heart size={28} className="heart-beat" fill="var(--pixel-red)" style={{ animationDelay: '0.2s' }} />
              <Heart size={28} className="heart-beat" fill="var(--pixel-red)" style={{ animationDelay: '0.4s' }} />
            </div>

            <h1 
              style={{
                fontFamily: 'var(--font-pixel)', fontSize: '18px', color: 'var(--pixel-red)',
                textAlign: 'center', lineHeight: '1.5', textShadow: '2px 2px 0px #fff'
              }}
            >
              HAPPY 20th BIRTHDAY! 🎉
            </h1>

            <div 
              style={{
                fontFamily: 'var(--font-sans)', fontSize: '14.5px', color: '#333', 
                lineHeight: '1.6', textAlign: 'center', maxWidth: '440px', borderTop: '2px dashed var(--pixel-pink)',
                borderBottom: '2px dashed var(--pixel-pink)', padding: '20px 10px', backgroundColor: '#fff',
                borderRadius: '4px'
              }}
            >
              <p style={{ fontWeight: '500', marginBottom: '12px' }}>
                "No matter how many birthdays come and go, I promise I'll never stop admiring your heart, respecting your dreams, praying for your happiness, and loving you with everything I have."
              </p>
              <p style={{ fontWeight: 'bold', color: 'var(--pixel-red)', fontSize: '16px' }}>
                You are my greatest blessing. ❤️
              </p>
            </div>

            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#ff4d6d' }}>
              Forever Yours, Dharani ❤️
            </p>

            <button 
              className="retro-button" 
              onClick={onRestart}
              style={{ marginTop: '10px', fontSize: '9px', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <RefreshCw size={10} />
              <span>Explore LoveOS Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
