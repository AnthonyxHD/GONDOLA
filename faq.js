document.querySelectorAll('.faq-trigger').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        item.classList.toggle('open');
        button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
});
