/* ============================================
   GONDOLA CART LOGIC
   scripts/cart.js
   
   Handles: cart state management, rendering,
   checkout workflow, payment validation,
   and input formatting
   ============================================ */

// Constants
const TICKET_PRICE = 120;
const SERVICE_FEE_RATE = 0.05; // 5% service fee

// State
let cart = JSON.parse(localStorage.getItem('gondola_cart') || '[]');
let paymentMethod = 'card'; // 'card' or 'twint'

/**
 * Initialize cart page on load
 * - Render cart display
 * - Attach scroll reveal animation
 */
document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Attach scroll reveal animation to cart sections
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

/**
 * Persist cart to browser localStorage
 */
function saveCart() {
    localStorage.setItem('gondola_cart', JSON.stringify(cart));
    updateCartBadge(); // Keep index.html badge in sync
}

/**
 * Render cart items and show/hide empty state
 * Updates DOM with current cart contents
 */
function renderCart() {
    const empty = document.getElementById('cartEmpty');
    const content = document.getElementById('cartContent');
    const list = document.getElementById('cartItemsList');

    // Show empty state if no items with qty > 0
    const hasItems = cart.length > 0 && cart.some(i => i.qty > 0);
    
    if (!hasItems) {
        empty.classList.remove('hidden');
        content.classList.add('hidden');
        return;
    }

    empty.classList.add('hidden');
    content.classList.remove('hidden');

    // Render cart items
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

/**
 * Change item quantity
 * Removes item if qty reaches 0
 */
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

/**
 * Remove item from cart
 */
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

/**
 * Add a ticket to the cart
 * Used when cart is empty to add the default ticket
 */
function addTicket() {
    const existingItem = cart.find(i => i.id === 'general');
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: 'general',
            name: 'General Entry',
            date: '22. August 2026',
            price: TICKET_PRICE,
            qty: 1
        });
    }
    saveCart();
    renderCart();
}

/**
 * Calculate and display order totals
 * Updates summary section and pay button
 */
function updateTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const fee = subtotal * SERVICE_FEE_RATE;
    const total = subtotal + fee;

    document.getElementById('summarySubtotal').textContent = `CHF ${subtotal.toFixed(2)}`;
    document.getElementById('summaryFee').textContent = `CHF ${fee.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `CHF ${total.toFixed(2)}`;
    document.getElementById('payBtnTotal').textContent = `CHF ${total.toFixed(2)}`;
}

/**
 * Calculate total with fees (used in confirmation)
 */
function getTotal() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    return subtotal + subtotal * SERVICE_FEE_RATE;
}

/* ============================================
   CHECKOUT STEPS: STEP 1 (Contact Info)
   ============================================ */

/**
 * Validate and advance to step 2 (payment)
 * Validates: first name, last name, email format
 */
function goToStep2() {
    const first = document.getElementById('firstName').value.trim();
    const last = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const err = document.getElementById('step1Error');

    // Validation checks
    if (!first || !last) {
        err.textContent = 'Bitte Vor- und Nachname angeben.';
        return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Bitte eine gültige E-Mail-Adresse eingeben.';
        return;
    }

    err.textContent = '';
    setStep(2);
}

/**
 * Go back to step 1
 */
function goToStep1() {
    setStep(1);
}

/* ============================================
   CHECKOUT STEPS: STEP 2 (Payment)
   ============================================ */

/**
 * Validate payment method and simulate processing
 * Validates: card details (if card) or phone (if TWINT)
 */
function processPayment() {
    const err = document.getElementById('step2Error');

    if (paymentMethod === 'card') {
        // Validate card payment
        const name = document.getElementById('cardName').value.trim();
        const num = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('cardExpiry').value.trim();
        const cvc = document.getElementById('cardCvc').value.trim();

        if (!name) {
            err.textContent = 'Bitte Namen auf der Karte eingeben.';
            return;
        }
        if (num.length !== 16 || !/^\d+$/.test(num)) {
            err.textContent = 'Bitte eine gültige 16-stellige Kartennummer eingeben.';
            return;
        }
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
            err.textContent = 'Bitte Ablaufdatum eingeben (MM/JJ).';
            return;
        }
        if (cvc.length < 3 || !/^\d+$/.test(cvc)) {
            err.textContent = 'Bitte gültigen CVV eingeben.';
            return;
        }

    } else {
        // Validate TWINT payment
        const phone = document.getElementById('twintPhone').value.trim();
        if (!phone) {
            err.textContent = 'Bitte Handynummer für TWINT eingeben.';
            return;
        }
    }

    err.textContent = '';

    // Show loading state
    const btn = document.querySelector('#step2 .cart-btn--primary');
    btn.classList.add('cart-btn--loading');
    btn.textContent = 'Zahlung wird verarbeitet';

    // Simulate payment processing delay
    setTimeout(() => {
        btn.classList.remove('cart-btn--loading');
        confirmOrder();
    }, 2000);
}

/**
 * Complete order and show confirmation
 * Clears cart and advances to step 3
 */
function confirmOrder() {
    const email = document.getElementById('email').value.trim();
    const total = getTotal();

    document.getElementById('confirmEmail').textContent = email;
    document.getElementById('confirmTotal').textContent = `CHF ${total.toFixed(2)}`;

    // Clear cart after successful order
    cart = [];
    saveCart();

    setStep(3);
}

/**
 * Step switcher: Show/hide checkout steps
 * Highlights active step in progress indicator
 * @param {number} n - Step number (1, 2, or 3)
 */
function setStep(n) {
    [1, 2, 3].forEach(i => {
        const step = document.getElementById(`step${i}`);
        const ind = document.getElementById(`step${i}Indicator`);
        
        step.classList.add('hidden');
        ind.classList.remove('cart-step--active', 'cart-step--done');
        
        if (i < n) {
            ind.classList.add('cart-step--done');
        }
    });
    
    document.getElementById(`step${n}`).classList.remove('hidden');
    document.getElementById(`step${n}Indicator`).classList.add('cart-step--active');
}

/* ============================================
   PAYMENT METHOD: CARD vs TWINT
   ============================================ */

/**
 * Switch between card and TWINT payment
 * Toggles tab highlight and form visibility
 * @param {string} method - 'card' or 'twint'
 */
function selectMethod(method) {
    paymentMethod = method;

    document.getElementById('tabCard').classList.toggle('payment-tab--active', method === 'card');
    document.getElementById('tabTwint').classList.toggle('payment-tab--active', method === 'twint');

    document.getElementById('cardForm').classList.toggle('hidden', method !== 'card');
    document.getElementById('twintForm').classList.toggle('hidden', method !== 'twint');

    document.getElementById('step2Error').textContent = '';
}

/* ============================================
   INPUT FORMATTERS (Best Practice)
   ============================================ */

/**
 * Format card number input: groups of 4 digits
 * Removes spaces for storage, displays with spaces
 */
function formatCardNumber(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format expiry input to MM/YY format
 * Auto-inserts slash at position 2
 */
function formatExpiry(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2);
    }
    input.value = val;
}

/* ============================================
   CART BADGE SYNC
   ============================================ */

/**
 * Update cart count badge on all pages
 * Called whenever cart is saved
 * BEST PRACTICE: Keeps cart count in sync across pages
 */
function updateCartBadge() {
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
}
