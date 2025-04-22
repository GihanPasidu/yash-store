// YashStore - Products Data
// Copyright © 2023 CloudNextra Solution

// Optimize products data loading to reduce memory usage

// Create a self-executing function to avoid global scope pollution
(function() {
    // Products data
    const products = [
        {
            id: 1,
            name: "Black Stud Earrings",
            price: 30.00,
            image: "https://i.pinimg.com/736x/93/ee/51/93ee51bb62b51df9e6b435201e5447c9.jpg",
            description: "Elegant black stud earrings with a minimalist design, perfect for both casual and formal occasions.",
            category: "gold"
        },
        {
            id: 2,
            name: "White Flower Earrings",
            price: 50.00,
            image: "https://i.pinimg.com/474x/cb/f8/f1/cbf8f16368fd24af8e6ed9ff776c0c41.jpg",
            description: "Delicate white flower-shaped earrings that add a touch of spring to any outfit.",
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

    // Make the products array available globally in a memory-efficient way
    window.products = products;

    // Add a global flag to indicate products are loaded
    window.productsLoaded = true;

    // Use a getter instead of a function to save memory
    Object.defineProperty(window, 'getProducts', {
        get: function() {
            return function() { return products; };
        },
        configurable: true
    });

    // Dispatch an event to notify when products are loaded
    document.dispatchEvent(new CustomEvent('productsLoaded', { detail: products }));
    
    console.log('Products data loaded, count:', products.length);
})();
