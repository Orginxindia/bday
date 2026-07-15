import React, { useState, useEffect, useRef } from 'react';
import { sound } from './SoundManager';

export default function IntroScreen({ onAccept }) {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  const [yesScale, setYesScale] = useState(1);
  const containerRef = useRef(null);

  // Play click on accept
  const handleYes = () => {
    sound.playSuccess();
    onAccept();
  };

  // Dodging logic for "No" button
  const handleNoHoverOrClick = () => {
    sound.playDodge();
    setNoCount(prev => prev + 1);
    setYesScale(prev => Math.min(prev + 0.15, 3)); // Max 3x scale

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // Keep within limits (accounting for button dimensions)
      const btnWidth = 100;
      const btnHeight = 40;
      
      const maxX = containerRect.width - btnWidth - 20;
      const maxY = containerRect.height - btnHeight - 20;
      
      const randomX = Math.max(10, Math.floor(Math.random() * maxX));
      const randomY = Math.max(10, Math.floor(Math.random() * maxY));
      
      setNoPosition({
        position: 'absolute',
        left: `${randomX}px`,
        top: `${randomY}px`,
        zIndex: 1000
      });
    }
  };

  // Text changes for "No" button
  const getNoButtonText = () => {
    const texts = [
      "No",
      "Are you sure? 🥺",
      "Think again! 💔",
      "Last chance! 😭",
      "Pretty please? 🌸",
      "Surely not? 🥺",
      "You're breaking my heart! ❤️",
      "Error: No not found 🤖",
      "No way Jose! 🚫",
      "Click YES! 🥰"
    ];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  // Initial hearts count
  const hearts = [1, 2, 3, 4, 5];

  // SVG Sparkle Component
  const Sparkle = ({ style }) => (
    <svg 
      className="pixel-sparkle" 
      style={{ 
        width: '24px', 
        height: '24px', 
        fill: 'var(--pixel-red)',
        position: 'absolute',
        ...style 
      }} 
      viewBox="0 0 8 8"
    >
      {/* 8-bit Pixel Star shape */}
      <rect x="3" y="0" width="2" height="1" />
      <rect x="2" y="1" width="4" height="1" />
      <rect x="1" y="2" width="6" height="1" />
      <rect x="0" y="3" width="8" height="2" />
      <rect x="1" y="5" width="6" height="1" />
      <rect x="2" y="6" width="4" height="1" />
      <rect x="3" y="7" width="2" height="1" />
    </svg>
  );

  return (
    <div 
      className="retro-window IntroScreen-container" 
      ref={containerRef}
      style={{
        width: '90%',
        maxWidth: '620px',
        height: '420px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      {/* Title bar */}
      <div className="retro-titlebar">
        <div className="retro-titlebar-text">
          <span>💖</span> SYSTEM_INITIALIZATION.EXE
        </div>
        <div className="retro-titlebar-buttons">
          <div className="retro-titlebar-btn">?</div>
          <div className="retro-titlebar-btn">X</div>
        </div>
      </div>

      {/* Main body of the window */}
      <div 
        className="retro-window-body"
        style={{
          background: '#e3eff3', /* Light textured paperish cyan background */
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          border: '2px inset #fff'
        }}
      >
        {/* Pixel Star Sparkles in corners */}
        <Sparkle style={{ top: '15px', left: '15px' }} />
        <Sparkle style={{ top: '40px', left: '35px', animationDelay: '0.4s' }} />
        <Sparkle style={{ bottom: '15px', left: '15px', animationDelay: '0.8s' }} />
        
        <Sparkle style={{ top: '25px', right: '25px', animationDelay: '0.2s' }} />
        <Sparkle style={{ bottom: '35px', right: '15px', animationDelay: '0.6s' }} />
        <Sparkle style={{ bottom: '15px', right: '40px', animationDelay: '1s' }} />

        {/* Beating pixel hearts at the top */}
        <div 
          className="hearts-bar"
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          {hearts.map(h => (
            <svg 
              key={h} 
              className="heart-beat" 
              style={{ 
                width: '32px', 
                height: '32px', 
                fill: 'var(--pixel-red)',
                animationDelay: `${h * 0.15}s`
              }} 
              viewBox="0 0 16 16"
            >
              {/* 8-bit Heart path */}
              <path d="M4 1h3v1h2V1h3v1h1v2h1v3h-1v2h-1v1h-1v1h-1v1h-1v1H7v-1H6v-1H5v-1H4V9H3V7H2V4h1V2h1V1z" />
            </svg>
          ))}
        </div>

        {/* Main Title - HI, LOVE! */}
        <h1 
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '36px',
            color: 'var(--pixel-red)',
            textShadow: '3px 3px 0px #fff, 5px 5px 0px rgba(0,0,0,0.1)',
            marginBottom: '15px',
            textAlign: 'center',
            letterSpacing: '2px'
          }}
        >
          HI, GOLDUHHHH!!
        </h1>

        {/* Subtext message */}
        <p
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '11px',
            lineHeight: '1.8',
            color: '#4a4a4a',
            textAlign: 'center',
            maxWidth: '380px',
            marginBottom: '35px',
            textTransform: 'uppercase'
          }}
        >
          Do you want to see a little surprise I made for you?
        </p>

        {/* Button selection area */}
        <div 
          className="intro-actions"
          style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '80px',
            position: 'relative'
          }}
        >
          <button 
            className="retro-button primary"
            onClick={handleYes}
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              minWidth: '100px',
              height: '40px',
              fontSize: '14px',
              boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.15)'
            }}
          >
            Yes
          </button>
          
          <button 
            className="retro-button"
            onMouseEnter={handleNoHoverOrClick}
            onClick={handleNoHoverOrClick}
            onTouchStart={(e) => {
              e.preventDefault(); // Stop click emulation
              handleNoHoverOrClick();
            }}
            style={{
              minWidth: '100px',
              height: '40px',
              fontSize: noCount > 3 ? '10px' : '12px',
              boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.15)',
              transition: noPosition ? 'none' : 'all 0.15s ease',
              ...(noPosition || {})
            }}
          >
            {getNoButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
