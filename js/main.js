// YashStore - Main JavaScript
// Copyright © 2023 CloudNextra Solution

// App version for cache busting
const APP_VERSION = '1.0.1'; // Increment this when you deploy updates

// Check if we need to clear cache (version mismatch)
function checkForUpdates() {
    const storedVersion = localStorage.getItem('app_version');
    if (storedVersion !== APP_VERSION) {
        console.log(`New version detected: ${APP_VERSION} (was: ${storedVersion}). Clearing cache...`);
        
        // Clear only our cache items but keep cart
        const cartData = localStorage.getItem('cart');
        
        // Function to reload with cache clearing
        const reloadPage = () => {
            localStorage.clear();
            if (cartData) localStorage.setItem('cart', cartData);
            localStorage.setItem('app_version', APP_VERSION);
            
            // Force reload from server, not cache
            window.location.reload(true);
        };
        
        // Reload immediately if first visit in session
        if (!sessionStorage.getItem('page_loaded')) {
            sessionStorage.setItem('page_loaded', 'true');
            reloadPage();
        } else {
            // Store new version without forcing reload mid-session
            localStorage.setItem('app_version', APP_VERSION);
        }
    }
}

// Run version check early
checkForUpdates();

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Enhanced cart count update function that works reliably
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        // Get the latest cart data from localStorage to ensure we have fresh data
        const latestCart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Calculate total items in cart
        const totalItems = latestCart.reduce((total, item) => total + item.quantity, 0);
        
        // Update the cart count display
        cartCount.textContent = totalItems.toString();
        
        // Add a visual indicator when count changes
        cartCount.classList.add('updating');
        setTimeout(() => {
            cartCount.classList.remove('updating');
        }, 300);
        
        console.log('Cart count updated to:', totalItems);
    } else {
        console.warn('Cart count element not found');
    }
}

// Update utility function for consistent name formatting
function formatProductName(name) {
    // Ensure name is a string
    if (!name || typeof name !== 'string') return name;

    // We don't need to check for Netlify anymore as our product names are now formatted consistently
    return name;
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

// Enhanced add to cart function with fallback mechanism
async function addToCart(productId) {
    console.log('addToCart called with ID:', productId);
    
    try {
        const button = document.querySelector(`button[data-id="${productId}"]`);
        
        // Handle case where button might not be found
        if (button) {
            // Prevent double-clicking by checking if button is already in loading state
            if (button.classList.contains('loading') || button.hasAttribute('disabled')) {
                console.log('Button is already in loading state, ignoring click');
                return;
            }
            
            setLoading(button, true);
        } else {
            console.warn('Button not found for product ID:', productId);
        }
        
        // Get products from the global window object
        const product = window.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found with ID:', productId);
            throw new Error('Product not found');
        }
        
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
        
        // Use alert as fallback if showNotification is not available
        try {
            showNotification(`${product.name} added to cart!`, 'success');
        } catch (notificationError) {
            console.warn('showNotification failed, using alert instead');
            alert(`${product.name} added to cart!`);
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        try {
            showNotification('Failed to add item to cart', 'error');
        } catch (notificationError) {
            alert('Failed to add item to cart');
        }
    } finally {
        // Add a slight delay before enabling the button again
        // to prevent accidental double-clicks
        setTimeout(() => {
            const button = document.querySelector(`button[data-id="${productId}"]`);
            if (button) {
                setLoading(button, false);
            }
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
    
    // Force the cart container to be visible with !important styles
    cartContainer.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; overflow: visible !important;';
    
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
    
    let total = 0;
    
    // Create cart items
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        // Set explicit styles to ensure visibility with !important flags
        cartItem.style.cssText = 'display: grid !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 5 !important;';
        
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
    
    // Force a DOM repaint to ensure cart items are visible
    setTimeout(() => {
        document.querySelectorAll('.cart-item').forEach(item => {
            item.style.cssText = 'display: grid !important; visibility: visible !important; opacity: 1 !important; position: relative !important; z-index: 5 !important;';
        });
    }, 100);
    
    // Add event listeners with more aggressive binding
    setTimeout(() => {
        // Minus button handler
        document.querySelectorAll('.minus').forEach(button => {
            button.replaceWith(button.cloneNode(true));
            
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
            button.replaceWith(button.cloneNode(true));
            
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
            input.replaceWith(input.cloneNode(true));
            
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
            button.replaceWith(button.cloneNode(true));
            
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

// Filter products by category function
function filterProductsByCategory(category) {
    console.log(`Filtering products by category: ${category}`);
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    // Show loading state
    productsGrid.innerHTML = `
        <div class="loading-products">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Filtering products...</p>
        </div>
    `;
    
    // Get all products or filter by category
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = window.products;
    } else {
        filteredProducts = window.products.filter(product => 
            product.category && product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Display the filtered products
    setTimeout(() => {
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <p>No products found in this category. Please try another filter.</p>
                </div>
            `;
        } else {
            // Render the filtered products
            displayProducts(filteredProducts);
            
            // Add extra handling for image loading after filtering
            setTimeout(() => {
                const productImages = productsGrid.querySelectorAll('.product-image img');
                productImages.forEach(img => {
                    handleImageLoad(img);
                    
                    // Force load images that might be stuck
                    if (!img.complete || img.naturalHeight === 0) {
                        const originalSrc = img.src;
                        img.src = '';  // Reset source to trigger load
                        setTimeout(() => {
                            img.src = originalSrc;
                        }, 50);
                    }
                });
                
                // Remove loading state from product-image containers
                productsGrid.querySelectorAll('.product-image.loading').forEach(container => {
                    if (container.querySelector('img.loaded') || container.querySelector('img').complete) {
                        container.classList.remove('loading');
                    }
                });
                
                console.log(`Image loading handlers applied to ${productImages.length} filtered product images`);
            }, 200);
        }
    }, 300); // Small delay for better UX
}

// Display products on products page - optimized for performance
function displayProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    // Clear existing content immediately (don't check for existing products when explicitly filtering)
    if (filteredProducts) {
        productsGrid.innerHTML = '';
    } 
    // Check if products have already been rendered to prevent duplicates (only when not filtering)
    else if (productsGrid.querySelectorAll('.product-card').length > 0) {
        console.log('Products already rendered, skipping to prevent duplicates');
        return;
    }
    
    // Handle case where window.products might not be loaded yet
    if (!window.products || !Array.isArray(window.products)) {
        console.warn('Products data not available. Attempting to reload from source');
        
        // Try to get products directly from file
        const script = document.createElement('script');
        script.src = 'js/products-data.js';
        script.onload = function() {
            console.log('Products data reloaded, displaying products');
            // Check again if products have been rendered to prevent duplicates
            if (productsGrid.querySelectorAll('.product-card').length === 0) {
                setTimeout(() => displayProducts(filteredProducts), 200);
            }
        };
        document.head.appendChild(script);
        
        // Show loading message while waiting
        productsGrid.innerHTML = `
            <div class="loading-products">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading products...</p>
            </div>
        `;
        return;
    }
    
    // Use window.products (the global object) when no filtered products
    const productsToDisplay = filteredProducts || window.products;
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <p>No products found. Please try a different category or check back later.</p>
            </div>
        `;
        return;
    }
    
    // Clear existing content
    productsGrid.innerHTML = '';
    
    // Create a document fragment for batch DOM updates - major performance improvement
    const fragment = document.createDocumentFragment();
    
    // Process all products at once instead of with setTimeout delays
    productsToDisplay.forEach(product => {
        // Verify each product has required properties
        if (!product || !product.id || !product.name || !product.price) {
            console.error('Invalid product data:', product);
            return;
        }
        
        // Create product card element
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-product-id', product.id);
        productCard.setAttribute('data-category', product.category || 'uncategorized');
        
        // Set product card HTML with explicit product name
        productCard.innerHTML = `
            <div class="product-image loading">
                <img src="${product.image || ''}" alt="${product.name}" loading="lazy" 
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
        
        // Set up event handlers
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                addToCart(parseInt(this.getAttribute('data-id')));
            });
        }
        
        const viewDetailsBtn = productCard.querySelector('.view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function() {
                window.location.href = `product-details.html?id=${this.getAttribute('data-id')}`;
            });
        }
        
        // Add to document fragment
        fragment.appendChild(productCard);
    });
    
    // Add all products to the DOM at once - much faster than individual appends
    productsGrid.appendChild(fragment);
    console.log(`Products rendering completed. Displayed ${productsToDisplay.length} products.`);
}

// Improved image loading handler
function handleImageLoad(img) {
    // Make sure the image has the proper error handler
    if (!img.hasAttribute('onerror')) {
        img.setAttribute('onerror', "this.src='https://via.placeholder.com/300x300?text=Earrings'; this.classList.add('loaded');");
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
    } else {
        // If not complete, ensure parent has loading class
        if (img.parentElement) {
            img.parentElement.classList.add('loading');
        }
    }
}

// Enhanced product details page initialization
function initializeProductPage() {
    console.log('Initializing product details page');
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        console.log('Product ID from URL:', productId);
        
        if (!productId) {
            console.warn('No product ID found in URL parameters');
            window.location.href = 'products.html';
            return;
        }
        
        // Get product from window.products (the global object)
        const product = window.products.find(p => p.id === productId);
        
        if (!product) {
            console.error('Product not found with ID:', productId);
            window.location.href = 'products.html';
            return;
        }
        
        const productDetails = document.getElementById('product-details');
        
        if (!productDetails) {
            console.error('Product details container not found');
            return;
        }
        
        console.log('Rendering product details for:', product.name);
        
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
            
            // Add event listener for add to cart button with multiple approaches
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            
            if (addToCartBtn) {
                console.log('Found Add to Cart button, adding click listener');
                
                // Use both approaches to maximize chances of working
                addToCartBtn.onclick = function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('Add to cart button clicked (via onclick) with ID:', id);
                    addToCart(id);
                };
                
                addToCartBtn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    console.log('Add to cart button clicked (via addEventListener) with ID:', id);
                    addToCart(id);
                });
            } else {
                console.error('Add to cart button not found after DOM update');
            }
            
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
        }, 300);
    } catch (error) {
        console.error('Error initializing product page:', error);
    }
}

// Checkout page initialization
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
            // Use original name format for WhatsApp
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
        
        // WhatsApp API URL with the correct number 94771482950
        const whatsappURL = `https://wa.me/94771482950?text=${encodedMessage}`;
        
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
                console.log(`Item ${formatProductName(item.name)}: ${item.quantity} x ${item.price} = ${itemTotal}`);
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
        // Force cart display in a way that works with Netlify - use multiple attempts
        setTimeout(displayCart, 100);
        setTimeout(displayCart, 500);
        setTimeout(displayCart, 1000);
        
        // Additional more aggressive fix
        setTimeout(() => {
            // Fallback direct DOM manipulation if displayCart doesn't work
            const cartContainer = document.getElementById('cart-items');
            if (!cartContainer) return;
            
            // Force the container to display
            cartContainer.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; overflow: visible !important; z-index: 9999 !important;';
            
            // Check if cart items are showing
            if (cartContainer.querySelectorAll('.cart-item').length === 0 && cart.length > 0) {
                console.log('Using emergency fallback to show cart items');
                
                // Clear the container first
                cartContainer.innerHTML = '';
                
                // Manually add each cart item
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    
                    const cartItemHTML = `
                        <div class="cart-item" style="display: grid !important; visibility: visible !important; opacity: 1 !important; z-index: 999 !important;">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}" 
                                     onerror="this.src='https://via.placeholder.com/300x300?text=Earrings';">
                            </div>
                            <div class="cart-item-details">
                                <h3>${item.name}</h3>
                                <p class="price">Rs ${item.price.toFixed(2)}</p>
                                <div class="quantity-control">
                                    <button class="quantity-btn minus" data-id="${item.id}" style="min-height:44px;">-</button>
                                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                                    <button class="quantity-btn plus" data-id="${item.id}" style="min-height:44px;">+</button>
                                </div>
                                <button class="remove-item" data-id="${item.id}" style="min-height:44px;">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                            <div class="cart-item-price">
                                <p class="item-total">Rs ${itemTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    `;
                    
                    cartContainer.innerHTML += cartItemHTML;
                });
                
                // Update totals
                const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const cartSubtotal = document.getElementById('cart-subtotal');
                const cartTotal = document.getElementById('cart-total');
                
                if (cartSubtotal) cartSubtotal.textContent = `Rs ${total.toFixed(2)}`;
                if (cartTotal) cartTotal.textContent = `Rs ${total.toFixed(2)}`;
            }
        }, 1500);
    }
}

// Optimize the document ready handler to be more efficient
document.addEventListener('DOMContentLoaded', function() {
    // Immediate tasks that must happen right away
    updateCartCount();
    
    // Defer less critical tasks to allow page to render first
    setTimeout(() => {
        // Check if products have been loaded
        if (!window.products) {
            // Dynamically load products without blocking render
            const script = document.createElement('script');
            script.src = 'js/products-data.js';
            script.onload = initializePageFunctions;
            document.head.appendChild(script);
        } else {
            initializePageFunctions();
        }
        
        // Set up improved lazy loading
        setupEfficientLazyLoading();
        
        // Set up storage event listener
        window.addEventListener('storage', function(e) {
            if (e.key === 'cart') updateCartCount();
        });
        
        // Initialize category filters
        initializeCategoryFilters();
    }, 100);
});

// Initialize category filters
function initializeCategoryFilters() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        console.log('Setting up category filter handlers');
        
        // Initial setup of filter buttons
        categoryFilter.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update visual active state
                categoryFilter.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Filter products
                filterProductsByCategory(category);
            });
        });
        
        // Track active filter in URL for shareable filtered views
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        if (categoryParam) {
            // Find and click the matching category button
            const matchingBtn = Array.from(categoryFilter.querySelectorAll('.category-btn'))
                .find(btn => btn.getAttribute('data-category') === categoryParam);
                
            if (matchingBtn) {
                matchingBtn.click();
            }
        }
    }
}

// Separate function to initialize page-specific functions
function initializePageFunctions() {
    // Setup page-specific initializations
    const currentPage = window.location.pathname;
    console.log('Current page:', currentPage);
    
    // More robust page detection for Netlify
    const isCartPage = currentPage.includes('cart.html') || 
                       currentPage.endsWith('/cart') || 
                       currentPage.includes('/cart/');
    const isProductsPage = currentPage.includes('products.html') || 
                           currentPage.endsWith('/products') || 
                           currentPage.includes('/products/');
    
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
    
    if (isProductsPage || currentPage.endsWith('/')) {
        console.log('Initializing products page');
        // Only try to display products once to prevent duplicates
        displayProducts();
        
        // Also set up category filters
        initializeCategoryFilters();
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
}

