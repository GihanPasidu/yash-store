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
let customers = []; // Will store customer data
let orders = []; // Will store order data

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
    
    // Initialize mock data for other sections
    initializeMockData();
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
 * Initialize mock data for customers, orders, and analytics sections
 */
function initializeMockData() {
    // Mock customers data
    customers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+94771234567", orders: 3 },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+94772345678", orders: 2 },
        { id: 3, name: "Robert Johnson", email: "robert@example.com", phone: "+94773456789", orders: 1 }
    ];
    
    // Mock orders data
    orders = [
        { id: 1001, customer: "John Doe", date: "2023-10-15", total: 150.00, status: "completed" },
        { id: 1002, customer: "Jane Smith", date: "2023-10-17", total: 80.00, status: "processing" },
        { id: 1003, customer: "Robert Johnson", date: "2023-10-20", total: 50.00, status: "pending" }
    ];
    
    // Update stats for other sections
    updateCustomersStats();
    updateAnalyticsStats();
    
    // Initialize category cards
    initializeCategoryCards();
    
    // Initialize pagination
    initializePagination();
}

/**
 * Initialize category cards
 */
function initializeCategoryCards() {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return;
    
    // Clear the grid
    categoryGrid.innerHTML = '';
    
    if (categories.length === 0) {
        categoryGrid.innerHTML = '<div class="no-data">No categories found</div>';
        return;
    }
    
    // Create a card for each category
    categories.forEach(category => {
        const productsCount = allProducts.filter(p => p.category === category).length;
        const card = document.createElement('div');
        card.className = 'category-card';
        
        // Get a product from this category for the thumbnail
        const categoryProduct = allProducts.find(p => p.category === category);
        const imageUrl = categoryProduct ? categoryProduct.image : 'https://via.placeholder.com/100?text=Category';
        
        card.innerHTML = `
            <div class="category-card-header">
                <img src="${imageUrl}" alt="${category}" class="category-thumbnail">
            </div>
            <div class="category-card-body">
                <h3>${category}</h3>
                <p>${productsCount} products</p>
            </div>
            <div class="category-card-footer">
                <button class="admin-btn view-category-btn" data-category="${category}">View Products</button>
            </div>
        `;
        
        categoryGrid.appendChild(card);
    });
    
    // Add event listeners to the view buttons
    document.querySelectorAll('.view-category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Switch to products section
            document.querySelector('.admin-nav li[data-section="products"]').click();
            
            // Select the category in the filter
            const categoryFilter = document.getElementById('product-category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                // Trigger change event to filter products
                const event = new Event('change');
                categoryFilter.dispatchEvent(event);
            }
        });
    });
    
    // Update category stats
    document.getElementById('categories-count').textContent = categories.length;
    document.getElementById('categorized-products').textContent = allProducts.length;
    
    // Find the most popular category
    if (categories.length > 0) {
        const categoryCounts = {};
        categories.forEach(category => {
            categoryCounts[category] = allProducts.filter(p => p.category === category).length;
        });
        
        const mostPopularCategory = Object.keys(categoryCounts).reduce((a, b) => 
            categoryCounts[a] > categoryCounts[b] ? a : b
        );
        
        document.getElementById('popular-category').textContent = mostPopularCategory;
    }
}

/**
 * Initialize pagination for products table
 */
function initializePagination() {
    const paginationContainer = document.getElementById('products-pagination');
    if (!paginationContainer) return;
    
    // Clear pagination
    paginationContainer.innerHTML = '';
    
    // Products per page (default: 10)
    const itemsPerPage = 10;
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        return; // No pagination needed
    }
    
    // Create pagination elements
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const paginationInfo = document.createElement('span');
    paginationInfo.className = 'pagination-info';
    paginationInfo.textContent = `Page 1 of ${totalPages}`;
    
    paginationContainer.appendChild(prevButton);
    
    // Add page buttons (up to 5)
    const maxPageButtons = 5;
    const pagesToShow = Math.min(totalPages, maxPageButtons);
    
    for (let i = 1; i <= pagesToShow; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-button page' + (i === 1 ? ' active' : '');
        pageButton.textContent = i;
        pageButton.dataset.page = i;
        
        pageButton.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            goToPage(page, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update pagination info
            paginationInfo.textContent = `Page ${page} of ${totalPages}`;
        });
        
        paginationContainer.appendChild(pageButton);
    }
    
    // If there are more pages than we show, add an ellipsis
    if (totalPages > maxPageButtons) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
        
        // Add the last page button
        const lastPageButton = document.createElement('button');
        lastPageButton.className = 'pagination-button page';
        lastPageButton.textContent = totalPages;
        lastPageButton.dataset.page = totalPages;
        
        lastPageButton.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            goToPage(page, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update pagination info
            paginationInfo.textContent = `Page ${page} of ${totalPages}`;
        });
        
        paginationContainer.appendChild(lastPageButton);
    }
    
    paginationContainer.appendChild(paginationInfo);
    paginationContainer.appendChild(nextButton);
    
    // Add event listeners to prev/next buttons
    let currentPage = 1;
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            goToPage(currentPage, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                if (parseInt(btn.dataset.page) === currentPage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update pagination info
            paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            goToPage(currentPage, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                if (parseInt(btn.dataset.page) === currentPage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update pagination info
            paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
    });
    
    // Initial page load
    goToPage(1, itemsPerPage);
}

/**
 * Go to a specific page in the products table
 * @param {number} page - Page number
 * @param {number} itemsPerPage - Number of items per page
 */
function goToPage(page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    displayPaginatedProducts(paginatedProducts);
}

/**
 * Display paginated products in the table
 * @param {Array} products - Array of products to display
 */
function displayPaginatedProducts(products) {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No products found</td></tr>';
        return;
    }
    
    // Create rows for each product
    products.forEach(product => {
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
            
            // Initialize section content based on which section was clicked
            switch(section) {
                case 'products':
                    displayProducts();
                    updateStats();
                    break;
                case 'categories':
                    displayCategories();
                    break;
                case 'orders':
                    // If we're switching to orders, make sure they're displayed
                    updateAnalyticsStats();
                    break;
                case 'customers':
                    // If we're switching to customers, make sure they're displayed
                    updateCustomersStats();
                    break;
                case 'analytics':
                    // If we're switching to analytics, make sure stats are updated
                    updateAnalyticsStats();
                    break;
                case 'settings':
                    // Any settings-specific initialization can go here
                    break;
            }
            
            // Update the search placeholder based on the current section
            updateSearchPlaceholder(section);
        });
    });
    
    // Check if URL has a hash to navigate to a specific section
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetNavItem = document.querySelector(`.admin-nav li[data-section="${hash}"]`);
        if (targetNavItem) {
            targetNavItem.click();
        }
    }
}

/**
 * Update search placeholder based on current section
 * @param {string} section - Current active section
 */
function updateSearchPlaceholder(section) {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    
    switch(section) {
        case 'products':
            searchInput.placeholder = 'Search products...';
            break;
        case 'categories':
            searchInput.placeholder = 'Search categories...';
            break;
        case 'orders':
            searchInput.placeholder = 'Search orders...';
            break;
        case 'customers':
            searchInput.placeholder = 'Search customers...';
            break;
        case 'analytics':
            searchInput.placeholder = 'Search analytics...';
            break;
        default:
            searchInput.placeholder = 'Search...';
    }
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
            
            // Determine which section is active and apply appropriate search
            const activeSection = document.querySelector('.admin-main.active');
            if (activeSection) {
                const sectionId = activeSection.id;
                
                if (sectionId === 'products-section') {
                    filterProducts(searchTerm);
                } else if (sectionId === 'categories-section') {
                    filterCategories(searchTerm);
                } else if (sectionId === 'customers-section') {
                    filterCustomers(searchTerm);
                } else if (sectionId === 'orders-section') {
                    filterOrders(searchTerm);
                }
            }
        });
    }
    
    // Category filter for products
    const categoryFilter = document.getElementById('product-category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            filterProductsByCategory(category);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear the authentication token
            localStorage.removeItem('admin_token');
            // Redirect to login page
            window.location.href = 'index.html';
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
    
    // Export reports button
    const exportReportsBtn = document.getElementById('export-reports-btn');
    if (exportReportsBtn) {
        exportReportsBtn.addEventListener('click', function() {
            showNotification('Analytics report exported successfully', 'success');
        });
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

/**
 * Initialize category cards
 */
function initializeCategoryCards() {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return;
    
    // Clear the grid
    categoryGrid.innerHTML = '';
    
    if (categories.length === 0) {
        categoryGrid.innerHTML = '<div class="no-data">No categories found</div>';
        return;
    }
    
    // Create a card for each category
    categories.forEach(category => {
        const productsCount = allProducts.filter(p => p.category === category).length;
        const card = document.createElement('div');
        card.className = 'category-card';
        
        // Get a product from this category for the thumbnail
        const categoryProduct = allProducts.find(p => p.category === category);
        const imageUrl = categoryProduct ? categoryProduct.image : 'https://via.placeholder.com/100?text=Category';
        
        card.innerHTML = `
            <div class="category-card-header">
                <img src="${imageUrl}" alt="${category}" class="category-thumbnail">
            </div>
            <div class="category-card-body">
                <h3>${category}</h3>
                <p>${productsCount} products</p>
            </div>
            <div class="category-card-footer">
                <button class="admin-btn view-category-btn" data-category="${category}">View Products</button>
            </div>
        `;
        
        categoryGrid.appendChild(card);
    });
    
    // Add event listeners to the view buttons
    document.querySelectorAll('.view-category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Switch to products section
            document.querySelector('.admin-nav li[data-section="products"]').click();
            
            // Select the category in the filter
            const categoryFilter = document.getElementById('product-category-filter');
            if (categoryFilter) {
                categoryFilter.value = category;
                // Trigger change event to filter products
                const event = new Event('change');
                categoryFilter.dispatchEvent(event);
            }
        });
    });
    
    // Update category stats
    document.getElementById('categories-count').textContent = categories.length;
    document.getElementById('categorized-products').textContent = allProducts.length;
    
    // Find the most popular category
    if (categories.length > 0) {
        const categoryCounts = {};
        categories.forEach(category => {
            categoryCounts[category] = allProducts.filter(p => p.category === category).length;
        });
        
        const mostPopularCategory = Object.keys(categoryCounts).reduce((a, b) => 
            categoryCounts[a] > categoryCounts[b] ? a : b
        );
        
        document.getElementById('popular-category').textContent = mostPopularCategory;
    }
}

/**
 * Initialize pagination for products table
 */
function initializePagination() {
    const paginationContainer = document.getElementById('products-pagination');
    if (!paginationContainer) return;
    
    // Clear pagination
    paginationContainer.innerHTML = '';
    
    // Products per page (default: 10)
    const itemsPerPage = 10;
    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    if (totalPages <= 1) {
        return; // No pagination needed
    }
    
    // Create pagination elements
    const prevButton = document.createElement('button');
    prevButton.className = 'pagination-button prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'pagination-button next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const paginationInfo = document.createElement('span');
    paginationInfo.className = 'pagination-info';
    paginationInfo.textContent = `Page 1 of ${totalPages}`;
    
    paginationContainer.appendChild(prevButton);
    
    // Add page buttons (up to 5)
    const maxPageButtons = 5;
    const pagesToShow = Math.min(totalPages, maxPageButtons);
    
    for (let i = 1; i <= pagesToShow; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'pagination-button page' + (i === 1 ? ' active' : '');
        pageButton.textContent = i;
        pageButton.dataset.page = i;
        
        pageButton.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            goToPage(page, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update pagination info
            paginationInfo.textContent = `Page ${page} of ${totalPages}`;
        });
        
        paginationContainer.appendChild(pageButton);
    }
    
    // If there are more pages than we show, add an ellipsis
    if (totalPages > maxPageButtons) {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
        
        // Add the last page button
        const lastPageButton = document.createElement('button');
        lastPageButton.className = 'pagination-button page';
        lastPageButton.textContent = totalPages;
        lastPageButton.dataset.page = totalPages;
        
        lastPageButton.addEventListener('click', function() {
            const page = parseInt(this.dataset.page);
            goToPage(page, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Update pagination info
            paginationInfo.textContent = `Page ${page} of ${totalPages}`;
        });
        
        paginationContainer.appendChild(lastPageButton);
    }
    
    paginationContainer.appendChild(paginationInfo);
    paginationContainer.appendChild(nextButton);
    
    // Add event listeners to prev/next buttons
    let currentPage = 1;
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            goToPage(currentPage, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                if (parseInt(btn.dataset.page) === currentPage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update pagination info
            paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
    });
    
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            goToPage(currentPage, itemsPerPage);
            
            // Update active button
            document.querySelectorAll('.pagination-button.page').forEach(btn => {
                if (parseInt(btn.dataset.page) === currentPage) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Update pagination info
            paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        }
    });
    
    // Initial page load
    goToPage(1, itemsPerPage);
}

/**
 * Go to a specific page in the products table
 * @param {number} page - Page number
 * @param {number} itemsPerPage - Number of items per page
 */
function goToPage(page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);
    
    displayPaginatedProducts(paginatedProducts);
}

/**
 * Display paginated products in the table
 * @param {Array} products - Array of products to display
 */
function displayPaginatedProducts(products) {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Clear current table
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="no-data">No products found</td></tr>';
        return;
    }
    
    // Create rows for each product
    products.forEach(product => {
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
 * Update search placeholder based on current section
 * @param {string} section - Current active section
 */
function updateSearchPlaceholder(section) {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    
    switch(section) {
        case 'products':
            searchInput.placeholder = 'Search products...';
            break;
        case 'categories':
            searchInput.placeholder = 'Search categories...';
            break;
        case 'orders':
            searchInput.placeholder = 'Search orders...';
            break;
        case 'customers':
            searchInput.placeholder = 'Search customers...';
            break;
        case 'analytics':
            searchInput.placeholder = 'Search analytics...';
            break;
        default:
            searchInput.placeholder = 'Search...';
    }
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
            
            // Determine which section is active and apply appropriate search
            const activeSection = document.querySelector('.admin-main.active');
            if (activeSection) {
                const sectionId = activeSection.id;
                
                if (sectionId === 'products-section') {
                    filterProducts(searchTerm);
                } else if (sectionId === 'categories-section') {
                    filterCategories(searchTerm);
                } else if (sectionId === 'customers-section') {
                    filterCustomers(searchTerm);
                } else if (sectionId === 'orders-section') {
                    filterOrders(searchTerm);
                }
            }
        });
    }
    
    // Category filter for products
    const categoryFilter = document.getElementById('product-category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            filterProductsByCategory(category);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Clear the authentication token
            localStorage.removeItem('admin_token');
            // Redirect to login page
            window.location.href = 'index.html';
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
    
    // Export reports button
    const exportReportsBtn = document.getElementById('export-reports-btn');
    if (exportReportsBtn) {
        exportReportsBtn.addEventListener('click', function() {
            showNotification('Analytics report exported successfully', 'success');
        });
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
    
    // Export customers button
    const exportCustomersBtn = document.getElementById('export-customers-btn');
    if (exportCustomersBtn) {
        exportCustomersBtn.addEventListener('click', function() {
            // Create CSV content
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "ID,Name,Email,Phone,Orders\n";
            
            customers.forEach(customer => {
                csvContent += `${customer.id},"${customer.name}","${customer.email}","${customer.phone}",${customer.orders}\n`;
            });
            
            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "customers.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Customers data exported successfully', 'success');
        });
    }
    
    // Add customer button
    const addCustomerBtn = document.getElementById('add-customer-btn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', function() {
            showNotification('Customer management features coming soon!', 'info');
        });
    }
    
    // Date range selector for analytics
    const dateRangeSelect = document.getElementById('date-range-select');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            const range = this.value;
            showNotification(`Analytics data updated for ${range === 'custom' ? 'custom range' : 'the last ' + range + ' days'}`, 'info');
        });
    }
    
    // Restore defaults button
    const restoreDefaultsBtn = document.getElementById('restore-defaults');
    if (restoreDefaultsBtn) {
        restoreDefaultsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to restore all settings to default values? This cannot be undone.')) {
                // Reset form values
                document.getElementById('store-name').value = 'YashStore';
                document.getElementById('store-description').value = 'Premium handcrafted earrings collection';
                document.getElementById('currency').value = 'LKR';
                document.getElementById('whatsapp-number').value = '94771482950';
                document.getElementById('theme-light').checked = true;
                document.getElementById('products-per-page').value = '20';
                
                showNotification('Settings restored to defaults', 'success');
            }
        });
    }
    
    // Display settings form
    const displaySettingsForm = document.getElementById('display-settings-form');
    if (displaySettingsForm) {
        displaySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the selected theme
            const themeValue = document.querySelector('input[name="theme"]:checked').value;
            
            // Update theme based on selection
            if (themeValue === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
                document.getElementById('theme-color-meta').content = '#ffffff';
            } else if (themeValue === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
                document.getElementById('theme-color-meta').content = '#121212';
            } else if (themeValue === 'auto') {
                // Use system preference
                localStorage.removeItem('theme');
                const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
                if (prefersDarkScheme.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
                    document.getElementById('theme-color-meta').content = '#121212';
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
                    document.getElementById('theme-color-meta').content = '#ffffff';
                }
            }
            
            // Update products per page
            const productsPerPage = parseInt(document.getElementById('products-per-page').value);
            localStorage.setItem('products_per_page', productsPerPage);
            
            // Reinitialize pagination if we're on the products page
            if (document.getElementById('products-section').classList.contains('active')) {
                initializePagination();
            }
            
            showNotification('Display settings saved successfully', 'success');
        });
    }
    
    // Initialize the theme radio buttons based on current theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const themeRadio = document.getElementById(`theme-${savedTheme}`);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    } else {
        // No saved theme means we're using auto/system setting
        const autoThemeRadio = document.getElementById('theme-auto');
        if (autoThemeRadio) {
            autoThemeRadio.checked = true;
        }
    }
}
