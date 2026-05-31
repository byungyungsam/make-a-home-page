import React, { useEffect, useRef } from 'react';
import { Download, Play, Terminal } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.4)' : 'rgba(155, 81, 224, 0.4)';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Grid Overlay */}
      <div className="hero-grid-overlay" />

      {/* Content */}
      <div className="hero-content fade-in-up">
        {/* Badge */}
        <div className="hero-badge">
          <Terminal className="icon-cyan-small" /> Core Utilities & Web Game Developer
        </div>

        {/* Title */}
        <h1 className="hero-title">
          PC 성능 향상 <span className="text-neon-cyan">유틸리티</span> & <br />
          네온 스타일 <span className="hero-title-gradient">웹 게임</span> 전시관
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          시스템 리소스를 최적화하고 PC 효율을 개선하는 윈도우 유틸리티 프로그램과 
          웹에서 즉시 즐길 수 있는 미니 게임들을 직접 개발하고 배포하고 있습니다.
        </p>

        {/* Buttons */}
        <div className="hero-actions">
          <button onClick={() => handleScrollTo('showcase')} className="glow-btn hero-btn-primary">
            <Download className="icon-btn" /> 유틸리티 다운로드
          </button>
          
          <button onClick={() => handleScrollTo('minigame')} className="hero-btn-secondary">
            <Play className="icon-btn icon-purple" /> 미니 게임 플레이
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-down" onClick={() => handleScrollTo('about')}>
        <span className="scroll-text">Scroll Down</span>
        <div className="scroll-mouse">
          <div className="scroll-dot" />
        </div>
      </div>
    </section>
  );
}
