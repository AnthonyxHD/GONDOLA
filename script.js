function toggleCart() {
    document.getElementById('cart').classList.toggle('hidden');
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || entry.target.dataset.stepDelay || 0;
            entry.target.style.animationDelay = delay + 'ms';
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.lineup-headliner, .lineup-artist').forEach((el, i) => {
    el.dataset.delay = i * 80;
    observer.observe(el);
});

document.querySelectorAll('.ticket-header, .ticket-card, .ticket-strip').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.step').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.briefing-title, .briefing-body, .briefing-info').forEach((el, i) => {
    el.dataset.delay = i * 150;
    observer.observe(el);
});

// Altes Accordion
document.querySelectorAll('.step-header').forEach(btn => {
    btn.addEventListener('click', () => {
        const step = btn.closest('.step');
        const isOpen = step.classList.contains('open');

        document.querySelectorAll('.step').forEach(s => {
            s.classList.remove('open');
            s.querySelector('.step-header')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            step.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        item.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
});

// Info Block reveal
const infoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            infoObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('#infoBlock').forEach(el => infoObserver.observe(el));