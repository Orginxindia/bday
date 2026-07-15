class SoundManager {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Windows 98-style startup chime
  playBootChime() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const now = this.ctx.currentTime;

    const playSynthPad = (freq, start, duration, gainVal, type = 'sine') => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      
      gainNode.gain.setValueAtTime(0, start);
      gainNode.gain.linearRampToValueAtTime(gainVal, start + 0.5); // attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration); // release
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    const baseTones = [130.81, 196.00, 261.63];
    const chord1 = [329.63, 392.00, 523.25, 659.25];
    const chord2 = [349.23, 440.00, 523.25, 698.46];
    const chord3 = [392.00, 493.88, 587.33, 783.99];
    const finalChord = [523.25, 659.25, 783.99, 1046.50];

    baseTones.forEach(f => playSynthPad(f, now, 3.5, 0.03, 'triangle'));
    chord1.forEach(f => playSynthPad(f, now + 0.2, 2.5, 0.02, 'sine'));
    chord2.forEach(f => playSynthPad(f, now + 0.6, 2.2, 0.02, 'sine'));
    chord3.forEach(f => playSynthPad(f, now + 1.0, 2.0, 0.02, 'sine'));
    finalChord.forEach(f => playSynthPad(f, now + 1.4, 2.8, 0.03, 'sine'));
  }

  // A quick retro 8-bit click
  playClick() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // No button dodge sound
  playDodge() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Joyful success fanfare
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const playTone = (freq, start, duration, type = 'square') => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.04, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    const now = this.ctx.currentTime;
    playTone(261.63, now, 0.08);
    playTone(329.63, now + 0.08, 0.08);
    playTone(392.00, now + 0.16, 0.08);
    playTone(523.25, now + 0.24, 0.25);
  }

  // Catch item sound in mini game
  playCatch() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Hit obstacle sound in mini game
  playHit() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Water sprinkle sound
  playWater() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseNode.start();
  }

  // Candle blowing sound
  playCandle() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseNode.start();
  }

  // Plays 'Kannaana Kanne' YouTube lyric video audio in background using a hidden iframe
  startMusic() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    // Remove any existing copy to prevent duplicate sounds
    const existing = document.getElementById('youtube-bgm');
    if (existing) {
      try { existing.remove(); } catch (e) {}
    }

    // Create iframe offscreen (rendering it in DOM triggers autoplay after user interaction)
    const iframe = document.createElement('iframe');
    iframe.id = 'youtube-bgm';
    iframe.width = '1';
    iframe.height = '1';
    // Loop requires loop=1 AND playlist=VIDEO_ID
    iframe.src = 'https://www.youtube.com/embed/mmE44f2_4Zg?autoplay=1&loop=1&playlist=mmE44f2_4Zg&controls=0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = '0';
    iframe.style.pointerEvents = 'none';
    
    document.body.appendChild(iframe);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    const iframe = document.getElementById('youtube-bgm');
    if (iframe) {
      try {
        iframe.remove();
      } catch (e) {}
    }
  }
}

export const sound = new SoundManager();
