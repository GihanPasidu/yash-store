// YashStore - Main JavaScript
// Copyright © 2023 CloudNextra Solution

// Products data
const products = [
    {
        id: 1,
        name: "Black Earrings",
        price: 30.00,
        image: "https://i.pinimg.com/736x/93/ee/51/93ee51bb62b51df9e6b435201e5447c9.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gold"
    },
    {
        id: 2,
        name: "Flower Earrings(White)",
        price: 50.00,
        image: "https://i.pinimg.com/474x/cb/f8/f1/cbf8f16368fd24af8e6ed9ff776c0c41.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "crystal"
    },
    {
        id: 3,
        name: "Flower Earrings(Red)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/a1/ec/cc/a1eccccc73eaa842fd6e862e262e09f9.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "pearl"
    },
    {
        id: 4,
        name: "Flower Earrings(Yellow)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/59/47/8b/59478b6df3a955adfb9a35bea8f354f9.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "silver"
    },
    {
        id: 5,
        name: "Flower Earrings(Blue)",
        price: 50.00,
        image: "https://i.pinimg.com/474x/e6/53/6b/e6536b44c96b887dd3c42ec87ab50e43.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gold"
    },
    {
        id: 6,
        name: "Flower Earrings(Pink)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/c0/b0/d3/c0b0d36c63eac04c5c253be22d567ee5.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gold"
    },
    {
        id: 7,
        name: "Flower Earrings(light pink)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/28/ee/90/28ee90ccb1a8b65d6f6af135e55f115e.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gemstone"
    },
    {
        id: 8,
        name: "Flower Earrings|(Green)",
        price: 50.00,
        image: "https://i.pinimg.com/474x/bb/87/ef/bb87efe6698cc157724939dc94254348.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 9,
        name: "Flower Earrings(purple)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/e0/df/e5/e0dfe5d7bb26e3fd46da8d6307b35907.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 10,
        name: "Flower Earrings(Brown)",
        price: 50.00,
        image: "https://i.pinimg.com/474x/94/a6/99/94a699903cf4e8430bccbebc6f6289a2.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 11,
        name: "Flower Earrings(light Rose)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/de/15/bc/de15bca12a10755b2e58f4ef307567b8.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 12,
        name: "Flower Earrings(Rose)",
        price: 50.00,
        image: "https://i.pinimg.com/474x/3d/16/4a/3d164a634d531caff1b0cb0e93ad780c.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 13,
        name: "Flower Earrings(light blue)",
        price: 50.00,
        image: "https://i.pinimg.com/736x/b2/dd/22/b2dd220f9cceaf90421dd57aa80a6a32.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0).toString();
    }
}

// Improve loading state handler
function setLoading(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('disabled', true);
        
        // Store original text if it doesn't exist yet
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.innerHTML;
        }
        
        // Add loading indicator
        if (element.classList.contains('add-to-cart')) {
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        }
    } else {
        element.classList.remove('loading');
        element.removeAttribute('disabled');
        
        // Restore original text
        if (element.dataset.originalText) {
            element.innerHTML = element.dataset.originalText;
        }
    }
}

// Enhance add to cart function
async function addToCart(productId) {
    const button = document.querySelector(`button[data-id="${productId}"]`);
    
    // Prevent double-clicking by checking if button is already in loading state
    if (button.classList.contains('loading') || button.hasAttribute('disabled')) {
        return;
    }
    
    setLoading(button, true);
    
    try {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
        showNotification('Failed to add item to cart', 'error');
    } finally {
        // Add a slight delay before enabling the button again
        // to prevent accidental double-clicks
        setTimeout(() => {
            setLoading(button, false);
        }, 300);
    }
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If we're on the cart page, update the display
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

// Update quantity in cart
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
    }
    
    // If we're on the cart page, update the display
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

// Display cart on cart page
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer || !cartTotal) {
        console.error('Cart container or total element not found');
        return;
    }
    
    // Debug cart data to check if it's being loaded correctly
    console.log('Current cart contents:', cart);
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty-placeholder">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is currently empty.</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        if (cartSubtotal) cartSubtotal.textContent = 'Rs 0.00';
        cartTotal.textContent = 'Rs 0.00';
        
        // Hide checkout button if cart is empty
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        
        return;
    }
    
    // Show checkout button if items in cart
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    // Clear existing cart items
    cartContainer.innerHTML = '';
    
    // Reset any styles that might be interfering with display
    cartContainer.style.display = 'block';
    cartContainer.style.visibility = 'visible';
    cartContainer.style.opacity = '1';
    
    let total = 0;
    
    // Create cart items
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Set explicit styles to ensure visibility
        cartItem.style.display = 'grid';
        cartItem.style.visibility = 'visible';
        cartItem.style.opacity = '1';
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/300x300?text=Earrings'; this.classList.add('loaded');">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">Rs ${item.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
            <div class="cart-item-price">
                <p class="item-total">Rs ${itemTotal.toFixed(2)}</p>
            </div>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    // Update totals
    if (cartSubtotal) cartSubtotal.textContent = `Rs ${total.toFixed(2)}`;
    cartTotal.textContent = `Rs ${total.toFixed(2)}`;
    
    // Add event listeners with more aggressive binding
    setTimeout(() => {
        // Minus button handler
        document.querySelectorAll('.minus').forEach(button => {
            // Remove any existing listeners
            button.replaceWith(button.cloneNode(true));
            
            // Get the fresh element
            const newButton = document.querySelector(`.minus[data-id="${button.getAttribute('data-id')}"]`);
            if (newButton) {
                newButton.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('Minus clicked for ID:', id);
                    const item = cart.find(item => item.id === id);
                    if (item) updateQuantity(id, item.quantity - 1);
                });
            }
        });
        
        // Plus button handler
        document.querySelectorAll('.plus').forEach(button => {
            // Remove any existing listeners
            button.replaceWith(button.cloneNode(true));
            
            // Get the fresh element
            const newButton = document.querySelector(`.plus[data-id="${button.getAttribute('data-id')}"]`);
            if (newButton) {
                newButton.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('Plus clicked for ID:', id);
                    const item = cart.find(item => item.id === id);
                    if (item) updateQuantity(id, item.quantity + 1);
                });
            }
        });
        
        // Quantity input handler
        document.querySelectorAll('.quantity-input').forEach(input => {
            // Remove any existing listeners
            input.replaceWith(input.cloneNode(true));
            
            // Get the fresh element
            const newInput = document.querySelector(`.quantity-input[data-id="${input.getAttribute('data-id')}"]`);
            if (newInput) {
                newInput.addEventListener('change', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    const newQuantity = parseInt(this.value);
                    console.log('Quantity changed for ID:', id, 'New value:', newQuantity);
                    if (!isNaN(newQuantity)) updateQuantity(id, newQuantity);
                });
            }
        });
        
        // Remove button handler
        document.querySelectorAll('.remove-item').forEach(button => {
            // Remove any existing listeners
            button.replaceWith(button.cloneNode(true));
            
            // Get the fresh element
            const newButton = document.querySelector(`.remove-item[data-id="${button.getAttribute('data-id')}"]`);
            if (newButton) {
                newButton.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('Remove clicked for ID:', id);
                    removeFromCart(id);
                });
            }
        });
        
        console.log('Event listeners attached to cart controls');
    }, 100);
    
    // Add promo code functionality
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoInput = document.getElementById('promo-code');
            const discountAmount = document.getElementById('discount-amount');
            
            if (promoInput && promoInput.value.trim() !== '') {
                // Simple promo code implementation - 10% discount for "YASH10"
                if (promoInput.value.trim().toUpperCase() === 'YASH10') {
                    const discount = total * 0.1;
                    if (discountAmount) discountAmount.textContent = `Rs ${discount.toFixed(2)}`;
                    cartTotal.textContent = `Rs ${(total - discount).toFixed(2)}`;
                    showNotification('Promo code applied successfully!', 'success');
                } else {
                    showNotification('Invalid promo code', 'error');
                }
            } else {
                showNotification('Please enter a promo code', 'error');
            }
        });
    }
}

// Improved image loading handler
function handleImageLoad(img) {
    // Make sure the image has the proper error handler
    if (!img.hasAttribute('onerror')) {
        img.setAttribute('onerror', "this.src='https://via.placeholder.com/300x300?text=Earrings'");
    }
    
    // Add success handler
    img.onload = () => {
        img.classList.add('loaded');
        // Remove loading state from parent container
        if (img.parentElement && img.parentElement.classList.contains('loading')) {
            img.parentElement.classList.remove('loading');
        }
    };
    
    // If image is already complete, mark it as loaded
    if (img.complete) {
        img.classList.add('loaded');
        if (img.parentElement && img.parentElement.classList.contains('loading')) {
            img.parentElement.classList.remove('loading');
        }
    }
}

// Initialize product details page
function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    const productDetails = document.getElementById('product-details');
    
    if (!productDetails) return;
    
    // Add a slight delay to simulate loading (optional)
    setTimeout(() => {
        productDetails.innerHTML = `
            <div class="product-details">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" 
                         onerror="this.src='https://via.placeholder.com/500x500?text=Earrings'; this.classList.add('loaded');">
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <p class="price">Rs ${product.price.toFixed(2)}</p>
                    <div class="product-description">
                        <p>${product.description}</p>
                        <p>These beautiful earrings are perfect for any occasion, from casual outings to formal events. Each piece is carefully crafted to ensure the highest quality.</p>
                    </div>
                    <div class="product-features">
                        <h3>Features</h3>
                        <ul class="features-list">
                            <li>High-quality materials</li>
                            <li>Handcrafted design</li>
                            <li>Comfortable to wear</li>
                            <li>Elegant packaging</li>
                        </ul>
                    </div>
                    <div class="product-actions">
                        <button id="add-to-cart-btn" class="btn" data-id="${product.id}">Add to Cart</button>
                        <button class="wishlist-btn" title="Add to Wishlist"><i class="far fa-heart"></i></button>
                    </div>
                </div>
            </div>
        `;
        
        const img = productDetails.querySelector('img');
        handleImageLoad(img);
        
        // Add event listener for add to cart button
        document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
        
        // Add wishlist functionality (currently just visual)
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#e74c3c';
                    showNotification('Added to wishlist!', 'success');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    showNotification('Removed from wishlist', 'info');
                }
            });
        }
    }, 500);
}

// Display products on products page
function displayProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    const productsToDisplay = filteredProducts || products;
    
    // Debug info for Netlify deployment
    console.log(`Displaying ${productsToDisplay.length} products`);
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found. Please try a different category or check back later.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        // Verify each product has required properties
        if (!product || !product.id || !product.name || !product.price) {
            console.error('Invalid product data:', product);
            return;
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Ensure image path works on both local and Netlify
        const imageSrc = product.image || '';
        
        productCard.innerHTML = `
            <div class="product-image loading">
                <img src="${imageSrc}" alt="${product.name}" 
                     onerror="this.src='https://via.placeholder.com/300x300?text=Earrings'; this.classList.add('loaded');">
                <div class="product-overlay">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="view-details" data-id="${product.id}">View Details</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">Rs ${product.price.toFixed(2)}</p>
            </div>
        `;
        
        const img = productCard.querySelector('img');
        handleImageLoad(img);
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners for the buttons - make sure they're properly attached
    try {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
        
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                window.location.href = `product-details.html?id=${productId}`;
            });
        });
    } catch (error) {
        console.error('Error attaching product button events:', error);
    }
}

// Filter products by category
function filterProducts(category) {
    if (category === 'all') {
        displayProducts();
        return;
    }
    
    const filtered = products.filter(product => product.category === category);
    displayProducts(filtered);
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Mobile menu handler
document.querySelector('.mobile-menu-toggle')?.addEventListener('click', function() {
    const nav = document.querySelector('nav ul');
    this.classList.toggle('active');
    nav.classList.toggle('active');
});

// Add intersection observer for lazy loading
const observeImages = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observeImages.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => observeImages.observe(img));

// Initialize checkout
function initializeCheckout() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (!checkoutForm) return;
    
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const fullName = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        
        // Calculate cart total
        let cartTotal = 0;
        const cartItems = [];
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;
            // Format each product name with proper spacing
            const formattedName = item.name.replace(/\(([^)]+)\)/g, " ($1)");
            cartItems.push(`${formattedName} x${item.quantity} - Rs ${itemTotal.toFixed(2)}`);
        });
        
        // Create WhatsApp message
        let message = `*New Order from YashStore*\n\n`;
        message += `*Customer Details:*\n`;
        message += `Name: ${fullName}\n`;
        message += `WhatsApp: ${phone}\n\n`;
        
        message += `*Order Summary:*\n`;
        cartItems.forEach(item => {
            message += `${item}\n`;
        });
        
        message += `\n*Total Amount: Rs ${cartTotal.toFixed(2)}*`;
        
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // WhatsApp API URL with your number
        const whatsappURL = `https://wa.me/94767219661?text=${encodedMessage}`;
        
        // Clear cart
        localStorage.removeItem('cart');
        cart = [];
        updateCartCount();
        
        // Redirect to WhatsApp
        window.location.href = whatsappURL;
    });
}

// Display checkout summary
function displayCheckoutSummary() {
    console.log('Initializing checkout summary display');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutTotal) {
        console.error('Checkout total element not found');
        return;
    }
    
    try {
        // Get cart from localStorage
        const cartData = localStorage.getItem('cart');
        console.log('Cart data from localStorage:', cartData);
        
        if (!cartData) {
            console.log('No cart data found, redirecting to cart page');
            window.location.href = 'cart.html';
            return;
        }
        
        const cart = JSON.parse(cartData);
        
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            console.log('Empty cart, redirecting to cart page');
            window.location.href = 'cart.html';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            if (item && item.price && item.quantity) {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                console.log(`Item ${item.name}: ${item.quantity} x ${item.price} = ${itemTotal}`);
            }
        });
        
        console.log('Total calculated:', total);
        checkoutTotal.textContent = `Rs ${total.toFixed(2)}`;
        console.log('Checkout summary displayed successfully');
    } catch (error) {
        console.error('Error displaying checkout summary:', error);
        checkoutTotal.textContent = 'Error calculating total';
    }
}

// Improve page path detection for Netlify
function getCurrentPage() {
    const path = window.location.pathname;
    const netlifyPaths = {
        '/': 'index',
        '/index': 'index',
        '/index.html': 'index',
        '/products': 'products',
        '/products.html': 'products',
        '/cart': 'cart',
        '/cart.html': 'cart',
        '/checkout': 'checkout',
        '/checkout.html': 'checkout',
        '/product-details': 'product-details',
        '/product-details.html': 'product-details'
    };
    
    // Check if the path is in our mapping
    for (const [key, value] of Object.entries(netlifyPaths)) {
        if (path === key || path.startsWith(key + '/')) {
            return value;
        }
    }
    
    // Default to index if no match
    return 'index';
}

// Fix cart update for Netlify
function updateCartForNetlify() {
    const currentPage = getCurrentPage();
    console.log('Current page detected as:', currentPage);
    
    if (currentPage === 'cart') {
        // Force cart display in a way that works with Netlify
        setTimeout(() => {
            displayCart();
            console.log('Cart display triggered for Netlify');
            
            // For mobile, apply specific fixes
            if (window.innerWidth < 768) {
                const cartItems = document.getElementById('cart-items');
                if (cartItems) {
                    cartItems.classList.add('mobile-cart');
                    
                    // These !important styles need to be inline for Netlify
                    cartItems.setAttribute('style', 
                        'display: block !important; visibility: visible !important; opacity: 1 !important;');
                }
            }
        }, 300);
    }
}

// Document ready functions
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Setup page-specific initializations
    const currentPage = window.location.pathname;
    console.log('Current page:', currentPage);
    
    // More robust page detection for Netlify
    const isCartPage = currentPage.includes('cart.html') || 
                       currentPage.endsWith('/cart') || 
                       currentPage.includes('/cart/');
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    console.log('Is mobile device:', isMobile);
    
    if (isCartPage) {
        console.log('Initializing cart page');
        
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            displayCart();
            console.log('Cart displayed');
            
            // For mobile, enhance touch area and ensure visibility
            if (isMobile) {
                const cartItems = document.getElementById('cart-items');
                if (cartItems) {
                    cartItems.classList.add('mobile-cart');
                    cartItems.style.display = 'block !important';
                    cartItems.style.visibility = 'visible !important';
                    
                    // Force re-render of cart items for mobile
                    const cartItemElements = document.querySelectorAll('.cart-item');
                    cartItemElements.forEach(item => {
                        item.style.display = 'grid';
                        item.style.visibility = 'visible';
                        item.style.opacity = '1';
                    });
                }
            }
        }, 500);
    }
    
    if (currentPage.includes('products') || currentPage.endsWith('/')) {
        console.log('Initializing products page');
        displayProducts();
    }
    
    if (currentPage.includes('product-details.html')) {
        initializeProductPage();
    }
    
    if (currentPage.includes('checkout.html')) {
        initializeCheckout();
        displayCheckoutSummary();
    }
    
    // Add event listeners for existing add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            window.location.href = `product-details.html?id=${productId}`;
        });
    });
    
    // Fix all existing images on the page
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('onerror')) {
            img.setAttribute('onerror', "this.src='https://via.placeholder.com/300x300?text=Earrings'");
        }
        handleImageLoad(img);
    });
    
    // Mobile-specific enhancements
    if (isMobile) {
        // Make buttons more touchable
        document.querySelectorAll('button, .btn').forEach(btn => {
            if (!btn.classList.contains('quantity-btn')) {
                btn.style.minHeight = '44px';
            }
        });
        
        // Increase font sizes for better readability on small screens
        document.querySelectorAll('input, select').forEach(input => {
            input.style.fontSize = '16px'; // Prevents iOS zoom on focus
        });
    }
    
    // Netlify-specific initialization
    updateCartForNetlify();
    
    // Update cart controls to work on Netlify
    document.body.addEventListener('click', function(e) {
        // Handle plus button clicks with event delegation
        if (e.target.classList.contains('plus') || e.target.closest('.plus')) {
            const button = e.target.classList.contains('plus') ? e.target : e.target.closest('.plus');
            const id = parseInt(button.getAttribute('data-id'));
            console.log('Plus button clicked via delegation for ID:', id);
            
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity + 1);
                // Force reload for Netlify if needed
                if (getCurrentPage() === 'cart') {
                    setTimeout(displayCart, 50);
                }
            }
        }
        
        // Handle minus button clicks with event delegation
        if (e.target.classList.contains('minus') || e.target.closest('.minus')) {
            const button = e.target.classList.contains('minus') ? e.target : e.target.closest('.minus');
            const id = parseInt(button.getAttribute('data-id'));
            console.log('Minus button clicked via delegation for ID:', id);
            
            const item = cart.find(item => item.id === id);
            if (item) {
                updateQuantity(id, item.quantity - 1);
                // Force reload for Netlify if needed
                if (getCurrentPage() === 'cart') {
                    setTimeout(displayCart, 50);
                }
            }
        }
        
        // Handle remove button clicks with event delegation
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const id = parseInt(button.getAttribute('data-id'));
            console.log('Remove button clicked via delegation for ID:', id);
            
            removeFromCart(id);
            // Force reload for Netlify if needed
            if (getCurrentPage() === 'cart') {
                setTimeout(displayCart, 50);
            }
        }
    });
});
