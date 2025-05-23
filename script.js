
//imp-> //imp-> google AUTH yha se suru hai (Login and signup)
//imp-> //imp-> google AUTH yha se suru hai (Login and signup)
//imp-> //imp-> google AUTH yha se suru hai (Login and signup)
//imp-> //imp-> google AUTH yha se suru hai (Login and signup)



// Initialize Google Sign-In
// Import the functions you need from the SDKs you need
// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase configuration
// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyAX6CSLlcO66u7_9lZ9IV9K_dP8ENYETB0",
    authDomain: "login-83285.firebaseapp.com",
    projectId: "login-83285",
    storageBucket: "login-83285.firebasestorage.app",
    messagingSenderId: "274437196531",
    appId: "1:274437196531:web:7e510e520f417bd51cc586"
};

// Initialize Firebase (compat version)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Get DOM elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const closeButtons = document.querySelectorAll('.close-button');

// Show/Hide Modals
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'flex';
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
    });
});

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === signupModal) signupModal.style.display = 'none';
});

// Email/Password Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('signupName').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({
            displayName: name
        });
        console.log('Signed up:', userCredential.user);
        signupModal.style.display = 'none';
        alert('Successfully signed up!');
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
});

// Email/Password Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Logged in:', userCredential.user);
        loginModal.style.display = 'none';
        alert('Successfully logged in!');
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
});

// Google Login
document.querySelectorAll('.btn-google').forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            const result = await auth.signInWithPopup(provider);
            console.log('Google login:', result.user);
            loginModal.style.display = 'none';
            signupModal.style.display = 'none';
            alert('Successfully logged in with Google!');
        } catch (error) {
            console.error('Google login error:', error);
            alert('Google login failed: ' + error.message);
        }
    });
});

// Auth state observer
auth.onAuthStateChanged((user) => {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');

    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        userInfo.innerHTML = `
            <span>Welcome, ${user.displayName || user.email}</span>
            <button id="logoutBtn" class="auth-btn">Logout</button>
        `;

        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', () => {
            auth.signOut();
        });
    } else {
        // User is signed out
        console.log('User is signed out');
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
    }
});

//imp-> google AUTH yha takk hai (Login and signup)
//imp-> google AUTH yha takk hai (Login and signup)
//imp-> google AUTH yha takk hai (Login and signup)
//imp-> google AUTH yha takk hai (Login and signup)



// Global variables
let products = [];
let languages = [];
let cart = [];
let sessionId = generateSessionId();

// DOM elements
const featuredProductsEl = document.getElementById('featured-products');
const languageGridEl = document.getElementById('language-grid');
const productCatalogEl = document.getElementById('product-catalog');
const categoryFilterEl = document.getElementById('category-filter');
const sortFilterEl = document.getElementById('sort-filter');
const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartModal = document.getElementById('cart-modal');
const closeButton = document.querySelector('.close-button');
const checkoutButton = document.getElementById('checkout-button');
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMessageEl = document.getElementById('newsletter-message');


// Fetch data from API
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        renderCatalog(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        // Use fallback data for demo
        useFallbackProducts();
    }
}

async function fetchFeaturedProducts() {
    try {
        const response = await fetch('/api/products/featured');
        if (!response.ok) throw new Error('Failed to fetch featured products');
        const featuredProducts = await response.json();
        renderFeaturedProducts(featuredProducts);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        // Filter featured products from the fallback data
        const featuredProducts = products.filter(product => product.isFeatured);
        renderFeaturedProducts(featuredProducts);
    }
}

async function fetchLanguages() {
    try {
        const response = await fetch('/api/languages');
        if (!response.ok) throw new Error('Failed to fetch languages');
        languages = await response.json();
        renderLanguages(languages);
    } catch (error) {
        console.error('Error fetching languages:', error);
        // Use fallback data for demo
        useFallbackLanguages();
    }
}

async function fetchCart() {
    try {
        const response = await fetch(`/api/cart?sessionId=${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch cart');
        cart = await response.json();
        updateCartCount();
    } catch (error) {
        console.error('Error fetching cart:', error);
        // Use local cart for demo
        cart = [];
        updateCartCount();
    }
}

// Render functions
function renderFeaturedProducts(featuredProducts) {
    featuredProductsEl.innerHTML = '';

    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredProductsEl.appendChild(productCard);
    });
}

function renderCatalog(productsToRender) {
    productCatalogEl.innerHTML = '';

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productCatalogEl.appendChild(productCard);
    });
}

function renderLanguages(languagesToRender) {
    languageGridEl.innerHTML = '';

    languagesToRender.forEach(language => {
        const languageCard = createLanguageCard(language);
        languageGridEl.appendChild(languageCard);
    });
}

function renderCart() {
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalEl.textContent = '₹0.00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        total += (product.price * item.quantity);

        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${product.name}</h3>
                <p class="cart-item-price">${formatPrice(product.price)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus-btn" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-index="${index}">
                    <button class="quantity-btn plus-btn" data-index="${index}">+</button>
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
        `;
        cartItemsEl.appendChild(cartItemEl);
    });

    cartTotalEl.textContent = formatPrice(total);

    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

// Helper functions
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card animated-card';

    // Create badges HTML
    let badgesHtml = '';
    if (product.isFeatured) {
        badgesHtml += '<span class="product-badge badge-featured">Featured</span>';
    }
    if (product.isNewArrival) {
        badgesHtml += '<span class="product-badge badge-new">New</span>';
    }

    // Create stars HTML for rating
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span>★</span>';
    }
    if (halfStar) {
        starsHtml += '<span>⯨</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span>☆</span>';
    }

    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.name}">
        </div>
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${formatPrice(product.price)}</p>
            <div class="product-rating">
                <div class="stars">${starsHtml}</div>
                <span>(${product.reviewCount})</span>
            </div>
            <div class="product-badges">${badgesHtml}</div>
            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `;

    // Add event listener for add to cart button
    productCard.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product.id);
    });

    return productCard;
}

function createLanguageCard(language) {
    const languageCard = document.createElement('div');
    languageCard.className = 'language-card animated-card';

    languageCard.innerHTML = `
        <div class="language-icon">${getLanguageChar(language.code)}</div>
        <div class="language-details">
            <h3 class="language-name">${language.name}</h3>
            <p class="native-name">(${language.nativeName})</p>
            <p class="language-description">${language.description}</p>
        </div>
    `;

    return languageCard;
}

function formatPrice(price) {
    // Convert price in paise to rupees with thousand separators
    return '₹' + (price / 100).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
}

function getLanguageChar(code) {
    const chars = {
        'hi': 'ह',
        'bn': 'ব',
        'ta': 'த',
        'te': 'త',
        'kn': 'ಕ',
        'ml': 'മ',
        'pa': 'ਪ',
        'mr': 'म',
        'gu': 'ગ',
        'ur': 'ا',
        'or': 'ଓ'
    };
    return chars[code] || code.toUpperCase();
}

function generateSessionId() {
    return 'session_' + Math.random().toString(36).substring(2, 15);
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = totalItems;
}

// Cart operations
async function addToCart(productId) {
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        // Update quantity of existing item
        await updateCartItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId,
                    productId,
                    quantity: 1
                })
            });

            if (!response.ok) throw new Error('Failed to add item to cart');

            const newItem = await response.json();
            cart.push(newItem);
            updateCartCount();
            showMessage('Item added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Fallback for demo: add item to local cart
            const newItem = {
                id: Date.now(),
                sessionId,
                productId,
                quantity: 1
            };
            cart.push(newItem);
            updateCartCount();
            showMessage('Item added to cart!');
        }
    }
}

async function updateCartItemQuantity(itemId, quantity) {
    if (quantity < 1) return removeItemFromCart(itemId);

    try {
        const response = await fetch(`/api/cart/update/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });

        if (!response.ok) throw new Error('Failed to update cart item');

        const updatedItem = await response.json();

        // Update cart array
        const index = cart.findIndex(item => item.id === itemId);
        if (index !== -1) {
            cart[index] = updatedItem;
        }

        updateCartCount();
        renderCart();
    } catch (error) {
        console.error('Error updating cart item:', error);
        // Fallback for demo: update local cart
        const index = cart.findIndex(item => item.id === itemId);
        if (index !== -1) {
            cart[index].quantity = quantity;
        }
        updateCartCount();
        renderCart();
    }
}

async function removeItemFromCart(itemId) {
    try {
        const response = await fetch(`/api/cart/remove/${itemId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to remove cart item');

        // Remove item from cart array
        cart = cart.filter(item => item.id !== itemId);
        updateCartCount();
        renderCart();
    } catch (error) {
        console.error('Error removing cart item:', error);
        // Fallback for demo: remove from local cart
        cart = cart.filter(item => item.id !== itemId);
        updateCartCount();
        renderCart();
    }
}

// Event handlers
function decreaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const item = cart[index];
    if (item) {
        updateCartItemQuantity(item.id, item.quantity - 1);
    }
}

function increaseQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const item = cart[index];
    if (item) {
        updateCartItemQuantity(item.id, item.quantity + 1);
    }
}

function updateQuantity(e) {
    const index = parseInt(e.target.dataset.index);
    const quantity = parseInt(e.target.value);
    const item = cart[index];
    if (item && !isNaN(quantity)) {
        updateCartItemQuantity(item.id, quantity);
    }
}

function removeFromCart(e) {
    const index = parseInt(e.target.dataset.index);
    const item = cart[index];
    if (item) {
        removeItemFromCart(item.id);
    }
}

function filterAndSortProducts() {
    const category = categoryFilterEl.value;
    const sortOption = sortFilterEl.value;

    // Filter by category
    let filteredProducts = products;
    if (category) {
        filteredProducts = products.filter(product => product.category === category);
    }

    // Sort products
    filteredProducts = sortProducts(filteredProducts, sortOption);

    // Render filtered and sorted products
    renderCatalog(filteredProducts);
}

function sortProducts(productsToSort, sortOption) {
    const sortedProducts = [...productsToSort];

    switch (sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'latest':
        default:
            sortedProducts.sort((a, b) => b.isNewArrival - a.isNewArrival);
            break;
    }

    return sortedProducts;
}

function showMessage(message) {
    // Remove any existing message first to prevent stacking
    const existingMessage = document.querySelector('.cart-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Get the cart icon element for positioning
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;

    // Get the position of the cart icon
    const cartRect = cartIcon.getBoundingClientRect();

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'cart-message';
    messageEl.textContent = message;

    // Style the message
    messageEl.style.position = 'fixed';
    messageEl.style.top = (cartRect.bottom + 10) + 'px'; // 10px below the cart icon
    messageEl.style.right = (window.innerWidth - cartRect.right + cartRect.width / 2) + 'px';
    messageEl.style.backgroundColor = 'var(--primary-color)';
    messageEl.style.color = 'var(--white)';
    messageEl.style.padding = '8px 12px';
    messageEl.style.borderRadius = '4px';
    messageEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    messageEl.style.zIndex = '999';
    messageEl.style.transform = 'translateX(50%)'; // Center horizontally relative to right position
    messageEl.style.fontWeight = '500';
    messageEl.style.fontSize = '14px';
    messageEl.style.whiteSpace = 'nowrap';

    // Add a small arrow pointing up to the cart
    messageEl.style.setProperty('--arrow-size', '8px');
    messageEl.style.setProperty('--arrow-position', '50%');
    messageEl.style.setProperty('--arrow-color', 'var(--primary-color)');

    // Add arrow with ::before pseudo-element via inline <style> tag
    const style = document.createElement('style');
    style.textContent = `
        .cart-message::before {
            content: '';
            position: absolute;
            top: -8px;
            right: 50%;
            transform: translateX(50%);
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid var(--primary-color);
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(messageEl);

    // Remove the message after 2.5 seconds
    setTimeout(() => {
        messageEl.style.opacity = '0';
        messageEl.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        }, 500);
    }, 2500);
}

// Fallback data for demo
function useFallbackProducts() {
    products = [
        {
            id: 1,
            name: "Hindi Keyboard Pro",
            slug: "hindi-keyboard-pro",
            description: "Mechanical keyboard with Hindi language layout and RGB lighting. Perfect for daily typing and programming.",
            price: 649900,
            category: "keyboard",
            imageUrl: "./default_image/kanada_keyboard.png",
            rating: 4.8,
            reviewCount: 124,
            inStock: true,
            isFeatured: true,
            isNewArrival: false,
            languagesSupported: ["hi", "en"]
        },
        {
            id: 2,
            name: "Bengali Mech Keyboard",
            slug: "bengali-mech-keyboard",
            description: "Premium mechanical keyboard with Bengali character support. Features Cherry MX switches for the ultimate typing experience.",
            price: 719900,
            category: "keyboard",
            imageUrl: "./default_image/normal_keyboard.png",
            rating: 4.0,
            reviewCount: 78,
            inStock: true,
            isFeatured: true,
            isNewArrival: true,
            languagesSupported: ["bn", "en"]
        },
        {
            id: 3,
            name: "Tamil-English Combo",
            slug: "tamil-english-combo",
            description: "Keyboard and 24\" display combo with Tamil language support. Perfect for professionals who work in dual languages.",
            price: 1199900,
            category: "display_combo",
            imageUrl: "./default_image/pc.png",
            rating: 5.0,
            reviewCount: 42,
            inStock: true,
            isFeatured: true,
            isNewArrival: false,
            languagesSupported: ["ta", "en"]
        },
        {
            id: 4,
            name: "Kerala Special Edition",
            slug: "kerala-special-edition",
            description: "Special edition keyboard designed specifically for Malayalam typing. Features authentic Malayalam script layout.",
            price: 899900,
            category: "keyboard",
            imageUrl: "./default_image/2in1_with_screen-removebg-preview.png",
            rating: 4.7,
            reviewCount: 56,
            inStock: true,
            isFeatured: false,
            isNewArrival: false,
            languagesSupported: ["ml", "en"]
        }
    ];

    renderCatalog(products);
    renderFeaturedProducts(products.filter(product => product.isFeatured));
}

function useFallbackLanguages() {
    languages = [
        { id: 5, code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", description: "Special edition available" },
        { id: 2, code: "bn", name: "Bengali", nativeName: "বাংলা", description: "Full character support" },
        { id: 1, code: "hi", name: "Hindi", nativeName: "हिन्दी", description: "Most popular language" },
        { id: 3, code: "ta", name: "Tamil", nativeName: "தமிழ்", description: "Classical language" },
        { id: 4, code: "te", name: "Telugu", nativeName: "తెలుగు", description: "Complete layout" }
    ];

    renderLanguages(languages);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Fetch data
    fetchProducts();
    fetchFeaturedProducts();
    fetchLanguages();
    fetchCart();

    // Add event listeners
    categoryFilterEl.addEventListener('change', filterAndSortProducts);
    sortFilterEl.addEventListener('change', filterAndSortProducts);

    // Cart modal
    document.querySelector('.cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        renderCart();
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    checkoutButton.addEventListener('click', () => {
        alert('Thank you for your order! This is a demo website, so no actual payment will be processed.');
        cart = [];
        updateCartCount();
        cartModal.style.display = 'none';
    });

    // Newsletter form
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        newsletterMessageEl.textContent = `Thank you for subscribing with ${email}!`;
        newsletterMessageEl.style.color = 'white';
        newsletterForm.reset();
    });
});






// Scroll to Top functionality
document.addEventListener('DOMContentLoaded', function () {
    const scrollToTopButton = document.getElementById('scroll-to-top');

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top when button is clicked
    scrollToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// Hero Product Carousel Functionality
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.getElementById('heroSlider');
    const pagination = document.getElementById('heroPagination');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');

    if (!slider || !pagination) return;

    const slides = slider.querySelectorAll('.hero-slide');
    let currentIndex = 0;
    let autoSlideInterval;

    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        pagination.appendChild(dot);
    });

    // Navigation functions
    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update pagination dots
        document.querySelectorAll('.hero-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSliderPosition();
        resetAutoSlide();
    }

    function goToNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSliderPosition();
        resetAutoSlide();
    }

    function goToPrevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSliderPosition();
        resetAutoSlide();
    }

    // Set up auto-sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(goToNextSlide, 1 * 1000); // Change slide every 5 seconds
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Add event listeners to buttons
    if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
    if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);

    // Start the auto-sliding
    startAutoSlide();

    // Pause auto-sliding when hovering over the slider
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', startAutoSlide);

    // Handle touch swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            goToNextSlide(); // Swipe left
        } else if (touchEndX > touchStartX + swipeThreshold) {
            goToPrevSlide(); // Swipe right
        }
    }
});



