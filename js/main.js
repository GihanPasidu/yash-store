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
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/474x/cb/f8/f1/cbf8f16368fd24af8e6ed9ff776c0c41.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "crystal"
    },
    {
        id: 3,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/a1/ec/cc/a1eccccc73eaa842fd6e862e262e09f9.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "pearl"
    },
    {
        id: 4,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/59/47/8b/59478b6df3a955adfb9a35bea8f354f9.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "silver"
    },
    {
        id: 5,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/474x/e6/53/6b/e6536b44c96b887dd3c42ec87ab50e43.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gold"
    },
    {
        id: 6,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/c0/b0/d3/c0b0d36c63eac04c5c253be22d567ee5.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gold"
    },
    {
        id: 7,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/28/ee/90/28ee90ccb1a8b65d6f6af135e55f115e.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "gemstone"
    },
    {
        id: 8,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/474x/bb/87/ef/bb87efe6698cc157724939dc94254348.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 9,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/e0/df/e5/e0dfe5d7bb26e3fd46da8d6307b35907.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 10,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/474x/94/a6/99/94a699903cf4e8430bccbebc6f6289a2.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 11,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/736x/de/15/bc/de15bca12a10755b2e58f4ef307567b8.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 12,
        name: "Flower Earrings",
        price: 50.00,
        image: "https://i.pinimg.com/474x/3d/16/4a/3d164a634d531caff1b0cb0e93ad780c.jpg",
        description: "Simple, modern Earrings with a minimalist design.",
        category: "beaded"
    },
    {
        id: 13,
        name: "Flower Earrings",
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
    
    if (!cartContainer || !cartTotal) return;
    
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
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
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
    
    if (cartSubtotal) cartSubtotal.textContent = `Rs ${total.toFixed(2)}`;
    cartTotal.textContent = `Rs ${total.toFixed(2)}`;
    
    // Add event listeners for quantity controls and remove buttons
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) updateQuantity(id, item.quantity - 1);
        });
    });
    
    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === id);
            if (item) updateQuantity(id, item.quantity + 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            if (!isNaN(newQuantity)) updateQuantity(id, newQuantity);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
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
            cartItems.push(`${item.name} x${item.quantity} - Rs ${itemTotal.toFixed(2)}`);
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
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItems || !checkoutTotal) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/60x60?text=Earrings'">
            </div>
            <div class="checkout-item-info">
                <h3>${item.name}</h3>
                <p class="qty">Qty: ${item.quantity}</p>
            </div>
            <div class="checkout-item-price">
                Rs ${itemTotal.toFixed(2)}
            </div>
        `;
        
        checkoutItems.appendChild(checkoutItem);
    });
    
    if (checkoutSubtotal) checkoutSubtotal.textContent = `Rs ${total.toFixed(2)}`;
    checkoutTotal.textContent = `Rs ${total.toFixed(2)}`;
}

// Document ready functions
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Setup page-specific initializations
    const currentPage = window.location.pathname;
    console.log('Current page:', currentPage);
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    // More robust page detection for Netlify (handles both /products.html and /products paths)
    if (currentPage.includes('products') || currentPage.endsWith('/')) {
        console.log('Initializing products page');
        // Always display all products since filters are disabled
        displayProducts();
        
        /* Category filters temporarily disabled
        // Setup category filters if they exist
        const categoryFilters = document.querySelectorAll('.category-filter');
        if (categoryFilters.length > 0) {
            console.log('Found category filters:', categoryFilters.length);
            
            categoryFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    console.log('Filtering by category:', category);
                    
                    // Update active class
                    categoryFilters.forEach(f => f.classList.remove('active'));
                    this.classList.add('active');
                    
                    filterProducts(category);
                });
            });
        } else {
            console.log('No category filters found');
        }
        */
    }
    
    if (currentPage.includes('product-details.html')) {
        initializeProductPage();
    }
    
    if (currentPage.includes('cart.html')) {
        displayCart();
        
        // For mobile, enhance touch area
        if (isMobile) {
            const cartItems = document.getElementById('cart-items');
            if (cartItems) {
                cartItems.classList.add('mobile-cart');
            }
        }
    }
    
    if (currentPage.includes('checkout.html')) {
        initializeCheckout();
        
        // Display cart items in checkout summary
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
});
