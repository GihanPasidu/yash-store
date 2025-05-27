/**
 * YashStore Admin Dashboard
 * Handles dashboard functionality and product management
 */

// Global variables
let allProducts = [];
let currentProductId = null;
let currentCategoryId = null;
let deleteType = null; // 'product' or 'category'
const categories = ['style 01', 'style 02', 'style 03', 'style 04'];

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize products data
    initializeProducts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Setup navigation
    setupNavigation();
    
    // Initialize theme management
    initThemeManagement();
});

/**
 * Initialize theme management
 */
function initThemeManagement() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeColorMeta = document.getElementById('theme-color-meta');
    
    // Function to set theme
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            if (themeColorMeta) themeColorMeta.content = '#121212';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            if (themeColorMeta) themeColorMeta.content = '#ffffff';
        }
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to light theme
        setTheme('light');
    }
    
    // Handle theme toggle button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
}

/**
 * Initialize products data from products-data.js
 */
function initializeProducts() {
    // Check if products are available in the window object (loaded from products-data.js)
    if (typeof window.products !== 'undefined' && Array.isArray(window.products)) {
        allProducts = window.products;
        displayProducts();
        displayCategories();
        updateStats();
    } else {
        // If products are not available, try to extract them from the products-data.js file
        console.error('Products data not available. Please ensure products-data.js is loaded correctly.');
        fetchProductsFromFile();
    }
}

/**
 * Attempt to fetch products from the products-data.js file
 */
function fetchProductsFromFile() {
    fetch('../js/products-data.js')
        .then(response => response.text())
        .then(data => {
            // Extract products array from the file content
            const productsMatch = data.match(/const products = (\[[\s\S]*?\]);/);
            if (productsMatch && productsMatch[1]) {
                try {
                    // Convert the matched string to a JavaScript object
                    const productsData = eval(productsMatch[1]);
                    allProducts = productsData;
                    displayProducts();
                    displayCategories();
                    updateStats();
                } catch (error) {
                    console.error('Error parsing products data:', error);
                    showNotification('Failed to load products data', 'error');
                }
            } else {
                console.error('Could not find products data in the file');
                showNotification('Failed to load products data', 'error');
            }
        })
        .catch(error => {
            console.error('Error fetching products data:', error);
            showNotification('Failed to load products data', 'error');
        });
}

/**
 * Set up navigation between different sections
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get section ID from data attribute
            const section = this.getAttribute('data-section');
            
            // Remove active class from all items and sections
            navItems.forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.admin-main').forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked item and show corresponding section
            this.classList.add('active');
            document.getElementById(`${section}-section`).classList.add('active');
            
            // If we're switching to categories, make sure they're displayed
            if (section === 'categories') {
                displayCategories();
            }
        });
    });
}

/**
 * Set up event listeners for the dashboard
 */
function setupEventListeners() {
    // Product search
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterProducts(searchTerm);
        });
    }
    
    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }
    
    // Add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', openAddCategoryModal);
    }
    
    // Import/Export button
    const importExportBtn = document.getElementById('import-export-btn');
    if (importExportBtn) {
        importExportBtn.addEventListener('click', openImportExportModal);
    }
    
    // Product form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductFormSubmit);
    }
    
    // Category form submission
    const categoryForm = document.getElementById('category-form');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategoryFormSubmit);
    }
    
    // Modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(this.closest('.modal').id);
        });
    });
    
    // Cancel buttons for modals
    document.getElementById('cancel-product-btn').addEventListener('click', function() {
        closeModal('product-modal');
    });
    
    document.getElementById('cancel-category-btn').addEventListener('click', function() {
        closeModal('category-modal');
    });
    
    document.getElementById('cancel-delete-btn').addEventListener('click', function() {
        closeModal('delete-modal');
    });
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    // Image URL preview
    const imageUrlInput = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    if (imageUrlInput && imagePreview) {
        imageUrlInput.addEventListener('input', function() {
            imagePreview.src = this.value || 'https://via.placeholder.com/150?text=Preview';
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProducts);
    }
    
    // Import file selection
    const importFile = document.getElementById('import-file');
    const importBtn = document.getElementById('import-btn');
    const fileName = document.getElementById('file-name');
    
    if (importFile && importBtn && fileName) {
        importFile.addEventListener('change', function() {
            if (this.files.length > 0) {
                fileName.textContent = this.files[0].name;
                importBtn.disabled = false;
            } else {
                fileName.textContent = 'No file selected';
                importBtn.disabled = true;
            }
        });
        
        importBtn.addEventListener('click', importProducts);
    }
    
    // Settings forms
    const generalSettingsForm = document.getElementById('general-settings-form');
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Store settings saved successfully', 'success');
        });
    }
    
    const adminSettingsForm = document.getElementById('admin-settings-form');
    if (adminSettingsForm) {
        adminSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const adminName = document.getElementById('admin-name').value;
            if (adminName) {
                localStorage.setItem('admin_username', adminName);
                document.getElementById('admin-username').textContent = adminName;
            }
            showNotification('Admin account updated successfully', 'success');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

/**
 * Close a specific modal
 * @param {string} modalId - The ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Open a specific modal
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

/**
 * Open modal for adding a new product
 */
function openAddProductModal() {
    // Reset the form
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('image-preview').src = 'https://via.placeholder.com/150?text=Preview';
    
    // Open the modal
    openModal('product-modal');
}

/**
 * Open modal for editing an existing product
 * @param {number} productId - ID of the product to edit
 */
function openEditProductModal(productId) {
    // Find the product by ID
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    // Set form title and product ID
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    
    // Fill the form fields with product data
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('image-preview').src = product.image || 'https://via.placeholder.com/150?text=Preview';
    
    // Set current product ID for reference
    currentProductId = productId;
    
    // Open the modal
    openModal('product-modal');
}

/**
 * Open modal for adding a new category
 */
function openAddCategoryModal() {
    // Reset the form
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('category-modal-title').textContent = 'Add New Category';
    
    // Open the modal
    openModal('category-modal');
}

/**
 * Open modal for editing an existing category
 * @param {string} categoryName - Name of the category to edit
 */
function openEditCategoryModal(categoryName) {
    // Set form title
    document.getElementById('category-modal-title').textContent = 'Edit Category';
    
    // Fill the form fields with category data
    document.getElementById('category-name').value = categoryName;
    document.getElementById('category-id').value = categories.indexOf(categoryName);
    
    // Set current category ID for reference
    currentCategoryId = categories.indexOf(categoryName);
    
    // Open the modal
    openModal('category-modal');
}

/**
 * Open delete confirmation modal
 * @param {string} type - Type of item to delete ('product' or 'category')
 * @param {number|string} id - ID of the item to delete
 * @param {string} [name] - Name of the category (for category deletion)
 */
function openDeleteConfirmationModal(type, id, name) {
    // Set delete type and ID
    deleteType = type;
    
    // Set confirmation message based on type
    const message = document.getElementById('delete-message');
    
    if (type === 'product') {
        const product = allProducts.find(p => p.id === id);
        if (!product) {
            showNotification('Product not found', 'error');
            return;
        }
        currentProductId = id;
        message.textContent = `Are you sure you want to delete the product "${product.name}"? This action cannot be undone.`;
    } else if (type === 'category') {
        currentCategoryId = categories.indexOf(name);
        message.textContent = `Are you sure you want to delete the category "${name}"? All products in this category will be affected.`;
    }
    
    // Open the modal
    openModal('delete-modal');
}

/**
 * Handle product form submission (add/edit)
 * @param {Event} e - Form submit event
 */
function handleProductFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const description = document.getElementById('product-description').value;
    
    // Create product object
    const productData = {
        name,
        price,
        category,
        image,
        description
    };
    
    if (productId) {
        // Edit existing product
        const index = allProducts.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            productData.id = parseInt(productId);
            allProducts[index] = productData;
            showNotification('Product updated successfully', 'success');
        }
    } else {
        // Add new product
        productData.id = getNextProductId();
        allProducts.push(productData);
        showNotification('Product added successfully', 'success');
    }
    
    // Update products display and stats
    displayProducts();
    updateStats();
    
    // Close the modal
    closeModal('product-modal');
    
    // Save the updated products to localStorage for persistence
    localStorage.setItem('admin_products', JSON.stringify(allProducts));
}

/**
 * Handle category form submission (add/edit)
 * @param {Event} e - Form submit event
 */
function handleCategoryFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    
    if (categoryId) {
        // Edit existing category
        const oldName = categories[parseInt(categoryId)];
        categories[parseInt(categoryId)] = name;
        
        // Update products with the new category name
        allProducts.forEach(product => {
            if (product.category === oldName) {
                product.category = name;
            }
        });
        
        showNotification('Category updated successfully', 'success');
    } else {
        // Add new category
        categories.push(name);
        showNotification('Category added successfully', 'success');
    }
    
    // Update categories display and products display
    displayCategories();
    displayProducts();
    
    // Close the modal
    closeModal('category-modal');
    
    // Save the updated categories to localStorage for persistence
    localStorage.setItem('admin_categories', JSON.stringify(categories));
}

/**
 * Confirm delete action
 */
function confirmDelete() {
    if (deleteType === 'product' && currentProductId !== null) {
        // Remove product from array
        allProducts = allProducts.filter(p => p.id !== currentProductId);
        
        // Update display and stats
        displayProducts();
        updateStats();
        
        // Show notification
        showNotification('Product deleted successfully', 'success');
    } else if (deleteType === 'category' && currentCategoryId !== null) {
        const categoryName = categories[currentCategoryId];
        
        // Remove category from array
        categories.splice(currentCategoryId, 1);
        
        // Mark products with this category as 'Uncategorized'
        allProducts.forEach(product => {
            if (product.category === categoryName) {
                product.category = 'Uncategorized';
            }
        });
        
        // Update displays and stats
        displayCategories();
        displayProducts();
        updateStats();
        
        // Show notification
        showNotification('Category deleted successfully', 'success');
    }
    
    // Close the modal
    closeModal('delete-modal');
    
    // Reset current IDs
    currentProductId = null;
    currentCategoryId = null;
    
    // Save the updated data to localStorage for persistence
    localStorage.setItem('admin_products', JSON.stringify(allProducts));
    localStorage.setItem('admin_categories', JSON.stringify(categories));
}

/**
 * Get the next available product ID
 * @returns {number} Next product ID
 */
function getNextProductId() {
    return allProducts.length > 0 
        ? Math.max(...allProducts.map(p => p.id)) + 1 
        : 1;
}

/**
 * Display products in the table
 */
function displayProducts() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    if (allProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No products found</td></tr>';
        return;
    }
    
    // Create rows for each product
    allProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/60?text=Error'"></td>
            <td class="product-name">${product.name}</td>
            <td class="product-price">Rs ${product.price.toFixed(2)}</td>
            <td><span class="product-category">${product.category}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addProductActionButtonListeners();
}

/**
 * Display categories in the table
 */
function displayCategories() {
    const tableBody = document.getElementById('categories-table-body');
    if (!tableBody) return;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    if (categories.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No categories found</td></tr>';
        return;
    }
    
    // Create rows for each category
    categories.forEach((category, index) => {
        const productsCount = allProducts.filter(p => p.category === category).length;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${category}</td>
            <td>${productsCount}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" data-id="${index}" data-name="${category}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${index}" data-name="${category}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to category action buttons
    addCategoryActionButtonListeners();
}

/**
 * Add event listeners to product action buttons
 */
function addProductActionButtonListeners() {
    // View buttons
    document.querySelectorAll('#products-table-body .view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const product = allProducts.find(p => p.id === id);
            
            if (product) {
                // Open the product in a new tab
                const productUrl = `../product-details.html?id=${id}`;
                window.open(productUrl, '_blank');
            }
        });
    });
    
    // Edit buttons
    document.querySelectorAll('#products-table-body .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openEditProductModal(id);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('#products-table-body .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            openDeleteConfirmationModal('product', id);
        });
    });
}

/**
 * Add event listeners to category action buttons
 */
function addCategoryActionButtonListeners() {
    // Edit buttons
    document.querySelectorAll('#categories-table-body .edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            openEditCategoryModal(name);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('#categories-table-body .delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            openDeleteConfirmationModal('category', null, name);
        });
    });
}

/**
 * Update dashboard stats
 */
function updateStats() {
    // Update total products count
    const totalProducts = document.getElementById('total-products');
    if (totalProducts) {
        totalProducts.textContent = allProducts.length;
    }
    
    // Count unique categories
    const uniqueCategories = new Set();
    allProducts.forEach(product => {
        if (product.category) {
            uniqueCategories.add(product.category);
        }
    });
    
    // Update total categories count
    const totalCategories = document.getElementById('total-categories');
    if (totalCategories) {
        totalCategories.textContent = uniqueCategories.size;
    }
}

/**
 * Filter products by search term
 * @param {string} searchTerm - Term to search for
 */
function filterProducts(searchTerm) {
    if (!searchTerm) {
        displayProducts();
        return;
    }
    
    const filteredProducts = allProducts.filter(product => {
        return (
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    });
    
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No products match your search</td></tr>';
        return;
    }
    
    // Create rows for filtered products
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/60?text=Error'"></td>
            <td class="product-name">${product.name}</td>
            <td class="product-price">Rs ${product.price.toFixed(2)}</td>
            <td><span class="product-category">${product.category}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> View</button>
                    <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addProductActionButtonListeners();
}

/**
 * Open export/import modal
 */
function openImportExportModal() {
    openModal('export-import-modal');
}

/**
 * Export products to JSON file
 */
function exportProducts() {
    // Create JSON blob from products array
    const productsJson = JSON.stringify(allProducts, null, 2);
    const blob = new Blob([productsJson], { type: 'application/json' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'yashstore-products.json';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Products exported successfully', 'success');
}

/**
 * Import products from JSON file
 */
function importProducts() {
    const fileInput = document.getElementById('import-file');
    
    if (fileInput.files.length === 0) {
        showNotification('Please select a file', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedProducts = JSON.parse(e.target.result);
            
            if (Array.isArray(importedProducts)) {
                // Ask for confirmation
                if (confirm(`This will import ${importedProducts.length} products and replace your existing products. Continue?`)) {
                    // Replace current products array
                    allProducts = importedProducts;
                    
                    // Update display and stats
                    displayProducts();
                    updateStats();
                    
                    // Save to localStorage
                    localStorage.setItem('admin_products', JSON.stringify(allProducts));
                    
                    // Reset file input
                    fileInput.value = '';
                    document.getElementById('file-name').textContent = 'No file selected';
                    document.getElementById('import-btn').disabled = true;
                    
                    // Close modal
                    closeModal('export-import-modal');
                    
                    showNotification(`Successfully imported ${importedProducts.length} products`, 'success');
                }
            } else {
                showNotification('Invalid JSON format. Expected an array of products.', 'error');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showNotification('Error parsing JSON file', 'error');
        }
    };
    
    reader.onerror = function() {
        showNotification('Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Show notification
 * @param {string} message - Notification message
 * @param {string} type - Type of notification ('success', 'error', 'info', etc.)
 */
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon i');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Set the message and icon based on the type
    notificationMessage.textContent = message;
    
    // Remove any existing notification classes
    notification.className = 'admin-notification';
    
    // Add the new notification type class
    notification.classList.add(type);
    
    // Set the icon based on the type
    switch (type) {
        case 'error':
            notificationIcon.className = 'fas fa-times-circle';
            break;
        case 'warning':
            notificationIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'info':
            notificationIcon.className = 'fas fa-info-circle';
            break;
        default:
            notificationIcon.className = 'fas fa-check-circle';
    }
    
    // Show the notification
    notification.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
