class SpectrumWaveBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationId = null;
        this.timeRef = 0;
        this.waveCount = 10;
        
        this.init();
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        window.addEventListener('resize', this.handleResize);
        this.animate();
    }
    
    init() {
        this.handleResize();
    }
    
    handleResize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    animate(timestamp = 0) {
        this.timeRef = timestamp;
        this.draw();
        this.animationId = requestAnimationFrame(this.animate);
    }
    
    draw() {
        const { width, height } = this.canvas;
        
        // Clear canvas with darker background for better contrast
        this.ctx.fillStyle = '#000055'; // Darker than #000066 by ~15%
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw glow lines first (behind main lines)
        for (let i = 0; i < this.waveCount; i++) {
            this.drawGlowWave(i);
        }
        
        // Draw main lines on top
        for (let i = 0; i < this.waveCount; i++) {
            this.drawMainWave(i);
        }
    }
    
    drawMainWave(i) {
        const { width, height } = this.canvas;
        const time = this.timeRef * 0.001;
        
        // Vertical positioning and breathing motion
        const verticalSpacing = height / (this.waveCount + 1);
        const baseY = verticalSpacing * (i + 1);
        const waveOffset = i * 0.7;
        const verticalAmplitude = 20;
        const verticalMovement = Math.sin(time + waveOffset) * verticalAmplitude;
        const currentY = baseY + verticalMovement;
        
        // Movement speed for opacity variation
        const movementSpeed = Math.abs(Math.cos(time + waveOffset));
        
        // Color calculation - Dark mode spectrum
        const baseOpacity = 0.08 + i * 0.03;
        const opacity = baseOpacity + movementSpeed * 0.15;
        
        // Spectrum transition: indigo to purple
        const colorProgress = i / (this.waveCount - 1);
        const hue = 250 + colorProgress * 100; // 250 (indigo) to 350 (purple)
        const saturation = 70;
        const lightness = 60;
        
        // Set stroke style
        this.ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
        this.ctx.lineWidth = 2 + i * 0.2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'screen';
        
        this.ctx.beginPath();
        
        // Generate wave points every 20px - horizontal wave shape (not horizontal movement)
        for (let x = 0; x <= width; x += 20) {
            const normalizedX = x / width;
            
            // Static wave shape generation (creates the wavy line appearance)
            const phase1 = normalizedX * Math.PI * 2 * (1 + i * 0.15) + i * 0.5;
            const phase2 = normalizedX * Math.PI * 3 + i * 0.3;
            const amplitude = 50;
            
            // Create the wavy shape (this doesn't move horizontally)
            let waveY = Math.sin(phase1) * amplitude * (0.8 + i * 0.1);
            waveY += Math.sin(phase2) * amplitude * 0.25;
            
            // Final Y position = breathing movement + wave shape
            const y = currentY + waveY;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    drawGlowWave(i) {
        const { width, height } = this.canvas;
        const time = this.timeRef * 0.001;
        
        // Same vertical positioning and breathing motion as main waves
        const verticalSpacing = height / (this.waveCount + 1);
        const baseY = verticalSpacing * (i + 1);
        const waveOffset = i * 0.7;
        const verticalAmplitude = 20;
        const verticalMovement = Math.sin(time + waveOffset) * verticalAmplitude;
        const currentY = baseY + verticalMovement;
        
        // Movement speed for opacity
        const movementSpeed = Math.abs(Math.cos(time + waveOffset));
        
        // Glow properties
        const glowOpacity = 0.02 + movementSpeed * 0.03; // Much more subtle
        
        // Same color as main wave but for glow
        const colorProgress = i / (this.waveCount - 1);
        const hue = 250 + colorProgress * 100;
        const saturation = 100; // Higher saturation for glow
        const lightness = 70; // Brighter for glow
        
        // Set glow stroke style
        this.ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${glowOpacity})`;
        this.ctx.lineWidth = 15 + i * 3; // Much thicker for glow
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalCompositeOperation = 'screen';
        
        // Add blur for glow effect
        this.ctx.filter = 'blur(8px)';
        
        this.ctx.beginPath();
        
        // Generate wave points every 10px (denser for glow) - same static wave shape
        for (let x = 0; x <= width; x += 10) {
            const normalizedX = x / width;
            
            // Same static wave shape as main waves
            const phase1 = normalizedX * Math.PI * 2 * (1 + i * 0.15) + i * 0.5;
            const phase2 = normalizedX * Math.PI * 3 + i * 0.3;
            const amplitude = 50;
            
            // Create the same wavy shape as main waves
            let waveY = Math.sin(phase1) * amplitude * (0.8 + i * 0.1);
            waveY += Math.sin(phase2) * amplitude * 0.25;
            
            // Final Y position = breathing movement + wave shape
            const y = currentY + waveY;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        
        // Reset filter and composite mode
        this.ctx.filter = 'none';
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize the background when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const heroBackground = new SpectrumWaveBackground(canvas);
        
        // Store reference for cleanup if needed
        window.heroBackground = heroBackground;
    }
});