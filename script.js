// Good Karma Company - Website JavaScript

// Global variables
let cart = [];
let isMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupNavigation();
    setupProductFilters();
    setupCart();
    setupNewsletterForm();
    setupSmoothScrolling();
    setupAnimations();
    loadCartFromStorage();
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        isMenuOpen = !isMenuOpen;
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (isMenuOpen) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                isMenuOpen = false;
                resetHamburger();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
            resetHamburger();
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            isMenuOpen = false;
            resetHamburger();
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

function resetHamburger() {
    const bars = document.querySelector('.hamburger').querySelectorAll('.bar');
    bars[0].style.transform = 'none';
    bars[1].style.opacity = '1';
    bars[2].style.transform = 'none';
}

// Product filtering
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter products
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Shopping cart functionality
function setupCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout');

    // Add to cart event listeners
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-product');
            addToCart(productName, button);
        });
    });

    // Cart modal event listeners
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
    });

    closeModal.addEventListener('click', closeCartModal);
    continueShoppingBtn.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
}

// Product data
const products = {
    'turmeric': { name: 'Premium Turmeric', price: 159.99 },
    'saffron': { name: 'Pure Saffron', price: 1299.99 },
    'star-anise': { name: 'Star Anise', price: 199.99 },
    'cardamom': { name: 'Green Cardamom', price: 329.99 },
    'sumac': { name: 'Sumac', price: 249.99 },
    'szechuan': { name: 'Szechuan Peppercorns', price: 269.99 }
};

function addToCart(productKey, button) {
    const product = products[productKey];
    if (!product) return;

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.key === productKey);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            key: productKey,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartUI();
    saveCartToStorage();
    showAddToCartFeedback(button);
}

function removeFromCart(productKey) {
    cart = cart.filter(item => item.key !== productKey);
    updateCartUI();
    saveCartToStorage();
}

function updateQuantity(productKey, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productKey);
        return;
    }

    const item = cart.find(item => item.key === productKey);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
        saveCartToStorage();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity('${item.key}', ${item.quantity - 1})" 
                            class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.key}', ${item.quantity + 1})" 
                            class="quantity-btn">+</button>
                    <button onclick="removeFromCart('${item.key}')" 
                            class="remove-btn">×</button>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Here you would typically integrate with a payment processor
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your order! Total: R${total.toFixed(2)}\n\nThis would redirect to payment processing in a real implementation.`);
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added! ✓';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1500);
}

// Local storage for cart persistence
function saveCartToStorage() {
    localStorage.setItem('goodKarmaCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('goodKarmaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // Simulate newsletter signup
            const submitButton = newsletterForm.querySelector('button');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.textContent = 'Subscribed! ✓';
                submitButton.style.background = '#27ae60';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 2000);
            }, 1000);
        }
    });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    [...navLinks, ...heroButtons].forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.product-card, .value-item, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Hero buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    const exploreBtn = document.querySelector('.hero-buttons .btn-primary');
    const storyBtn = document.querySelector('.hero-buttons .btn-secondary');
    
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (storyBtn) {
        storyBtn.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Website error:', e.error);
});

// Performance monitoring
window.addEventListener('load', () => {
    // Log page load time
    const loadTime = performance.now();
    console.log(`Good Karma website loaded in ${Math.round(loadTime)}ms`);
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal.style.display === 'block') {
            closeCartModal();
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Export functions for global access (needed for inline onclick handlers)
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
