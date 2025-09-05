// ============================================================================
// ANIMATED VISUAL SYSTEM
// ============================================================================

class FullPageVisual {
    constructor(options = {}) {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.particles = [];
        this.energyFields = [];
        this.flowLines = [];
        this.mouse = { x: 0, y: 0, active: false };
        this.options = {
            particleCount: options.particleCount || 80,
            energyFieldCount: options.energyFieldCount || 5,
            flowLineCount: options.flowLineCount || 12,
            animationSpeed: options.animationSpeed || 1,
            colors: options.colors || ['#fff', '#4A90E2', '#7B68EE', '#32CD32', '#FF6B6B'],
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createElements();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Ensure it's behind all content
        this.canvas.style.opacity = '0.6';
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createElements() {
        // Create floating particles with organic movement
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: this.options.colors[Math.floor(Math.random() * this.options.colors.length)],
                life: Math.random() * Math.PI * 2,
                connectionRadius: 100 + Math.random() * 150,
                flow: Math.random() * Math.PI * 2
            });
        }
        
        // Create energy fields that influence particle movement
        this.energyFields = [];
        for (let i = 0; i < this.options.energyFieldCount; i++) {
            this.energyFields.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                radius: 150 + Math.random() * 200,
                strength: 0.5 + Math.random() * 1.5,
                pulse: Math.random() * Math.PI * 2,
                drift: {
                    x: (Math.random() - 0.5) * 0.2,
                    y: (Math.random() - 0.5) * 0.2
                }
            });
        }
        
        // Create flowing lines that connect particles
        this.flowLines = [];
        for (let i = 0; i < this.options.flowLineCount; i++) {
            this.flowLines.push({
                startX: Math.random() * window.innerWidth,
                startY: Math.random() * window.innerHeight,
                endX: Math.random() * window.innerWidth,
                endY: Math.random() * window.innerHeight,
                progress: Math.random(),
                speed: 0.001 + Math.random() * 0.003,
                opacity: 0.1 + Math.random() * 0.3,
                width: 1 + Math.random() * 2
            });
        }
    }
    
    bindEvents() {
        // Handle mouse movement for interactive effects
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.active = true;
            
            // Clear mouse active state after a delay
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.mouse.active = false;
            }, 100);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createElements(); // Recreate elements for new dimensions
        });
        
        // Handle scroll for parallax-like effects
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.updateScrollPosition();
            }, 16);
        });
    }
    
    updateScrollPosition() {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;
        
        // Adjust particle movement based on scroll
        this.particles.forEach(particle => {
            particle.scrollInfluence = scrollProgress * 0.5;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const time = Date.now() * 0.001 * this.options.animationSpeed;
        
        // Update and draw energy fields
        this.energyFields.forEach(field => {
            // Drift the field position
            field.x += field.drift.x;
            field.y += field.drift.y;
            
            // Bounce off edges
            if (field.x < field.radius) field.drift.x = Math.abs(field.drift.x);
            if (field.x > this.canvas.width - field.radius) field.drift.x = -Math.abs(field.drift.x);
            if (field.y < field.radius) field.drift.y = Math.abs(field.drift.y);
            if (field.y > this.canvas.height - field.radius) field.drift.y = -Math.abs(field.drift.y);
            
            // Draw field influence (subtle glow)
            const pulseOpacity = 0.05 + 0.05 * Math.sin(time * 2 + field.pulse);
            const gradient = this.ctx.createRadialGradient(
                field.x, field.y, 0,
                field.x, field.y, field.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${pulseOpacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(field.x, field.y, field.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Update and draw particles with organic movement
        this.particles.forEach(particle => {
            // Apply energy field influence
            this.energyFields.forEach(field => {
                const dx = field.x - particle.x;
                const dy = field.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < field.radius) {
                    const force = (field.radius - distance) / field.radius * field.strength * 0.01;
                    particle.vx += (dx / distance) * force;
                    particle.vy += (dy / distance) * force;
                }
            });
            
            // Add subtle wind/flow effect
            particle.vx += Math.sin(time + particle.flow) * 0.001;
            particle.vy += Math.cos(time + particle.flow) * 0.001;
            
            // Add mouse interaction
            if (this.mouse.active) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200 * 0.02;
                    particle.vx -= (dx / distance) * force;
                    particle.vy -= (dy / distance) * force;
                }
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            const lifeOpacity = 0.2 + 0.4 * Math.sin(time + particle.life);
            this.ctx.fillStyle = particle.color.replace(')', `, ${lifeOpacity})`).replace('rgb', 'rgba');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections between nearby particles
            this.particles.forEach(otherParticle => {
                if (particle !== otherParticle) {
                    const dx = otherParticle.x - particle.x;
                    const dy = otherParticle.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < particle.connectionRadius) {
                        const opacity = (particle.connectionRadius - distance) / particle.connectionRadius * 0.3;
                        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.stroke();
                    }
                }
            });
        });
        
        // Update and draw flow lines
        this.flowLines.forEach(line => {
            line.progress += line.speed;
            if (line.progress > 1) {
                line.progress = 0;
                line.startX = line.endX;
                line.startY = line.endY;
                line.endX = Math.random() * this.canvas.width;
                line.endY = Math.random() * this.canvas.height;
            }
            
            const currentX = line.startX + (line.endX - line.startX) * line.progress;
            const currentY = line.startY + (line.endY - line.startY) * line.progress;
            
            // Add wave effect to the line
            const waveOffset = Math.sin(time * 3 + line.progress * Math.PI * 2) * 20;
            
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`;
            this.ctx.lineWidth = line.width;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(line.startX, line.startY);
            
            // Create curved path with wave
            const midX = (line.startX + line.endX) / 2;
            const midY = (line.startY + line.endY) / 2 + waveOffset;
            
            this.ctx.quadraticCurveTo(midX, midY, currentX, currentY);
            this.ctx.stroke();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Method to adjust animation speed
    setSpeed(speed) {
        this.options.animationSpeed = speed;
    }
    
    // Method to pause/resume animation
    togglePause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        } else {
            this.animate();
        }
    }
    
    // Method to change particle count
    setParticleCount(count) {
        this.options.particleCount = count;
        this.createElements();
    }
    
    // Method to destroy the animation
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize full-page visual when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for a data attribute on the body to decide if we should initialize the visual
    if (document.body.dataset.visuals === 'true') {
        // Create the full-page visual system
        const fullPageVisual = new FullPageVisual({
            particleCount: 100,
            energyFieldCount: 6,
            flowLineCount: 15,
            animationSpeed: 0.8,
            colors: [
                '#fff',
                '#4A90E2', // Blue
                '#7B68EE', // Purple
                '#32CD32', // Green
                '#FF6B6B', // Red
                '#FFD93D'  // Yellow
            ]
        });
        
        // Store reference globally
        window.fullPageVisual = fullPageVisual;
        
        // Add subtle scroll-triggered effects
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            // Temporarily increase animation speed during scroll
            fullPageVisual.setSpeed(1.5);
            
            scrollTimeout = setTimeout(() => {
                fullPageVisual.setSpeed(0.8);
            }, 500);
        });
    }
});