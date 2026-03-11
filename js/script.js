'use strict';

const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    function animateCursor() {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.left = curX + 'px';
        cursor.style.top  = curY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactivos = document.querySelectorAll('a, button, .project-card, .job-card, .info-card');
    interactivos.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(s => observerNav.observe(s));

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

const revealEls = document.querySelectorAll('.reveal');
const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || 0);
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            observerReveal.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach((el, i) => {
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.dataset.delay = idx * 80;
    observerReveal.observe(el);
});

const skillBars = document.querySelectorAll('.sb-fill');
const observerBars = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.dataset.width;
            fill.style.width = width + '%';
            observerBars.unobserve(fill);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => observerBars.observe(bar));

const toggleBtns = document.querySelectorAll('.btn-toggle');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.project-card');
        const details = card.querySelector('.pc-details');
        const isOpen = details.classList.toggle('open');

        btn.classList.toggle('open', isOpen);
        btn.setAttribute('aria-expanded', isOpen);
        details.setAttribute('aria-hidden', !isOpen);
        btn.firstChild.textContent = isOpen ? 'Ver menos ' : 'Ver detalles ';
    });
});

const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('[required]');
        let valid = true;
        inputs.forEach(input => {
            input.style.borderColor = '';
            if (!input.value.trim()) {
                input.style.borderColor = '#ff6b6b';
                valid = false;
            }
        });

        if (!valid) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            form.reset();
            submitBtn.textContent = 'Enviar mensaje ✈️';
            submitBtn.disabled = false;
            formSuccess.classList.add('show');
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }, 1200);
    });

    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    });
}

const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80; 
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start) + '+';
        if (start < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('.stat-num');
const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const raw = entry.target.textContent.replace('+', '');
            animateCounter(entry.target, parseInt(raw));
            observerStats.unobserve(entry.target);
        }
    });
}, { threshold: 0.8 });

statNums.forEach(n => observerStats.observe(n));
