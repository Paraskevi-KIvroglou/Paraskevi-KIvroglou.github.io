/**
 * Podcast Animated Background
 * Professional design system for Paraskevi Kivroglou's Podcast page
 * Features: Sound waves, audio visualizers, podcast symbols, broadcasting elements
 */

class PodcastBackground {
    constructor() {
        this.canvas = document.getElementById('podcast-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.time = 0;
        
        // Animation layers
        this.soundWaves = new SoundWavesLayer();
        this.audioVisualizer = new AudioVisualizerLayer();
        this.podcastSymbols = new PodcastSymbolsLayer();
        this.broadcastingElements = new BroadcastingElementsLayer();
        
        // Performance settings
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
        
        // Audio simulation
        this.audioContext = null;
        this.audioData = new Array(64).fill(0);
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.bindEvents();
        this.simulateAudioData();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update layer dimensions
        this.soundWaves.resize(this.canvas.width, this.canvas.height);
        this.audioVisualizer.resize(this.canvas.width, this.canvas.height);
        this.podcastSymbols.resize(this.canvas.width, this.canvas.height);
        this.broadcastingElements.resize(this.canvas.width, this.canvas.height);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Add scroll-based animation intensity
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.setAnimationIntensity(1.8);
            
            scrollTimeout = setTimeout(() => {
                this.setAnimationIntensity(1.0);
            }, 400);
        });
        
        // Add mouse movement for interactive audio visualization
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            this.setAnimationIntensity(1.3);
            
            mouseTimeout = setTimeout(() => {
                this.setAnimationIntensity(1.0);
            }, 200);
        });
    }
    
    simulateAudioData() {
        // Simulate realistic audio frequency data
        setInterval(() => {
            this.audioData = this.audioData.map(() => {
                return Math.random() * 0.8 + 0.2;
            });
        }, 100);
    }
    
    setAnimationIntensity(intensity) {
        this.soundWaves.setIntensity(intensity);
        this.audioVisualizer.setIntensity(intensity);
        this.podcastSymbols.setIntensity(intensity);
        this.broadcastingElements.setIntensity(intensity);
    }
    
    animate(currentTime = 0) {
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.time += 0.016; // 60fps time increment
            this.lastFrameTime = currentTime;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw layers in order (background to foreground)
            this.soundWaves.draw(this.ctx, this.time, this.audioData);
            this.audioVisualizer.draw(this.ctx, this.time, this.audioData);
            this.podcastSymbols.draw(this.ctx, this.time);
            this.broadcastingElements.draw(this.ctx, this.time);
        }
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/**
 * Sound Waves Layer - Creates flowing, organic sound wave patterns
 */
class SoundWavesLayer {
    constructor() {
        this.waves = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createWaves();
    }
    
    createWaves() {
        this.waves = [];
        
        // Create multiple wave systems
        for (let i = 0; i < 5; i++) {
            this.waves.push({
                y: (this.height / 6) * (i + 1),
                amplitude: 30 + Math.random() * 50,
                frequency: 0.01 + Math.random() * 0.02,
                speed: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                color: this.getWaveColor(i),
                thickness: 2 + Math.random() * 3,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    }
    
    getWaveColor(index) {
        const colors = [
            'rgba(255, 255, 255, 0.4)', // White
            'rgba(200, 200, 200, 0.4)', // Light Grey
            'rgba(150, 150, 150, 0.4)', // Medium Grey
            'rgba(100, 100, 100, 0.4)', // Dark Grey
            'rgba(50, 50, 50, 0.4)'     // Very Dark Grey
        ];
        return colors[index % colors.length];
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time, audioData) {
        this.waves.forEach((wave, index) => {
            const waveIntensity = this.intensity * (0.8 + audioData[index % audioData.length] * 0.4);
            const amplitude = wave.amplitude * waveIntensity;
            
            ctx.strokeStyle = wave.color.replace('0.6)', `${wave.opacity * waveIntensity})`);
            ctx.lineWidth = wave.thickness;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            
            // Draw wave path
            for (let x = 0; x < this.width; x += 2) {
                const y = wave.y + 
                    Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * amplitude +
                    Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * (amplitude * 0.3);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
    }
}

/**
 * Audio Visualizer Layer - Creates dynamic frequency bars and circular visualizer
 */
class AudioVisualizerLayer {
    constructor() {
        this.frequencyBars = [];
        this.circularVisualizer = null;
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createVisualizer();
    }
    
    createVisualizer() {
        // Create frequency bars
        this.frequencyBars = [];
        const barCount = 32;
        const barWidth = this.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            this.frequencyBars.push({
                x: i * barWidth + barWidth / 2,
                y: this.height,
                width: barWidth * 0.8,
                height: 0,
                targetHeight: 0,
                color: this.getBarColor(i),
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Create circular visualizer
        this.circularVisualizer = {
            x: this.width / 2,
            y: this.height / 2,
            radius: Math.min(this.width, this.height) * 0.15,
            rings: 8,
            rotation: 0
        };
    }
    
    getBarColor(index) {
        const greyValues = [255, 240, 220, 200, 180, 160, 140, 120, 100, 80, 60, 40, 20, 0];
        const greyIndex = Math.floor((index / 32) * greyValues.length);
        const greyValue = greyValues[greyIndex];
        return `rgb(${greyValue}, ${greyValue}, ${greyValue})`;
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time, audioData) {
        // Draw frequency bars
        this.frequencyBars.forEach((bar, index) => {
            const audioValue = audioData[index % audioData.length];
            const targetHeight = audioValue * this.height * 0.4 * this.intensity;
            
            // Smooth height animation
            bar.height += (targetHeight - bar.height) * 0.1;
            
            const pulseOpacity = 0.6 + 0.4 * Math.sin(time * 3 + bar.pulse) * this.intensity;
            const gradient = ctx.createLinearGradient(bar.x, bar.y, bar.x, bar.y - bar.height);
            gradient.addColorStop(0, bar.color.replace(')', `, ${pulseOpacity})`));
            gradient.addColorStop(1, bar.color.replace(')', `, ${pulseOpacity * 0.3})`));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(bar.x - bar.width / 2, bar.y - bar.height, bar.width, bar.height);
        });
        
        // Draw circular visualizer
        this.drawCircularVisualizer(ctx, time, audioData);
    }
    
    drawCircularVisualizer(ctx, time, audioData) {
        const viz = this.circularVisualizer;
        viz.rotation += 0.02 * this.intensity;
        
        for (let ring = 0; ring < viz.rings; ring++) {
            const ringRadius = viz.radius + ring * 20;
            const ringOpacity = 0.3 - (ring * 0.03);
            const audioIndex = Math.floor((ring / viz.rings) * audioData.length);
            const audioValue = audioData[audioIndex] || 0;
            
            ctx.strokeStyle = `rgba(200, 200, 200, ${ringOpacity * audioValue * this.intensity})`;
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(viz.x, viz.y, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Add rotating dots on the ring
            const dotCount = 8 + ring * 2;
            for (let i = 0; i < dotCount; i++) {
                const angle = (i / dotCount) * Math.PI * 2 + viz.rotation + ring * 0.5;
                const dotX = viz.x + Math.cos(angle) * ringRadius;
                const dotY = viz.y + Math.sin(angle) * ringRadius;
                const dotOpacity = 0.7 + 0.3 * Math.sin(time * 2 + angle * 3) * this.intensity;
                
                ctx.fillStyle = `rgba(255, 255, 255, ${dotOpacity * audioValue})`;
                ctx.beginPath();
                ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

/**
 * Podcast Symbols Layer - Displays floating podcast-related icons and symbols
 */
class PodcastSymbolsLayer {
    constructor() {
        this.symbols = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
        
        this.podcastSymbols = [
            '🎙️', '🎧', '📻', '🎵', '🎶', '🎤', '🔊', '📡',
            '📻', '🎛️', '🎚️', '🔊', '🔉', '🔈', '🔇', '⏯️'
        ];
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createSymbols();
    }
    
    createSymbols() {
        this.symbols = [];
        
        for (let i = 0; i < 12; i++) {
            this.symbols.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                symbol: this.podcastSymbols[Math.floor(Math.random() * this.podcastSymbols.length)],
                size: 16 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.03,
                opacity: 0.2 + Math.random() * 0.4,
                pulse: Math.random() * Math.PI * 2,
                float: Math.random() * Math.PI * 2
            });
        }
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        this.symbols.forEach(symbol => {
            // Update position with floating motion
            symbol.x += symbol.vx;
            symbol.y += symbol.vy + Math.sin(time + symbol.float) * 0.5;
            symbol.rotation += symbol.rotationSpeed;
            
            // Bounce off edges
            if (symbol.x < 0 || symbol.x > this.width) symbol.vx *= -1;
            if (symbol.y < 0 || symbol.y > this.height) symbol.vy *= -1;
            
            // Keep in bounds
            symbol.x = Math.max(0, Math.min(this.width, symbol.x));
            symbol.y = Math.max(0, Math.min(this.height, symbol.y));
            
            // Draw symbol
            const pulseOpacity = symbol.opacity + 0.2 * Math.sin(time * 2 + symbol.pulse) * this.intensity;
            
            ctx.save();
            ctx.translate(symbol.x, symbol.y);
            ctx.rotate(symbol.rotation);
            
            ctx.font = `${symbol.size}px Arial, sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(symbol.symbol, 0, 0);
            
            ctx.restore();
        });
    }
}

/**
 * Broadcasting Elements Layer - Creates radio waves, signal towers, and broadcasting effects
 */
class BroadcastingElementsLayer {
    constructor() {
        this.elements = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createElements();
    }
    
    createElements() {
        this.elements = [];
        
        // Create radio wave sources
        for (let i = 0; i < 4; i++) {
            this.elements.push({
                type: 'radio-wave',
                x: 100 + i * 200,
                y: 150 + Math.random() * 100,
                radius: 0,
                maxRadius: 150 + Math.random() * 100,
                speed: 0.5 + Math.random() * 1,
                opacity: 0.1 + Math.random() * 0.2,
                color: `rgba(${200 - i * 30}, ${200 - i * 30}, ${200 - i * 30}, 0.8)`,
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Create signal towers
        for (let i = 0; i < 3; i++) {
            this.elements.push({
                type: 'signal-tower',
                x: 150 + i * 250,
                y: this.height - 100,
                height: 80 + Math.random() * 60,
                width: 4 + Math.random() * 3,
                signalStrength: Math.random(),
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Create broadcasting nodes
        for (let i = 0; i < 6; i++) {
            this.elements.push({
                type: 'broadcasting-node',
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 3 + Math.random() * 4,
                connections: [],
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Create connections between broadcasting nodes
        this.elements.filter(el => el.type === 'broadcasting-node').forEach((node, index) => {
            this.elements.filter(el => el.type === 'broadcasting-node').slice(index + 1).forEach(otherNode => {
                const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + 
                    Math.pow(node.y - otherNode.y, 2)
                );
                
                if (distance < 200) {
                    node.connections.push(otherNode);
                }
            });
        });
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        this.elements.forEach(element => {
            switch (element.type) {
                case 'radio-wave':
                    this.drawRadioWave(ctx, element, time);
                    break;
                case 'signal-tower':
                    this.drawSignalTower(ctx, element, time);
                    break;
                case 'broadcasting-node':
                    this.drawBroadcastingNode(ctx, element, time);
                    break;
            }
        });
    }
    
    drawRadioWave(ctx, wave, time) {
        wave.radius += wave.speed * this.intensity;
        if (wave.radius > wave.maxRadius) {
            wave.radius = 0;
        }
        
        const pulseOpacity = wave.opacity + 0.1 * Math.sin(time * 2 + wave.pulse) * this.intensity;
        const gradient = ctx.createRadialGradient(wave.x, wave.y, 0, wave.x, wave.y, wave.radius);
        gradient.addColorStop(0, wave.color.replace(')', `, ${pulseOpacity})`));
        gradient.addColorStop(1, wave.color.replace(')', ', 0)'));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawSignalTower(ctx, tower, time) {
        const pulseOpacity = 0.6 + 0.4 * Math.sin(time * 3 + tower.pulse) * this.intensity;
        
        // Draw tower
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        ctx.fillRect(tower.x - tower.width / 2, tower.y - tower.height, tower.width, tower.height);
        
        // Draw signal waves
        for (let i = 0; i < 3; i++) {
            const waveRadius = 20 + i * 15;
            const waveOpacity = (pulseOpacity * (1 - i * 0.3)) * tower.signalStrength;
            
            ctx.strokeStyle = `rgba(180, 180, 180, ${waveOpacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(tower.x, tower.y - tower.height, waveRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    drawBroadcastingNode(ctx, node, time) {
        const pulseOpacity = 0.7 + 0.3 * Math.sin(time * 4 + node.pulse) * this.intensity;
        const pulseSize = node.size + Math.sin(time * 3 + node.pulse) * 2 * this.intensity;
        
        // Draw node
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        node.connections.forEach(connection => {
            const distance = Math.sqrt(
                Math.pow(node.x - connection.x, 2) + 
                Math.pow(node.y - connection.y, 2)
            );
            const opacity = (200 - distance) / 200 * pulseOpacity * 0.5;
            
            ctx.strokeStyle = `rgba(160, 160, 160, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connection.x, connection.y);
            ctx.stroke();
        });
    }
}

// Initialize the Podcast background when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const podcastBackground = new PodcastBackground();
    
    // Store reference globally for potential future control
    window.podcastBackground = podcastBackground;
    
    // Add console controls for debugging
    window.podcastControls = {
        setIntensity: (intensity) => podcastBackground.setAnimationIntensity(intensity),
        destroy: () => podcastBackground.destroy()
    };
    
    console.log('🎙️ Podcast Background initialized! Use window.podcastControls to control it:');
    console.log('- window.podcastControls.setIntensity(2.0)');
    console.log('- window.podcastControls.destroy()');
});
