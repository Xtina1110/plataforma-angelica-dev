import React, { useEffect, useRef } from 'react';

const AngelicParticles = ({ count = 30, color = 'gold' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clase Partícula
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.life = Math.random() * 100;
        this.maxLife = 100;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Efecto de parpadeo
        this.opacity = 0.2 + Math.abs(Math.sin(this.life * 0.05)) * 0.5;

        // Resetear si sale del canvas o completa su vida
        if (
          this.x < 0 || 
          this.x > canvas.width || 
          this.y < 0 || 
          this.y > canvas.height ||
          this.life > this.maxLife
        ) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = color === 'gold' ? '#FFD700' : '#E6E6FA';
        
        // Dibujar partícula
        ctx.fillStyle = color === 'gold' 
          ? `rgba(255, 215, 0, ${this.opacity})` 
          : `rgba(230, 230, 250, ${this.opacity})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Crear partículas
    particlesRef.current = Array.from({ length: count }, () => new Particle());

    // Conectar partículas cercanas
    const connectParticles = () => {
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = color === 'gold'
              ? `rgba(255, 215, 0, ${0.1 * (1 - distance / 150)})`
              : `rgba(230, 230, 250, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      connectParticles();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default AngelicParticles;

