// YashStore - Main JavaScript
// Copyright © 2023 CloudNextra Solution

// Products data
const products = [
    {
        id: 1,
        name: "Gold Hoop Earrings",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
        description: "Elegant gold-plated hoops, perfect for everyday wear or special occasions.",
        category: "gold"
    },
    {
        id: 2,
        name: "Crystal Drop Earrings",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1587467512961-120760940315?w=500",
        description: "Sparkling crystal drop earrings that catch the light beautifully.",
        category: "crystal"
    },
    {
        id: 3,
        name: "Pearl Stud Earrings",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=500",
        description: "Classic freshwater pearl studs with sterling silver posts.",
        category: "pearl"
    },
    {
        id: 4,
        name: "Silver Statement Earrings",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500",
        description: "Bold and artistic silver statement earrings.",
        category: "silver"
    },
    {
        id: 5,
        name: "Botanical Dangle Earrings",
        price: 45.99,
        image: "https://images.unsplash.com/photo-1602283140000-f5f4a9ce8b10?w=500",
        description: "Nature-inspired dangle earrings with delicate leaf designs.",
        category: "gold"
    },
    {
        id: 6,
        name: "Minimalist Bar Studs",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1625945670624-638970dc7351?w=500",
        description: "Simple, modern bar studs in gold finish.",
        category: "gold"
    },
    {
        id: 7,
        name: "Turquoise Drop Earrings",
        price: 54.99,
        image: "https://images.unsplash.com/photo-1627293509201-cd0c2e4c4a48?w=500",
        description: "Beautiful turquoise stone drops set in silver-toned metal.",
        category: "gemstone"
    },
    {
        id: 8,
        name: "Beaded Tassel Earrings",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1633934542430-0905ccb5f050?w=500",
        description: "Colorful beaded tassel earrings that make a statement.",
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

// Add loading state handler
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.setAttribute('disabled', true);
    } else {
        element.classList.remove('loading');
        element.removeAttribute('disabled');
    }
}

// Enhance add to cart function
async function addToCart(productId) {
    const button = document.querySelector(`button[data-id="${productId}"]`);
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
        setLoading(button, false);
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
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartContainer || !cartTotal) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="products.html">Continue shopping</a>.</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <p class="item-total">Total: $${itemTotal.toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
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
}

// Add image loading handler
function handleImageLoad(img) {
    img.onerror = () => {
        img.src = 'https://via.placeholder.com/300x300?text=Product+Image';
    };
    img.onload = () => {
        img.classList.add('loaded');
    };
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
    
    productDetails.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            <div class="product-actions">
                <button id="add-to-cart-btn" class="btn" data-id="${product.id}">Add to Cart</button>
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
}

// Display products on products page
function displayProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    const productsToDisplay = filteredProducts || products;
    
    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card loading';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}?w=400&auto=format" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="view-details" data-id="${product.id}">View Details</button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        
        const img = productCard.querySelector('img');
        handleImageLoad(img);
        
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners for the new buttons
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
        
        // Here you would normally send the order to a server
        // For now, we'll just clear the cart and show a success message
        
        localStorage.removeItem('cart');
        cart = [];
        updateCartCount();
        
        window.location.href = 'order-confirmation.html';
    });
}

// Document ready functions
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count on page load
    updateCartCount();
    
    // Setup page-specific initializations
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('products.html')) {
        displayProducts();
        
        // Setup category filters if they exist
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active class
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                filterProducts(category);
            });
        });
    }
    
    if (currentPage.includes('product-details.html')) {
        initializeProductPage();
    }
    
    if (currentPage.includes('cart.html')) {
        displayCart();
    }
    
    if (currentPage.includes('checkout.html')) {
        initializeCheckout();
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
});
