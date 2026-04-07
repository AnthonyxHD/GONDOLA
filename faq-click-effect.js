const faqSection = document.querySelector('.faq-section');

if (faqSection) {
    const gondolaIcons = [
        'images/Cable Cars/Cable Car yellow.svg',
        'images/Cable Cars/Cable Car pink.svg',
        'images/Cable Cars/Cable Car green.svg',
        'images/Cable Cars/Cable Car blue.svg'
    ];

    let gondolaIndex = 0;

    faqSection.addEventListener('click', (event) => {
        const gondola = document.createElement('img');

        gondola.src = gondolaIcons[gondolaIndex];
        gondola.className = 'faq-click-gondola';

        gondola.style.left = `${event.clientX}px`;
        gondola.style.top = `${event.clientY}px`;

        document.body.appendChild(gondola);

        gondolaIndex = (gondolaIndex + 1) % gondolaIcons.length;

        setTimeout(() => {
            gondola.remove();
        }, 900);
    });
}