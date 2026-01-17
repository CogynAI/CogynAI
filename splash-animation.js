/* =====================================================
   SPLASH ANIMATION CONTROLLER - CLEAN REWRITE
   Simple, linear animation phases
   ===================================================== */

(function() {
    'use strict';
    
    // ==========================================
    // CONFIGURATION
    // ==========================================
    const TIMING = {
        LOGO_APPEAR: 1500,      // Phase 1: Logo fades in
        UNLOCK: 1200,           // Phase 2: Arms shift, rings rotate
        LIGHT_LINE: 300,        // Phase 3: Light line appears
        SPLIT: 600,             // Phase 4: Screen splits open
        BRANDING: 2500,         // Phase 5: Branding visible
        FADE_OUT: 800           // Phase 6: Fade to app
    };
    
    // ==========================================
    // MAIN CONTROLLER
    // ==========================================
    class SplashController {
        constructor() {
            this.elements = {};
            this.skipped = false;
        }
        
        // Initialize and start
        init() {
            // Get elements
            this.elements = {
                overlay: document.getElementById('splash-overlay'),
                logo: document.querySelector('.splash-logo'),
                whiteOverlay: document.querySelector('.white-overlay'),
                appLayout: document.querySelector('.app-layout')
            };
            
            // Check if splash exists
            if (!this.elements.overlay) {
                console.warn('[Splash] No overlay found');
                return;
            }
            
            // Hide app initially
            if (this.elements.appLayout) {
                this.elements.appLayout.classList.add('hidden');
            }
            
            // Setup matrix effect (simple version)
            this.createMatrixColumns();
            
            // Setup skip
            this.setupSkip();
            
            // Start animation sequence
            this.runPhases();
        }
        
        // Create matrix rain columns
        createMatrixColumns() {
            const containers = document.querySelectorAll('.matrix-bg');
            const chars = '01アイウエオカキクケコサシスセソ';
            
            containers.forEach(container => {
                for (let i = 0; i < 25; i++) {
                    const col = document.createElement('div');
                    col.className = 'matrix-column';
                    col.style.left = `${i * 4}%`;
                    col.style.animationDuration = `${3 + Math.random() * 3}s`;
                    col.style.animationDelay = `${Math.random() * 2}s`;
                    
                    let text = '';
                    for (let j = 0; j < 20; j++) {
                        text += chars[Math.floor(Math.random() * chars.length)];
                    }
                    col.textContent = text;
                    container.appendChild(col);
                }
            });
        }
        
        // Setup skip functionality
        setupSkip() {
            const skipBtn = document.querySelector('.splash-skip');
            if (skipBtn) {
                skipBtn.onclick = () => this.skip();
            }
            
            document.addEventListener('keydown', (e) => {
                if ((e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') && !this.skipped) {
                    e.preventDefault();
                    this.skip();
                }
            });
        }
        
        // Run animation phases in sequence
        async runPhases() {
            const { overlay, logo, whiteOverlay, appLayout } = this.elements;
            
            // Phase 1: Logo appears (CSS handles this)
            console.log('[Splash] Phase 1: Logo appearing');
            await this.wait(TIMING.LOGO_APPEAR);
            if (this.skipped) return;
            
            // Phase 2: Unlock sequence
            console.log('[Splash] Phase 2: Unlock');
            if (logo) logo.classList.add('unlocking');
            await this.wait(TIMING.UNLOCK);
            if (this.skipped) return;
            
            // Phase 3: Light line + fade logo
            console.log('[Splash] Phase 3: Light line');
            if (logo) logo.classList.add('fading-out');
            if (overlay) overlay.classList.add('light-active');
            await this.wait(TIMING.LIGHT_LINE);
            if (this.skipped) return;
            
            // Phase 4: Make white overlay visible, then split
            console.log('[Splash] Phase 4: Split revealing branding');
            if (whiteOverlay) whiteOverlay.classList.add('visible');
            if (overlay) overlay.classList.add('splitting');
            await this.wait(TIMING.SPLIT);
            if (this.skipped) return;
            
            // Phase 5: Branding stays visible
            console.log('[Splash] Phase 5: Branding displayed');
            // Hide the splash overlay completely
            if (overlay) overlay.style.display = 'none';
            await this.wait(TIMING.BRANDING);
            if (this.skipped) return;
            
            // Phase 6: Fade out branding, reveal app
            console.log('[Splash] Phase 6: Reveal app');
            this.revealApp();
        }
        
        // Reveal the main application
        revealApp() {
            const { whiteOverlay, appLayout } = this.elements;
            
            if (whiteOverlay) {
                whiteOverlay.classList.remove('visible');
                whiteOverlay.classList.add('fading');
            }
            
            if (appLayout) {
                appLayout.classList.remove('hidden');
                appLayout.classList.add('revealing');
            }
            
            // Cleanup after fade
            setTimeout(() => this.cleanup(), TIMING.FADE_OUT);
        }
        
        // Skip animation
        skip() {
            if (this.skipped) return;
            this.skipped = true;
            console.log('[Splash] Skipped');
            
            const { overlay, whiteOverlay, appLayout } = this.elements;
            
            // Quickly hide everything
            if (overlay) {
                overlay.classList.add('fade-out');
            }
            
            if (whiteOverlay) {
                whiteOverlay.style.transition = 'opacity 0.2s';
                whiteOverlay.style.opacity = '0';
            }
            
            if (appLayout) {
                appLayout.classList.remove('hidden');
                appLayout.style.opacity = '1';
                }
                
                setTimeout(() => this.cleanup(), 300);
        }
        
        // Clean up DOM
        cleanup() {
            console.log('[Splash] Cleanup');
            
            const { overlay, whiteOverlay, appLayout } = this.elements;
            
            if (overlay) overlay.remove();
            if (whiteOverlay) whiteOverlay.remove();
            
            if (appLayout) {
                appLayout.classList.remove('hidden', 'revealing');
                appLayout.style.opacity = '';
            }
            
            window.dispatchEvent(new CustomEvent('splashComplete'));
        }
        
        // Promise-based wait
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    
    // ==========================================
    // START
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SplashController().init());
    } else {
        new SplashController().init();
    }
})();
