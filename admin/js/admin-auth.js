/**
 * YashStore Admin Authentication
 * Simple authentication system for the admin panel
 */

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', function() {
    // Basic authentication check
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    const isLoginPage = window.location.href.includes('index.html') || window.location.pathname.endsWith('/admin/');
    
    // Redirect based on auth status
    if (isLoggedIn === 'true' && isLoginPage) {
        window.location.href = 'dashboard.html';
    } else if (isLoggedIn !== 'true' && !isLoginPage) {
        window.location.href = 'index.html';
    }
    
    // Setup login form handler
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Setup logout button handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Display admin username if available
    const adminUsername = document.getElementById('admin-username');
    if (adminUsername) {
        const storedUsername = localStorage.getItem('admin_username') || 'Admin';
        adminUsername.textContent = storedUsername;
    }
});

/**
 * Handle login form submission
 */
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    // Simple authentication - in a real app this would validate against a server
    if (username === 'admin' && password === 'password') {
        // Store auth state in localStorage
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_username', username);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error
        errorMsg.textContent = 'Invalid username or password';
        
        // Clear error after 3 seconds
        setTimeout(() => {
            errorMsg.textContent = '';
        }, 3000);
    }
}

/**
 * Handle logout button click
 */
function handleLogout(e) {
    e.preventDefault();
    
    // Clear auth data
    localStorage.removeItem('admin_logged_in');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
function isAuthenticated() {
    return localStorage.getItem('admin_logged_in') === 'true';
}
