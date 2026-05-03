/* ============================================
   FAQ CLICK EFFECT SCRIPT
   scripts/faq-click-effect.js
   
   Easter egg: Creates animated gondola icons
   on click events in the FAQ section
   ============================================ */

const faqSection = document.querySelector('.faq-section');

if (faqSection) {
    // Array of gondola SVGs to cycle through
    const gondolaIcons = [
        'images/Cable Cars/Cable Car yellow.svg',
        'images/Cable Cars/Cable Car pink.svg',
        'images/Cable Cars/Cable Car green.svg',
        'images/Cable Cars/Cable Car blue.svg'
    ];

    let gondolaIndex = 0;

    /**
     * On click in FAQ section, create animated gondola icon
     * at click position that fades out after 900ms
     * BEST PRACTICE: Creates fun user interaction feedback
     */
    faqSection.addEventListener('click', (event) => {
        const gondola = document.createElement('img');

        gondola.src = gondolaIcons[gondolaIndex];
        gondola.className = 'faq-click-gondola';

        gondola.style.left = `${event.clientX}px`;
        gondola.style.top = `${event.clientY}px`;

        document.body.appendChild(gondola);

        // Cycle to next gondola icon
        gondolaIndex = (gondolaIndex + 1) % gondolaIcons.length;

        // Remove icon after animation completes
        setTimeout(() => {
            gondola.remove();
        }, 900);
    });
}
