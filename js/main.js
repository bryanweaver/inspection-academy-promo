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
    // FORM VALIDATION (for custom form fallback)
    // ========================================
    class FormValidator {
        constructor(formId) {
            this.form = document.getElementById(formId);
            this.submitBtn = document.getElementById('submitBtn');
            this.essayField = document.getElementById('essay');
            this.wordCountDisplay = document.getElementById('wordCount');
        }

        init() {
            if (!this.form) return;

            // Setup essay word counter
            if (this.essayField && this.wordCountDisplay) {
                this.essayField.addEventListener('input', () => this.updateWordCount());
            }

            // Setup phone number formatting
            const phoneField = document.getElementById('phone');
            if (phoneField) {
                phoneField.addEventListener('input', (e) => this.formatPhone(e));
            }

            // Setup zip code validation
            const zipField = document.getElementById('zipCode');
            if (zipField) {
                zipField.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
                });
            }

            // Form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));

            // Real-time validation
            this.form.querySelectorAll('input, select, textarea').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('invalid')) {
                        this.validateField(field);
                    }
                });
            });
        }

        updateWordCount() {
            const text = this.essayField.value.trim();
            const words = text ? text.split(/\s+/).filter(word => word.length > 0).length : 0;

            this.wordCountDisplay.textContent = words;

            const counter = this.wordCountDisplay.closest('.word-counter');
            counter.classList.remove('valid', 'invalid');

            if (words >= CONFIG.essayMinWords && words <= CONFIG.essayMaxWords) {
                counter.classList.add('valid');
            } else if (words > 0) {
                counter.classList.add('invalid');
            }
        }

        formatPhone(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }

            e.target.value = value;
        }

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Required check
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }

            // Email validation
            if (isValid && field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Phone validation
            if (isValid && field.type === 'tel') {
                const phoneDigits = value.replace(/\D/g, '');
                if (phoneDigits.length < 10) {
                    isValid = false;
                    errorMessage = 'Please enter a 10-digit phone number';
                }
            }

            // Zip code validation
            if (isValid && field.id === 'zipCode') {
                if (!/^\d{5}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a 5-digit zip code';
                }
            }

            // Essay word count validation
            if (isValid && field.id === 'essay') {
                const words = value.split(/\s+/).filter(word => word.length > 0).length;
                if (words < CONFIG.essayMinWords) {
                    isValid = false;
                    errorMessage = `Essay must be at least ${CONFIG.essayMinWords} words (currently: ${words} words)`;
                } else if (words > CONFIG.essayMaxWords) {
                    isValid = false;
                    errorMessage = `Essay must be no more than ${CONFIG.essayMaxWords} words (currently: ${words} words)`;
                }
            }

            // Update field state
            field.classList.remove('valid', 'invalid');
            field.classList.add(isValid ? 'valid' : 'invalid');

            // Update error message
            const errorEl = field.parentElement.querySelector('.error-message');
            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.style.display = isValid ? 'none' : 'block';
            }

            return isValid;
        }

        validateForm() {
            let isValid = true;

            this.form.querySelectorAll('input, select, textarea').forEach(field => {
                if (!this.validateField(field)) {
                    isValid = false;
                }
            });

            // Validate checkboxes
            this.form.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
                if (!checkbox.checked) {
                    isValid = false;
                    // Could show error message for checkboxes
                }
            });

            return isValid;
        }

        handleSubmit(e) {
            e.preventDefault();

            if (!this.validateForm()) {
                // Scroll to first error
                const firstError = this.form.querySelector('.invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }

            // Show loading state
            this.setLoading(true);

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                // On success, redirect to thank you page
                window.location.href = 'thank-you.html';
            }, 1500);
        }

        setLoading(loading) {
            if (!this.submitBtn) return;

            const btnText = this.submitBtn.querySelector('.btn-text');
            const btnLoading = this.submitBtn.querySelector('.btn-loading');

            if (loading) {
                this.submitBtn.disabled = true;
                if (btnText) btnText.style.display = 'none';
                if (btnLoading) btnLoading.style.display = 'inline-flex';
            } else {
                this.submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline-flex';
                if (btnLoading) btnLoading.style.display = 'none';
            }
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

        // Form Validation (for custom form)
        const formValidator = new FormValidator('scholarshipForm');
        formValidator.init();

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
