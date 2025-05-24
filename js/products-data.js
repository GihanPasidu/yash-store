// YashStore - Products Data
// Copyright © 2023 CloudNextra Solution

// Optimize products data loading to reduce memory usage

// Create a self-executing function to avoid global scope pollution
(function() {
    // Products data - ensure all names are properly formatted
    const products = [
        {
            id: 1,
            name: "Black Stud Earrings",
            price: 30.00,
            image: "https://i.pinimg.com/736x/93/ee/51/93ee51bb62b51df9e6b435201e5447c9.jpg",
            description: "Elegant black stud earrings with a minimalist design, perfect for both casual and formal occasions.",
            category: "style 01"
        },
        {
            id: 2,
            name: "Flower Earrings (White)",
            price: 50.00,
            image: "https://i.pinimg.com/474x/cb/f8/f1/cbf8f16368fd24af8e6ed9ff776c0c41.jpg",
            description: "Delicate white flower-shaped earrings that add a touch of spring to any outfit.",
            category: "style 02"
        },
        {
            id: 3,
            name: "Flower Earrings (Red)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/a1/ec/cc/a1eccccc73eaa842fd6e862e262e09f9.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 02"
        },
        {
            id: 4,
            name: "Flower Earrings (Yellow)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/59/47/8b/59478b6df3a955adfb9a35bea8f354f9.jpg",
            description: "Vibrant yellow flower earrings with elegant details and comfortable fit.",
            category: "style 02"
        },
        {
            id: 5,
            name: "Flower Earrings (Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/474x/e6/53/6b/e6536b44c96b887dd3c42ec87ab50e43.jpg",
            description: "Stunning blue flower earrings with intricate design, perfect for special occasions.",
            category: "style 02"
        },
        {
            id: 6,
            name: "Flower Earrings (Pink)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/c0/b0/d3/c0b0d36c63eac04c5c253be22d567ee5.jpg",
            description: "Lovely pink flower earrings with a delicate design that complements any outfit.",
            category: "style 02"
        },
        {
            id: 7,
            name: "Flower Earrings (Light Pink)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/28/ee/90/28ee90ccb1a8b65d6f6af135e55f115e.jpg",
            description: "Subtle light pink flower earrings with elegant details for a soft feminine look.",
            category: "style 02"
        },
        {
            id: 8,
            name: "Flower Earrings (Green)",
            price: 50.00,
            image: "https://i.pinimg.com/474x/bb/87/ef/bb87efe6698cc157724939dc94254348.jpg",
            description: "Charming green flower earrings with a fresh look, perfect for spring and summer.",
            category: "style 02"
        },
        {
            id: 9,
            name: "Flower Earrings (Purple)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/e0/df/e5/e0dfe5d7bb26e3fd46da8d6307b35907.jpg",
            description: "Regal purple flower earrings with a sophisticated design for both casual and formal wear.",
            category: "style 02"
        },
        {
            id: 10,
            name: "Flower Earrings (Brown)",
            price: 50.00,
            image: "https://i.pinimg.com/474x/94/a6/99/94a699903cf4e8430bccbebc6f6289a2.jpg",
            description: "Elegant brown flower earrings with an earthy tone, perfectly complementing natural looks.",
            category: "style 02"
        },
        {
            id: 11,
            name: "Flower Earrings (Light Rose)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/de/15/bc/de15bca12a10755b2e58f4ef307567b8.jpg",
            description: "Delicate light rose flower earrings with a romantic design for a feminine touch.",
            category: "style 02"
        },
        {
            id: 12,
            name: "Flower Earrings (Rose)",
            price: 50.00,
            image: "https://i.pinimg.com/474x/3d/16/4a/3d164a634d531caff1b0cb0e93ad780c.jpg",
            description: "Beautiful rose-colored flower earrings with an elegant design for a sophisticated look.",
            category: "style 02"
        },
        {
            id: 13,
            name: "Flower Earrings (Light Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/b2/dd/22/b2dd220f9cceaf90421dd57aa80a6a32.jpg",
            description: "Serene light blue flower earrings with a calming color and delicate design.",
            category: "style 02"
        },
        {
            id: 14,
            name: "Flower Earrings (Yellow)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/61/d2/fa/61d2fa779864e7df8d126a370b8edf4a.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 15,
            name: "Flower Earrings (Brown)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/37/60/09/376009773b2636fa25c08abf91d039b3.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 16,
            name: "Flower Earrings (Light Rose)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/c7/de/a9/c7dea9d38508068472594a9bbd874eeb.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 17,
            name: "Flower Earrings (Red)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/15/fa/a4/15faa48323a4c8f79e23038545b94c01.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 18,
            name: "Flower Earrings (Light Pink)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/bd/76/be/bd76bea79f35560670a85809f48d7b27.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 19,
            name: "Flower Earrings (Light Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/ae/e1/8c/aee18c365b0087dcdcdfe3814e5ad170.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 20,
            name: "Flower Earrings (Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/27/2c/61/272c61b4817b3b662f8fa814f9c363b4.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 21,
            name: "Flower Earrings (Green)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/bd/58/61/bd58613247afe30edbdd79c9ab9f41d4.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 22,
            name: "Flower Earrings (Brown)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/b4/88/85/b4888561836bfad1ac222de627ad610f.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 23,
            name: "Flower Earrings (White)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/df/ff/b3/dfffb35df19daaf16bed50f424d9de57.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 03"
        },
        {
            id: 24,
            name: "Flower Earrings (Green)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/f1/9a/e9/f19ae943e4cbae4db8bea114032af7e3.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 25,
            name: "Flower Earrings (White)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/49/4b/aa/494baaaee8dd1ed8f330915d83a4bce7.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 26,
            name: "Flower Earrings (Light Pink)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/04/88/55/0488557f53437f51ad9934fb8b28b9bb.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 27,
            name: "Flower Earrings (Light Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/98/87/66/9887665bfbc9d446c5c9d4b76b1f82ae.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 28,
            name: "Flower Earrings (Purple)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/9e/ee/b8/9eeeb8fdcbb534f972eba4c1019821d4.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 29,
            name: "Flower Earrings (Brown)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/01/c4/96/01c496d2af27fb3024f826418b4698ff.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 30,
            name: "Flower Earrings (Red)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/f0/64/07/f06407349145fef59798a6db1bc023d8.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 31,
            name: "Flower Earrings (Light Rose)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/45/74/6a/45746a818551ce376e5284d32cf89d7d.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 32,
            name: "Flower Earrings (Yellow)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/1f/ae/2a/1fae2a23fa1fe5aad2fe5697c153f26a.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
        },
        {
            id: 33,
            name: "Flower Earrings (Blue)",
            price: 50.00,
            image: "https://i.pinimg.com/736x/b5/5a/2e/b55a2e512aa7c6a9a64f511fa170b611.jpg",
            description: "Beautiful red flower earrings with a delicate design, perfect for adding color to your style.",
            category: "style 04"
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
