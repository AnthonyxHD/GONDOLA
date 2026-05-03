/* ============================================
   MAIN SITE SCRIPT
   scripts/script.js
   
   Handles: scroll animations, navigation, cart badge,
   accordions, and IntersectionObserver patterns
   ============================================ */

/**
 * Unified scroll reveal observer with staggered animation delays
 * Triggers when elements become visible in viewport
 */
const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || entry.target.dataset.stepDelay || 0;
            entry.target.style.animationDelay = delay + 'ms';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('revealed');
            scrollRevealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

/**
 * Apply scroll reveal to lineup artists (with staggered delays)
 */
document.querySelectorAll('.lineup-headliner, .lineup-artist').forEach((el, i) => {
    el.dataset.delay = i * 80;
    scrollRevealObserver.observe(el);
});

/**
 * Apply scroll reveal to ticket section elements
 */
document.querySelectorAll('.ticket-header, .ticket-card, .ticket-strip').forEach(el => {
    scrollRevealObserver.observe(el);
});

/**
 * Apply scroll reveal to step items and info elements
 */
document.querySelectorAll('.step').forEach(el => {
    scrollRevealObserver.observe(el);
});

document.querySelectorAll('.briefing-title, .briefing-body, .briefing-info').forEach((el, i) => {
    el.dataset.delay = i * 150;
    scrollRevealObserver.observe(el);
});

/**
 * Step accordion: toggle single step open state
 * Ensures only one step open at a time
 */
document.querySelectorAll('.step-header').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = btn.closest('.step');
        const isOpen = step.classList.contains('open');

        // Close all steps
        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('open');
            s.querySelector('.step-header')?.setAttribute('aria-expanded', 'false');
        });

        // Open this step
        if (!isOpen) {
            step.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

/**
 * FAQ accordion: toggle individual item open state
 * Multiple items can be open simultaneously
 */
document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        item.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
});

/**
 * Info block reveal observer
 * Triggers fade-in animation when info section comes into view
 */
const infoBlockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            infoBlockObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('#infoBlock').forEach(el => infoBlockObserver.observe(el));

/* ============================================
   NAVIGATION + CART BADGE
   ============================================ */

/**
 * Updates cart badge count from localStorage
 * Called when page loads and whenever cart changes
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('gondola_cart') || '[]');
    const count = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

/**
 * Initialize navigation:
 * - Smooth scroll to sections via nav pills
 * - Highlight active section in nav as user scrolls
 */
function initNavigation() {
    // Handle smooth scrolling on nav link clicks
    document.querySelectorAll('.nav-pill[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Define section-to-nav-pill mappings
    const sections = [
        { id: 'hero', pill: '.nav-pill--logo' },
        { id: 'lineup', pill: '.nav-pill--acts' },
        { id: 'info', pill: '.nav-pill--gondel' },
        { id: 'ticket', pill: '.nav-pill--ticket' },
        { id: 'steps', pill: '.nav-pill--faq' }
    ];

    // Observer: highlight active nav pill as user scrolls
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-pill').forEach(p => p.classList.remove('is-active'));
                const match = sections.find(s => s.id === entry.target.id);
                if (match) document.querySelector(match.pill)?.classList.add('is-active');
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    // Attach observer to all section IDs
    sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) navObserver.observe(el);
    });
}

/**
 * Initialize on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateCartCount();
});
