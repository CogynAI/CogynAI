/* =====================================================
   MATRIX SPLASH ANIMATION CONTROLLER
   Handles timing, matrix effect, and unlock sequence
   with smooth horizontal split and blur reveal
   ===================================================== */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Timing (in milliseconds) - Total: ~7 seconds
        PHASE1_DURATION: 1500,    // Logo fade in
        PHASE2_DURATION: 1500,    // Unlock animation
        PHASE3_DURATION: 1000,    // Light line + horizontal split
        PHASE4_DURATION: 1200,    // White transition
        PHASE5_DURATION: 2000,    // Blur reveal
        
        // Matrix effect
        MATRIX_COLUMNS: 30,
        MATRIX_CHARS: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
        
        // Particles
        PARTICLE_COUNT: 20,
        
        // localStorage key for skip preference
        STORAGE_KEY: 'cogyn_splash_seen'
    };
    
    // Splash Animation Controller
    class SplashAnimation {
        constructor() {
            this.overlay = null;
            this.logo = null;
            this.whiteOverlay = null;
            this.appLayout = null;
            this.isSkipped = false;
            this.currentPhase = 0;
        }
        
        init() {
            this.overlay = document.getElementById('splash-overlay');
            this.logo = document.querySelector('.splash-logo');
            this.whiteOverlay = document.querySelector('.white-overlay');
            this.appLayout = document.querySelector('.app-layout');
            
            if (!this.overlay) {
                console.warn('[Splash] No splash overlay found');
                return;
            }
            
            // Ensure app layout starts blurred
            if (this.appLayout) {
                this.appLayout.classList.add('splash-blur');
            }
            
            // Check if user wants to skip
            // Uncomment below to enable skip after first visit
            // if (localStorage.getItem(CONFIG.STORAGE_KEY)) {
            //     this.skip();
            //     return;
            // }
            
            this.setupMatrixEffect();
            this.setupParticles();
            this.setupSkipButton();
            this.startAnimation();
        }
        
        setupMatrixEffect() {
            const matrixContainers = document.querySelectorAll('.matrix-bg');
            
            matrixContainers.forEach(container => {
                for (let i = 0; i < CONFIG.MATRIX_COLUMNS; i++) {
                    const column = document.createElement('div');
                    column.className = 'matrix-column';
                    column.style.left = `${(i / CONFIG.MATRIX_COLUMNS) * 100}%`;
                    column.style.animationDuration = `${3 + Math.random() * 4}s`;
                    column.style.animationDelay = `${Math.random() * 2}s`;
                    column.style.opacity = 0.3 + Math.random() * 0.5;
                    
                    // Generate random matrix text
                    let text = '';
                    const length = 15 + Math.floor(Math.random() * 20);
                    for (let j = 0; j < length; j++) {
                        text += CONFIG.MATRIX_CHARS[Math.floor(Math.random() * CONFIG.MATRIX_CHARS.length)];
                    }
                    column.textContent = text;
                    
                    container.appendChild(column);
                }
            });
        }
        
        setupParticles() {
            const logoContainer = document.querySelector('.logo-container');
            if (!logoContainer) return;
            
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${30 + Math.random() * 40}%`;
                particle.style.top = `${30 + Math.random() * 40}%`;
                particle.style.animationDelay = `${Math.random() * 3}s`;
                particle.style.animationDuration = `${2 + Math.random() * 2}s`;
                logoContainer.appendChild(particle);
            }
        }
        
        setupSkipButton() {
            const skipBtn = document.querySelector('.splash-skip');
            if (skipBtn) {
                skipBtn.addEventListener('click', () => this.skip());
            }
            
            // Also allow spacebar or Enter to skip
            this.keyHandler = (e) => {
                if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') && !this.isSkipped) {
                    e.preventDefault();
                    this.skip();
                }
            };
            document.addEventListener('keydown', this.keyHandler);
        }
        
        startAnimation() {
            console.log('[Splash] Starting animation sequence');
            this.currentPhase = 1;
            
            // Phase 1: Logo appears (handled by CSS)
            setTimeout(() => {
                if (this.isSkipped) return;
                this.startUnlockSequence();
            }, CONFIG.PHASE1_DURATION);
        }
        
        startUnlockSequence() {
            console.log('[Splash] Phase 2: Unlock sequence');
            this.currentPhase = 2;
            
            if (this.logo) {
                this.logo.classList.add('unlocking');
            }
            
            // After unlock animation, start light line
            setTimeout(() => {
                if (this.isSkipped) return;
                this.startLightLine();
            }, CONFIG.PHASE2_DURATION);
        }
        
        startLightLine() {
            console.log('[Splash] Phase 3: Light line + horizontal split');
            this.currentPhase = 3;
            
            // Fade out logo
            if (this.logo) {
                this.logo.classList.add('fading-out');
            }
            
            // Activate light line
            if (this.overlay) {
                this.overlay.classList.add('light-active');
            }
            
            // Start split after light line expands
            setTimeout(() => {
                if (this.isSkipped) return;
                this.startHorizontalSplit();
            }, 400);
        }
        
        startHorizontalSplit() {
            console.log('[Splash] Horizontal split');
            
            if (this.overlay) {
                this.overlay.classList.add('splitting');
            }
            
            // Start white transition after split begins
            setTimeout(() => {
                if (this.isSkipped) return;
                this.startWhiteTransition();
            }, CONFIG.PHASE3_DURATION - 400);
        }
        
        startWhiteTransition() {
            console.log('[Splash] Phase 4: White transition');
            this.currentPhase = 4;
            
            if (this.whiteOverlay) {
                this.whiteOverlay.classList.add('active');
            }
            
            // Start blur reveal after white is visible
            setTimeout(() => {
                if (this.isSkipped) return;
                this.startBlurReveal();
            }, CONFIG.PHASE4_DURATION * 0.6);
        }
        
        startBlurReveal() {
            console.log('[Splash] Phase 5: Blur reveal');
            this.currentPhase = 5;
            
            // Remove splash overlay
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
            
            // Start fading out white overlay
            if (this.whiteOverlay) {
                this.whiteOverlay.classList.remove('active');
                this.whiteOverlay.classList.add('fading');
            }
            
            // Start revealing the main content
            if (this.appLayout) {
                this.appLayout.classList.remove('splash-blur');
                this.appLayout.classList.add('revealing');
            }
            
            // Final cleanup after reveal completes
            setTimeout(() => {
                this.cleanup();
            }, CONFIG.PHASE5_DURATION);
        }
        
        skip() {
            if (this.isSkipped) return;
            this.isSkipped = true;
            
            console.log('[Splash] Animation skipped at phase', this.currentPhase);
            
            // Store preference (uncomment to remember skip)
            // localStorage.setItem(CONFIG.STORAGE_KEY, 'true');
            
            // Remove key handler
            if (this.keyHandler) {
                document.removeEventListener('keydown', this.keyHandler);
            }
            
            // Quick transition based on current phase
            if (this.currentPhase < 4) {
                // Still in logo/split phases - do quick fade
                if (this.overlay) {
                    this.overlay.classList.add('fade-out');
                }
                
                // Show white briefly then reveal
                if (this.whiteOverlay) {
                    this.whiteOverlay.style.transition = 'opacity 0.3s';
                    this.whiteOverlay.style.opacity = '1';
                    
                    setTimeout(() => {
                        this.whiteOverlay.style.opacity = '0';
                    }, 200);
                }
                
                // Quick reveal of main content
                if (this.appLayout) {
                    this.appLayout.classList.remove('splash-blur');
                    this.appLayout.style.transition = 'filter 0.5s, opacity 0.5s, transform 0.5s';
                    this.appLayout.style.filter = 'blur(0)';
                    this.appLayout.style.opacity = '1';
                    this.appLayout.style.transform = 'scale(1)';
                }
                
                setTimeout(() => this.cleanup(), 500);
            } else {
                // Already in white/reveal phase - just speed up
                if (this.whiteOverlay) {
                    this.whiteOverlay.style.transition = 'opacity 0.3s';
                    this.whiteOverlay.style.opacity = '0';
                }
                
                if (this.appLayout) {
                    this.appLayout.classList.remove('splash-blur', 'revealing');
                    this.appLayout.style.filter = 'blur(0)';
                    this.appLayout.style.opacity = '1';
                    this.appLayout.style.transform = 'scale(1)';
                }
                
                setTimeout(() => this.cleanup(), 300);
            }
        }
        
        cleanup() {
            console.log('[Splash] Cleanup');
            
            // Remove overlay from DOM
            if (this.overlay) {
                this.overlay.remove();
            }
            
            // Remove white overlay
            if (this.whiteOverlay) {
                this.whiteOverlay.remove();
            }
            
            // Clean up app layout classes
            if (this.appLayout) {
                this.appLayout.classList.remove('splash-blur', 'revealing');
                this.appLayout.style.filter = '';
                this.appLayout.style.opacity = '';
                this.appLayout.style.transform = '';
                this.appLayout.style.transition = '';
            }
            
            // Remove key handler
            if (this.keyHandler) {
                document.removeEventListener('keydown', this.keyHandler);
            }
            
            // Dispatch event for any listeners
            window.dispatchEvent(new CustomEvent('splashComplete'));
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const splash = new SplashAnimation();
            splash.init();
        });
    } else {
        const splash = new SplashAnimation();
        splash.init();
    }
})();
