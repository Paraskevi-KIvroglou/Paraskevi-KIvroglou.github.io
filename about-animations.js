/**
 * AI & Mathematics Animated Background
 * Professional design system for Paraskevi Kivroglou's About page
 * Features: Neural networks, mathematical formulas, data flows, AI concepts
 */

class AIMathBackground {
    constructor() {
        this.canvas = document.getElementById('ai-math-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        this.time = 0;
        
        // Animation layers
        this.neuralNetwork = new NeuralNetworkLayer();
        this.mathematicalFormulas = new MathematicalFormulasLayer();
        this.dataFlow = new DataFlowLayer();
        this.aiConcepts = new AIConceptsLayer();
        
        // Performance settings
        this.fps = 60;
        this.frameInterval = 1000 / this.fps;
        this.lastFrameTime = 0;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Update layer dimensions
        this.neuralNetwork.resize(this.canvas.width, this.canvas.height);
        this.mathematicalFormulas.resize(this.canvas.width, this.canvas.height);
        this.dataFlow.resize(this.canvas.width, this.canvas.height);
        this.aiConcepts.resize(this.canvas.width, this.canvas.height);
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Add scroll-based animation intensity
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            this.setAnimationIntensity(1.5);
            
            scrollTimeout = setTimeout(() => {
                this.setAnimationIntensity(1.0);
            }, 300);
        });
    }
    
    setAnimationIntensity(intensity) {
        this.neuralNetwork.setIntensity(intensity);
        this.mathematicalFormulas.setIntensity(intensity);
        this.dataFlow.setIntensity(intensity);
        this.aiConcepts.setIntensity(intensity);
    }
    
    animate(currentTime = 0) {
        if (currentTime - this.lastFrameTime >= this.frameInterval) {
            this.time += 0.016; // 60fps time increment
            this.lastFrameTime = currentTime;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw layers in order (background to foreground)
            this.neuralNetwork.draw(this.ctx, this.time);
            this.mathematicalFormulas.draw(this.ctx, this.time);
            this.dataFlow.draw(this.ctx, this.time);
            this.aiConcepts.draw(this.ctx, this.time);
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
 * Neural Network Layer - Simulates AI neural connections
 */
class NeuralNetworkLayer {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createNetwork();
    }
    
    createNetwork() {
        this.nodes = [];
        this.connections = [];
        
        // Create nodes in a grid pattern
        const cols = Math.floor(this.width / 120);
        const rows = Math.floor(this.height / 120);
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                this.nodes.push({
                    x: i * 120 + 60,
                    y: j * 120 + 60,
                    radius: 2 + Math.random() * 3,
                    pulse: Math.random() * Math.PI * 2,
                    connections: []
                });
            }
        }
        
        // Create connections between nearby nodes
        this.nodes.forEach((node, index) => {
            this.nodes.slice(index + 1).forEach(otherNode => {
                const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) + 
                    Math.pow(node.y - otherNode.y, 2)
                );
                
                if (distance < 150) {
                    const connection = {
                        from: node,
                        to: otherNode,
                        strength: (150 - distance) / 150,
                        pulse: Math.random() * Math.PI * 2
                    };
                    
                    this.connections.push(connection);
                    node.connections.push(connection);
                    otherNode.connections.push(connection);
                }
            });
        });
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        // Draw connections
        this.connections.forEach(connection => {
            const pulseOpacity = 0.1 + 0.2 * Math.sin(time * 2 + connection.pulse) * this.intensity;
            const opacity = connection.strength * pulseOpacity;
            
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(connection.from.x, connection.from.y);
            ctx.lineTo(connection.to.x, connection.to.y);
            ctx.stroke();
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const pulseRadius = node.radius + Math.sin(time * 3 + node.pulse) * 1 * this.intensity;
            const pulseOpacity = 0.6 + 0.4 * Math.sin(time * 2 + node.pulse) * this.intensity;
            
            // Node glow
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, pulseRadius * 3
            );
            gradient.addColorStop(0, `rgba(100, 150, 255, ${pulseOpacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseRadius * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Node core
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

/**
 * Mathematical Formulas Layer - Displays floating mathematical expressions
 */
class MathematicalFormulasLayer {
    constructor() {
        this.formulas = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
        
        this.mathSymbols = [
            '∫', '∑', '∏', '√', '∞', '≈', '≠', '≤', '≥', '±',
            'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'φ', 'ω',
            '∇', '∂', '∆', '∈', '∉', '⊂', '⊃', '∪', '∩', '∅'
        ];
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createFormulas();
    }
    
    createFormulas() {
        this.formulas = [];
        
        for (let i = 0; i < 15; i++) {
            this.formulas.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                symbol: this.mathSymbols[Math.floor(Math.random() * this.mathSymbols.length)],
                size: 12 + Math.random() * 16,
                opacity: 0.1 + Math.random() * 0.3,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        this.formulas.forEach(formula => {
            // Update position
            formula.x += formula.vx;
            formula.y += formula.vy;
            formula.rotation += formula.rotationSpeed;
            
            // Bounce off edges
            if (formula.x < 0 || formula.x > this.width) formula.vx *= -1;
            if (formula.y < 0 || formula.y > this.height) formula.vy *= -1;
            
            // Keep in bounds
            formula.x = Math.max(0, Math.min(this.width, formula.x));
            formula.y = Math.max(0, Math.min(this.height, formula.y));
            
            // Draw formula
            const pulseOpacity = formula.opacity + 0.1 * Math.sin(time * 2 + formula.pulse) * this.intensity;
            
            ctx.save();
            ctx.translate(formula.x, formula.y);
            ctx.rotate(formula.rotation);
            
            ctx.font = `${formula.size}px 'Times New Roman', serif`;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(formula.symbol, 0, 0);
            
            ctx.restore();
        });
    }
}

/**
 * Data Flow Layer - Represents data streams and information flow
 */
class DataFlowLayer {
    constructor() {
        this.dataStreams = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createDataStreams();
    }
    
    createDataStreams() {
        this.dataStreams = [];
        
        for (let i = 0; i < 8; i++) {
            this.dataStreams.push({
                startX: Math.random() * this.width,
                startY: Math.random() * this.height,
                endX: Math.random() * this.width,
                endY: Math.random() * this.height,
                progress: Math.random(),
                speed: 0.001 + Math.random() * 0.002,
                width: 1 + Math.random() * 2,
                opacity: 0.1 + Math.random() * 0.2,
                pulse: Math.random() * Math.PI * 2,
                dataPoints: []
            });
            
            // Create data points along the stream
            const stream = this.dataStreams[i];
            const pointCount = 5 + Math.floor(Math.random() * 5);
            
            for (let j = 0; j < pointCount; j++) {
                stream.dataPoints.push({
                    progress: j / pointCount,
                    size: 2 + Math.random() * 3,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        this.dataStreams.forEach(stream => {
            stream.progress += stream.speed;
            if (stream.progress > 1) {
                stream.progress = 0;
                stream.startX = stream.endX;
                stream.startY = stream.endY;
                stream.endX = Math.random() * this.width;
                stream.endY = Math.random() * this.height;
            }
            
            // Draw stream path
            const pulseOpacity = stream.opacity + 0.1 * Math.sin(time * 3 + stream.pulse) * this.intensity;
            
            ctx.strokeStyle = `rgba(0, 255, 200, ${pulseOpacity})`;
            ctx.lineWidth = stream.width;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(stream.startX, stream.startY);
            
            // Create curved path
            const midX = (stream.startX + stream.endX) / 2;
            const midY = (stream.startY + stream.endY) / 2;
            
            ctx.quadraticCurveTo(midX, midY, stream.endX, stream.endY);
            ctx.stroke();
            
            // Draw data points
            stream.dataPoints.forEach(point => {
                const currentProgress = (stream.progress + point.progress) % 1;
                const x = stream.startX + (stream.endX - stream.startX) * currentProgress;
                const y = stream.startY + (stream.endY - stream.startY) * currentProgress;
                
                const pulseSize = point.size + Math.sin(time * 4 + point.pulse) * 1 * this.intensity;
                const pointOpacity = 0.6 + 0.4 * Math.sin(time * 2 + point.pulse) * this.intensity;
                
                ctx.fillStyle = `rgba(0, 255, 200, ${pointOpacity})`;
                ctx.beginPath();
                ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }
}

/**
 * AI Concepts Layer - Visual representations of AI concepts
 */
class AIConceptsLayer {
    constructor() {
        this.concepts = [];
        this.intensity = 1.0;
        this.width = 0;
        this.height = 0;
    }
    
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.createConcepts();
    }
    
    createConcepts() {
        this.concepts = [];
        
        // Decision trees
        for (let i = 0; i < 3; i++) {
            this.concepts.push({
                type: 'decision-tree',
                x: 100 + i * 200,
                y: 100 + Math.random() * 100,
                nodes: this.createDecisionTreeNodes(),
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Clustering patterns
        for (let i = 0; i < 4; i++) {
            this.concepts.push({
                type: 'clustering',
                x: 150 + i * 180,
                y: 300 + Math.random() * 150,
                clusters: this.createClusters(),
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // Optimization paths
        for (let i = 0; i < 2; i++) {
            this.concepts.push({
                type: 'optimization',
                x: 200 + i * 300,
                y: 500 + Math.random() * 100,
                path: this.createOptimizationPath(),
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    createDecisionTreeNodes() {
        const nodes = [];
        const levels = 3;
        
        for (let level = 0; level < levels; level++) {
            const nodesInLevel = Math.pow(2, level);
            for (let i = 0; i < nodesInLevel; i++) {
                nodes.push({
                    x: (i - (nodesInLevel - 1) / 2) * 40,
                    y: level * 50,
                    radius: 8 + Math.random() * 4,
                    connections: []
                });
            }
        }
        
        // Create connections
        for (let level = 0; level < levels - 1; level++) {
            const nodesInLevel = Math.pow(2, level);
            for (let i = 0; i < nodesInLevel; i++) {
                const parentIndex = Math.floor(i / 2);
                const childIndex = level * nodesInLevel + i;
                const nextLevelIndex = (level + 1) * Math.pow(2, level + 1) + i;
                
                if (nodes[childIndex] && nodes[nextLevelIndex]) {
                    nodes[childIndex].connections.push(nextLevelIndex);
                }
            }
        }
        
        return nodes;
    }
    
    createClusters() {
        const clusters = [];
        for (let i = 0; i < 3; i++) {
            clusters.push({
                centerX: (Math.random() - 0.5) * 80,
                centerY: (Math.random() - 0.5) * 80,
                radius: 15 + Math.random() * 20,
                points: []
            });
            
            // Add points to cluster
            for (let j = 0; j < 5 + Math.floor(Math.random() * 5); j++) {
                clusters[i].points.push({
                    x: clusters[i].centerX + (Math.random() - 0.5) * clusters[i].radius,
                    y: clusters[i].centerY + (Math.random() - 0.5) * clusters[i].radius
                });
            }
        }
        return clusters;
    }
    
    createOptimizationPath() {
        const path = [];
        const steps = 8;
        
        for (let i = 0; i < steps; i++) {
            path.push({
                x: (i - (steps - 1) / 2) * 30,
                y: Math.sin(i * 0.5) * 20 + (Math.random() - 0.5) * 10,
                size: 3 + Math.random() * 3
            });
        }
        return path;
    }
    
    setIntensity(intensity) {
        this.intensity = intensity;
    }
    
    draw(ctx, time) {
        this.concepts.forEach(concept => {
            ctx.save();
            ctx.translate(concept.x, concept.y);
            
            switch (concept.type) {
                case 'decision-tree':
                    this.drawDecisionTree(ctx, concept, time);
                    break;
                case 'clustering':
                    this.drawClustering(ctx, concept, time);
                    break;
                case 'optimization':
                    this.drawOptimization(ctx, concept, time);
                    break;
            }
            
            ctx.restore();
        });
    }
    
    drawDecisionTree(ctx, concept, time) {
        const pulseOpacity = 0.3 + 0.2 * Math.sin(time * 2 + concept.pulse) * this.intensity;
        
        // Draw connections
        concept.nodes.forEach((node, index) => {
            node.connections.forEach(connectionIndex => {
                const targetNode = concept.nodes[connectionIndex];
                if (targetNode) {
                    ctx.strokeStyle = `rgba(255, 150, 100, ${pulseOpacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(targetNode.x, targetNode.y);
                    ctx.stroke();
                }
            });
        });
        
        // Draw nodes
        concept.nodes.forEach(node => {
            const pulseRadius = node.radius + Math.sin(time * 3 + concept.pulse) * 2 * this.intensity;
            
            ctx.fillStyle = `rgba(255, 150, 100, ${pulseOpacity})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    drawClustering(ctx, concept, time) {
        const pulseOpacity = 0.3 + 0.2 * Math.sin(time * 2 + concept.pulse) * this.intensity;
        
        concept.clusters.forEach(cluster => {
            // Draw cluster center
            ctx.fillStyle = `rgba(150, 255, 150, ${pulseOpacity})`;
            ctx.beginPath();
            ctx.arc(cluster.centerX, cluster.centerY, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw cluster points
            cluster.points.forEach(point => {
                ctx.fillStyle = `rgba(150, 255, 150, ${pulseOpacity * 0.6})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }
    
    drawOptimization(ctx, concept, time) {
        const pulseOpacity = 0.3 + 0.2 * Math.sin(time * 2 + concept.pulse) * this.intensity;
        
        // Draw path
        ctx.strokeStyle = `rgba(255, 100, 255, ${pulseOpacity})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(concept.path[0].x, concept.path[0].y);
        
        for (let i = 1; i < concept.path.length; i++) {
            ctx.lineTo(concept.path[i].x, concept.path[i].y);
        }
        ctx.stroke();
        
        // Draw path points
        concept.path.forEach(point => {
            const pulseSize = point.size + Math.sin(time * 4 + concept.pulse) * 1 * this.intensity;
            
            ctx.fillStyle = `rgba(255, 100, 255, ${pulseOpacity})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Initialize the AI & Mathematics background when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const aiMathBackground = new AIMathBackground();
    
    // Store reference globally for potential future control
    window.aiMathBackground = aiMathBackground;
    
    // Add console controls for debugging
    window.aiMathControls = {
        setIntensity: (intensity) => aiMathBackground.setAnimationIntensity(intensity),
        destroy: () => aiMathBackground.destroy()
    };
    
    console.log('🧠 AI & Mathematics Background initialized! Use window.aiMathControls to control it:');
    console.log('- window.aiMathControls.setIntensity(2.0)');
    console.log('- window.aiMathControls.destroy()');
});
