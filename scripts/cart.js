/* ═══════════════════════════════════════
   GONDOLA CART LOGIC
   cart.js
   ═══════════════════════════════════════ */

const TICKET_PRICE = 120;
const SERVICE_FEE_RATE = 0.05; // 5%

/* ─── Cart state ─── */
let cart = JSON.parse(localStorage.getItem('gondola_cart') || '[]');
let paymentMethod = 'card';

/* ─── On page load ─── */
document.addEventListener('DOMContentLoaded', () => {
    if (cart.length === 0) {
        cart = [{ id: 'general', name: 'General Entry', date: '22. August 2026', price: TICKET_PRICE, qty: 1 }];
        saveCart();
    }
    renderCart();

    // Reveal-Animation wie ticket.css
    const revealEls = document.querySelectorAll('.cart-header, .cart-content');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => observer.observe(el));
});

/* ─── Save cart to localStorage ─── */
function saveCart() {
    localStorage.setItem('gondola_cart', JSON.stringify(cart));
}

/* ─── Render cart items & totals ─── */
function renderCart() {
    const empty = document.getElementById('cartEmpty');
    const content = document.getElementById('cartContent');
    const list = document.getElementById('cartItemsList');

    if (cart.length === 0 || cart.every(i => i.qty === 0)) {
        empty.classList.remove('hidden');
        content.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    content.classList.remove('hidden');

    // Build item rows
    list.innerHTML = cart.filter(i => i.qty > 0).map(item => `
        <div class="cart-item" id="item-${item.id}">
            <div class="cart-item__badge">🎫</div>
            <div class="cart-item__info">
                <p class="cart-item__name">${item.name}</p>
                <p class="cart-item__sub">GONDOLA Festival · ${item.date}</p>
            </div>
            <div class="cart-item__qty">
                <button class="cart-item__qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                <span class="cart-item__qty-num">${item.qty}</span>
                <button class="cart-item__qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item__price">CHF ${(item.price * item.qty).toFixed(2)}</div>
            <button class="cart-item__remove" onclick="removeItem('${item.id}')" title="Entfernen">
                <i class="fa fa-xmark"></i>
            </button>
        </div>
    `).join('');

    updateTotals();
}

/* ─── Change quantity ─── */
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, Math.min(10, item.qty + delta));
    if (item.qty === 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    renderCart();
}

/* ─── Remove item ─── */
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

/* ─── Calculate & display totals ─── */
function updateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const fee = subtotal * SERVICE_FEE_RATE;
    const total = subtotal + fee;

    document.getElementById('summarySubtotal').textContent = `CHF ${subtotal.toFixed(2)}`;
    document.getElementById('summaryFee').textContent = `CHF ${fee.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `CHF ${total.toFixed(2)}`;
    document.getElementById('payBtnTotal').textContent = `CHF ${total.toFixed(2)}`;
}

function getTotal() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    return subtotal + subtotal * SERVICE_FEE_RATE;
}

/* ═══════════════════════════════════════
   CHECKOUT STEPS
   ═══════════════════════════════════════ */

function goToStep2() {
    const first = document.getElementById('firstName').value.trim();
    const last = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const err = document.getElementById('step1Error');

    // Validation
    if (!first || !last) { err.textContent = 'Bitte Vor- und Nachname angeben.'; return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Bitte eine gültige E-Mail-Adresse eingeben.'; return; }

    err.textContent = '';
    setStep(2);
}

function goToStep1() {
    setStep(1);
}

function processPayment() {
    const err = document.getElementById('step2Error');

    if (paymentMethod === 'card') {
        const name = document.getElementById('cardName').value.trim();
        const num = document.getElementById('cardNumber').value.replace(/\s/g,'');
        const expiry = document.getElementById('cardExpiry').value.trim();
        const cvc = document.getElementById('cardCvc').value.trim();

        if (!name) { err.textContent = 'Bitte Namen auf der Karte eingeben.'; return; }
        if (num.length !== 16 || !/^\d+$/.test(num)) { err.textContent = 'Bitte eine gültige 16-stellige Kartennummer eingeben.'; return; }
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) { err.textContent = 'Bitte Ablaufdatum eingeben (MM/JJ).'; return; }
        if (cvc.length < 3 || !/^\d+$/.test(cvc)) { err.textContent = 'Bitte gültigen CVV eingeben.'; return; }

    } else {
        const phone = document.getElementById('twintPhone').value.trim();
        if (!phone) { err.textContent = 'Bitte Handynummer für TWINT eingeben.'; return; }
    }

    err.textContent = '';

    // Simulate payment processing
    const btn = document.querySelector('#step2 .cart-btn--primary');
    btn.classList.add('cart-btn--loading');
    btn.textContent = 'Zahlung wird verarbeitet';

    setTimeout(() => {
        btn.classList.remove('cart-btn--loading');
        confirmOrder();
    }, 2000);
}

function confirmOrder() {
    const email = document.getElementById('email').value.trim();
    const total = getTotal();

    document.getElementById('confirmEmail').textContent = email;
    document.getElementById('confirmTotal').textContent = `CHF ${total.toFixed(2)}`;

    // Clear cart
    cart = [];
    saveCart();

    setStep(3);
}

/* ─── Step switcher ─── */
function setStep(n) {
    [1, 2, 3].forEach(i => {
        const step = document.getElementById(`step${i}`);
        const ind = document.getElementById(`step${i}Indicator`);
        step.classList.add('hidden');
        ind.classList.remove('cart-step--active', 'cart-step--done');
        if (i < n) ind.classList.add('cart-step--done');
    });
    document.getElementById(`step${n}`).classList.remove('hidden');
    document.getElementById(`step${n}Indicator`).classList.add('cart-step--active');
}

/* ═══════════════════════════════════════
   PAYMENT METHOD TOGGLE
   ═══════════════════════════════════════ */

function selectMethod(method) {
    paymentMethod = method;

    document.getElementById('tabCard').classList.toggle('payment-tab--active', method === 'card');
    document.getElementById('tabTwint').classList.toggle('payment-tab--active', method === 'twint');

    document.getElementById('cardForm').classList.toggle('hidden', method !== 'card');
    document.getElementById('twintForm').classList.toggle('hidden', method !== 'twint');

    document.getElementById('step2Error').textContent = '';
}

/* ═══════════════════════════════════════
   INPUT FORMATTERS
   ═══════════════════════════════════════ */

function formatCardNumber(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
    }
    input.value = val;
}

/* ═══════════════════════════════════════
   CART ICON SYNC (for index.html)
   ═══════════════════════════════════════ */

// Update cart count badge on all pages
function updateCartBadge() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}

updateCartBadge();
