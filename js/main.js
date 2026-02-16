/**
 * The Inspection Academy - Scholarship Landing Page
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        // Promotion start date: February 15, 2026 at midnight CST
        promotionStartDate: new Date('2026-02-15T00:00:00-06:00'),
        // Drawing date: April 1, 2026 at 6:00 PM CST
        drawingDate: new Date('2026-04-01T18:00:00-05:00'),
        // Application deadline: March 25, 2026 at 11:59 PM CDT
        applicationDeadline: new Date('2026-03-25T23:59:59-05:00'),
        // Essay word limits
        essayMinWords: 250,
        essayMaxWords: 500
    };

    // ========================================
    // COUNTDOWN TIMER
    // ========================================
    class CountdownTimer {
        constructor(targetDate, elementIds) {
            this.targetDate = targetDate;
            this.elements = {
                days: document.getElementById(elementIds.days),
                hours: document.getElementById(elementIds.hours),
                minutes: document.getElementById(elementIds.minutes),
                seconds: document.getElementById(elementIds.seconds)
            };
            this.interval = null;
        }

        start() {
            this.update();
            this.interval = setInterval(() => this.update(), 1000);
        }

        stop() {
            if (this.interval) {
                clearInterval(this.interval);
            }
        }

        update() {
            const now = new Date().getTime();
            const distance = this.targetDate.getTime() - now;

            if (distance < 0) {
                this.stop();
                this.setDisplay(0, 0, 0, 0);
                this.onComplete();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            this.setDisplay(days, hours, minutes, seconds);
        }

        setDisplay(days, hours, minutes, seconds) {
            if (this.elements.days) this.animateNumber(this.elements.days, days);
            if (this.elements.hours) this.animateNumber(this.elements.hours, hours);
            if (this.elements.minutes) this.animateNumber(this.elements.minutes, minutes);
            if (this.elements.seconds) this.animateNumber(this.elements.seconds, seconds);
        }

        animateNumber(element, value) {
            const formatted = String(value).padStart(2, '0');
            if (element.textContent !== formatted) {
                element.style.transform = 'scale(1.1)';
                element.textContent = formatted;
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 150);
            }
        }

        onComplete() {
            // Could trigger confetti or other celebration effect
            console.log('Countdown complete!');
        }
    }

    // ========================================
    // PROMOTION PHASE MANAGER
    // ========================================
    class PromotionPhaseManager {
        constructor() {
            this.isPromotionActive = new Date() >= CONFIG.promotionStartDate;
        }

        init() {
            this.updateUI();
        }

        getCountdownTarget() {
            return this.isPromotionActive ? CONFIG.drawingDate : CONFIG.promotionStartDate;
        }

        updateUI() {
            // Update countdown label and date text
            const countdownLabel = document.querySelector('.countdown-label');
            const countdownDate = document.querySelector('.countdown-date');

            if (this.isPromotionActive) {
                // Promotion is active - show drawing countdown
                if (countdownLabel) countdownLabel.textContent = 'Drawing In:';
                if (countdownDate) {
                    countdownDate.innerHTML = '<i class="fas fa-calendar-alt"></i> April 1, 2026 at 6:00 PM CST';
                }
                this.showApplyElements();
            } else {
                // Pre-launch - show start countdown
                if (countdownLabel) countdownLabel.textContent = 'Promotion Starts In:';
                if (countdownDate) {
                    countdownDate.innerHTML = '<i class="fas fa-calendar-alt"></i> Applications open February 15, 2026';
                }
                this.hideApplyElements();
            }
        }

        hideApplyElements() {
            // Hide all apply buttons
            document.querySelectorAll('.apply-btn').forEach(el => {
                el.style.display = 'none';
            });

            // Hide apply section
            const applySection = document.getElementById('apply');
            if (applySection) {
                applySection.style.display = 'none';
            }
        }

        showApplyElements() {
            // Show all apply buttons
            document.querySelectorAll('.apply-btn').forEach(el => {
                el.style.display = '';
            });

            // Show apply section
            const applySection = document.getElementById('apply');
            if (applySection) {
                applySection.style.display = '';
            }
        }
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    class ScrollAnimations {
        constructor() {
            this.animatedElements = document.querySelectorAll('.scroll-animate');
            this.observer = null;
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(
                    (entries) => this.handleIntersection(entries),
                    {
                        root: null,
                        rootMargin: '0px 0px -50px 0px',
                        threshold: 0.1
                    }
                );

                this.animatedElements.forEach(el => this.observer.observe(el));
            } else {
                // Fallback for older browsers
                this.animatedElements.forEach(el => el.classList.add('visible'));
            }
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    class MobileMenu {
        constructor() {
            this.menuBtn = document.getElementById('mobileMenuBtn');
            this.menu = document.getElementById('mobileMenu');
            this.isOpen = false;
        }

        init() {
            if (!this.menuBtn || !this.menu) return;

            this.menuBtn.addEventListener('click', () => this.toggle());

            // Close menu when clicking a link
            this.menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                    this.close();
                }
            });
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            this.menu.classList.add('active');
            this.menuBtn.innerHTML = '<i class="fas fa-times"></i>';
            this.isOpen = true;
        }

        close() {
            this.menu.classList.remove('active');
            this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            this.isOpen = false;
        }
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    class FAQAccordion {
        constructor() {
            this.items = document.querySelectorAll('.faq-item');
        }

        init() {
            this.items.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => this.toggle(item));
                }
            });
        }

        toggle(item) {
            const isActive = item.classList.contains('active');

            // Close all items
            this.items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
            }
        }
    }

    // ========================================
    // SCROLL TO TOP BUTTON
    // ========================================
    class ScrollToTop {
        constructor() {
            this.button = document.getElementById('scrollTop');
            this.threshold = 400;
        }

        init() {
            if (!this.button) return;

            window.addEventListener('scroll', () => this.handleScroll());
            this.button.addEventListener('click', () => this.scrollToTop());
        }

        handleScroll() {
            if (window.scrollY > this.threshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    class SmoothScroll {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const href = anchor.getAttribute('href');
                    if (href === '#') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const headerOffset = 80;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }


    // ========================================
    // PARTICLES BACKGROUND
    // ========================================
    class ParticlesBackground {
        constructor() {
            this.container = document.getElementById('particles');
            this.particleCount = 20;
        }

        init() {
            if (!this.container) return;

            for (let i = 0; i < this.particleCount; i++) {
                this.createParticle();
            }
        }

        createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 10 + 5;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 15;
            const opacity = Math.random() * 0.3 + 0.1;

            // Random color (gold or red tint)
            const colors = ['#b59d14', '#d98e8b', '#c75b57'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: ${Math.random() * 100}%;
                background: ${color};
                opacity: ${opacity};
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            this.container.appendChild(particle);
        }
    }

    // ========================================
    // CONFETTI EFFECT
    // ========================================
    class ConfettiEffect {
        constructor() {
            this.canvas = document.getElementById('confetti');
            this.ctx = null;
            this.particles = [];
            this.animationId = null;
        }

        init() {
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        launch(duration = 3000) {
            const colors = ['#c75b57', '#b59d14', '#d98e8b', '#d4bc3b', '#fff'];
            const particleCount = 150;

            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height - this.canvas.height,
                    r: Math.random() * 6 + 4,
                    d: Math.random() * particleCount,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    tilt: Math.floor(Math.random() * 10) - 10,
                    tiltAngle: 0,
                    tiltAngleIncrement: Math.random() * 0.07 + 0.05
                });
            }

            this.animate();

            setTimeout(() => {
                this.stop();
            }, duration);
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach((p, i) => {
                this.ctx.beginPath();
                this.ctx.lineWidth = p.r / 2;
                this.ctx.strokeStyle = p.color;
                this.ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
                this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
                this.ctx.stroke();

                p.tiltAngle += p.tiltAngleIncrement;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(0);
                p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

                if (p.y > this.canvas.height) {
                    this.particles.splice(i, 1);
                }
            });

            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(() => this.animate());
            }
        }

        stop() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            this.particles = [];
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    class HeaderScroll {
        constructor() {
            this.header = document.querySelector('.header');
            this.lastScroll = 0;
        }

        init() {
            if (!this.header) return;
            window.addEventListener('scroll', () => this.handleScroll());
        }

        handleScroll() {
            const currentScroll = window.scrollY;

            if (currentScroll > 100) {
                this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }

            this.lastScroll = currentScroll;
        }
    }

    // ========================================
    // UTM PARAMETER CAPTURE
    // ========================================
    class UTMCapture {
        init() {
            const params = new URLSearchParams(window.location.search);
            const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

            const captured = {};
            utmParams.forEach(param => {
                const value = params.get(param);
                if (value) {
                    captured[param] = value;
                }
            });

            if (Object.keys(captured).length > 0) {
                sessionStorage.setItem('utm_params', JSON.stringify(captured));
            }
        }

        getParams() {
            const stored = sessionStorage.getItem('utm_params');
            return stored ? JSON.parse(stored) : {};
        }
    }

    // ========================================
    // INITIALIZE EVERYTHING
    // ========================================
    function init() {
        // Promotion Phase Manager - determines if promotion is active
        const phaseManager = new PromotionPhaseManager();
        phaseManager.init();

        // Countdown Timer - target depends on promotion phase
        const countdown = new CountdownTimer(phaseManager.getCountdownTarget(), {
            days: 'days',
            hours: 'hours',
            minutes: 'minutes',
            seconds: 'seconds'
        });
        countdown.start();

        // Scroll Animations
        const scrollAnimations = new ScrollAnimations();
        scrollAnimations.init();

        // Mobile Menu
        const mobileMenu = new MobileMenu();
        mobileMenu.init();

        // FAQ Accordion
        const faqAccordion = new FAQAccordion();
        faqAccordion.init();

        // Scroll to Top
        const scrollToTop = new ScrollToTop();
        scrollToTop.init();

        // Smooth Scroll
        const smoothScroll = new SmoothScroll();
        smoothScroll.init();


        // Particles Background
        const particles = new ParticlesBackground();
        particles.init();

        // Confetti Effect
        window.confetti = new ConfettiEffect();
        window.confetti.init();

        // Header Scroll Effect
        const headerScroll = new HeaderScroll();
        headerScroll.init();

        // UTM Parameter Capture
        const utmCapture = new UTMCapture();
        utmCapture.init();

        // Track analytics events
        trackPageView();
    }

    // ========================================
    // ANALYTICS HELPERS
    // ========================================
    function trackPageView() {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'Scholarship Landing Page'
            });
        }
    }

    function trackFormStart() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_start', {
                form_name: 'scholarship_application'
            });
        }
    }

    function trackFormSubmit() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                event_category: 'form',
                event_label: 'scholarship_application'
            });
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Scholarship Application'
            });
        }
    }

    // Export for global access
    window.TIAScholarship = {
        trackFormStart,
        trackFormSubmit,
        launchConfetti: () => window.confetti?.launch()
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
