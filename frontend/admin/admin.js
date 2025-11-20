// Admin Panel JavaScript

// API URL Configuration
const API_URL = 'https://vestara-nab2.onrender.com';

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const currentPage = window.location.pathname;
    
    // Allow login page without token
    if (currentPage.includes('login.html')) {
        if (token) {
            // Already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
        return;
    }
    
    // Require token for all other pages
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display admin email in sidebar
    const adminEmail = localStorage.getItem('adminEmail');
    const emailElement = document.getElementById('adminEmail');
    if (emailElement && adminEmail) {
        emailElement.textContent = adminEmail;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        window.location.href = 'login.html';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle unauthorized responses
async function handleResponse(response) {
    if (response.status === 401) {
        showNotification('Session expired. Please login again.', 'error');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        throw new Error('Unauthorized');
    }
    return response;
}

// Fetch with auth
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });
    
    return handleResponse(response);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format currency
function formatCurrency(amount) {
    return `RS.${parseFloat(amount).toFixed(2)}`;
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
    }
});

// Prevent form submission on enter (except in textareas)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.form) {
        const form = e.target.form;
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton && document.activeElement !== submitButton) {
            e.preventDefault();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (if needed in future)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Auto-close notifications
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    });
});