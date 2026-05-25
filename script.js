// ========== PARTICLES BACKGROUND ==========
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;
let animationId;
let isMobile = window.innerWidth <= 768;
let isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction only on desktop
        if (!isMobile) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    let count;
    if (isMobile || isLowEnd) {
        count = Math.min(30, Math.floor((canvas.width * canvas.height) / 20000));
    } else {
        count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    }
    
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawLines() {
    if (isMobile || isLowEnd) {
        return;
    }
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(102, 126, 234, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(animateParticles);
}

// Only start particles if reduced motion is not preferred and not mobile/low-end
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion && !isMobile) {
    initParticles();
    animateParticles();
}

// Single combined resize listener
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const wasMobile = isMobile;
    isMobile = newWidth <= 768;
    
    resizeCanvas();
    
    if (!prefersReducedMotion && !isMobile) {
        if (wasMobile) {
            initParticles();
            animateParticles();
        }
    } else {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
});

// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (!isMobile) {
    function updateCursor(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }

    document.addEventListener('mousemove', updateCursor, { passive: true });

    const hoverElements = document.querySelectorAll('a, button, .portfolio-item, .service-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
}

// ========== TYPING EFFECT ==========
const texts = ['un diseñador web', 'un creativo digital', 'un UI/UX designer'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
    if (!typingEl) return;
    const currentText = texts[textIndex];

    if (isDeleting) {
        typingEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 500;
    }

    setTimeout(typeEffect, speed);
}

typeEffect();

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    navToggle.innerHTML = '<span></span><span></span><span></span>';
    navToggle.style.background = 'rgba(102, 126, 234, 0.1)';
    navToggle.style.borderRadius = '50%';
    navToggle.style.width = '48px';
    navToggle.style.height = '48px';
    navToggle.style.justifyContent = 'center';
    navToggle.style.alignItems = 'center';
}

function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    navToggle.style.background = 'none';
    navToggle.style.borderRadius = '0';
    navToggle.style.width = 'auto';
    navToggle.style.height = 'auto';
    navToggle.style.justifyContent = 'flex-start';
    navToggle.style.alignItems = 'center';
    
    navToggle.innerHTML = '<span></span><span></span><span></span>';
}

navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.contains('active');
    if (isActive) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when clicking on links
document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Close menu on overlay click
navOverlay.addEventListener('click', () => {
    closeMenu();
});

// Close menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Close menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        navToggle.focus();
    }
});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== SCROLL ANIMATIONS ==========
const animateElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseInt(delay));
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

animateElements.forEach(el => observer.observe(el));

// ========== COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            let current = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current);
            }, stepTime);

            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

// ========== SCROLL TO TOP ==========
const scrollTopBtn = document.getElementById('scrollTop');

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');

// Combined single scroll handler for all scroll-based updates
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Navbar scroll state
            navbar.classList.toggle('scrolled', scrollY > 50);

            // Scroll to top button visibility
            scrollTopBtn.classList.toggle('visible', scrollY > 500);

            // Active nav link
            const scrollYWithOffset = scrollY + 200;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (link) {
                    if (scrollYWithOffset >= sectionTop && scrollYWithOffset < sectionTop + sectionHeight) {
                        link.style.color = 'var(--text-primary)';
                    } else {
                        link.style.color = 'var(--text-secondary)';
                    }
                }
            });

            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ========== PRELOADER ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});
