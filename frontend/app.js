// ========================================
// 🔥 PASTE YOUR GOOGLE SCRIPT URL HERE 🔥
// ========================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqt06A3eSk010cH-HIosJ4e7WayNLRiZzvenM9aLydK21mMgGmcgChPvDOwBFlXK1N/exec";

// Global products array (loaded from Google Sheets)
let products = [];

// CHANGED: HTML escape function for XSS safety
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// --- Load Products from Google Sheets ---
async function loadProducts() {
    try {
        console.log("📦 Loading products from Google Sheets...");
        const response = await fetch(`${SCRIPT_URL}?type=products`);
        const data = await response.json();
        
        console.log("📦 Raw data from Sheets:", data);
        
        if (data.error) {
            console.error('❌ Google Sheets error:', data.error);
            return [];
        }
        
        if (!Array.isArray(data)) {
            console.error('❌ Expected array but got:', typeof data);
            return [];
        }
        
        // CHANGED: Map with string IDs and shortDescription
        products = data.map(product => ({
            _id: String(product.id || ''),
            productId: String(product.id || ''),
            name: product.title || 'Unnamed Product',
            price: parseFloat(product.price) || 0,
            description: product.description || '',
            shortDescription: product.shortdescription || product.short_description || product.description || '',
            longDescription: product.longdescription || product.long_description || product.description || '',
            images: [product.image].filter(Boolean),
            category: product.category || 'Uncategorized',
            rating: parseFloat(product.rating) || 4.5,
            inStock: product.instock !== 'FALSE' && product.instock !== false && product.instock !== 'false',
            onSale: product.onsale === 'TRUE' || product.onsale === true || product.onsale === 'true'
        }));
        
        console.log(`✅ Loaded ${products.length} products from Google Sheets`);
        console.log("📦 Processed products:", products);
        return products;
    } catch (error) {
        console.error('❌ Error loading products:', error);
        return [];
    }
}

// --- Load Reviews from Google Sheets ---
async function loadReviews(productId = null) {
    try {
        const response = await fetch(`${SCRIPT_URL}?type=reviews`);
        const reviews = await response.json();
        
        if (reviews.error) {
            console.error('❌ Reviews error:', reviews.error);
            return [];
        }
        
        if (!Array.isArray(reviews)) {
            console.error('❌ Expected reviews array but got:', typeof reviews);
            return [];
        }
        
        if (productId) {
            return reviews.filter(r => String(r.product_id) === String(productId));
        }
        return reviews;
    } catch (error) {
        console.error('❌ Error loading reviews:', error);
        return [];
    }
}

// CHANGED: Complete rewrite of submitReview function
// app.js
// --- Submit Review to Google Sheets ---
async function submitReview(reviewData) {
    try {
        // console.log("Submitting review...", reviewData); // Optional debugging

        // FIX: Use 'text/plain;charset=utf-8' to bypass CORS errors
        const response = await fetch(`${SCRIPT_URL}?type=addReview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
                product_id: reviewData.product_id || 'general',
                name: reviewData.name,
                rating: reviewData.rating,
                review: reviewData.review,
                date: new Date().toLocaleDateString() // Adds today's date
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('❌ Error submitting review:', error);
        return { success: false, error: error.message };
    }
}


// --- Search Functionality ---
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            setTimeout(() => searchInput && searchInput.focus(), 100);
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                if (searchInput) searchInput.value = '';
                if (searchResults) searchResults.innerHTML = '';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                if (searchResults) searchResults.innerHTML = '';
                return;
            }
            const results = products.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                (product.shortDescription && product.shortDescription.toLowerCase().includes(query))
            );
            displaySearchResults(results);
        });
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <a href="product.html?id=${escapeHtml(product._id)}" class="search-result-item">
            <img src="${escapeHtml(product.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(product.name)}">
            <div class="search-result-info">
                <h4>${escapeHtml(product.name)}</h4>
                <p class="search-result-price">RS.${product.price.toFixed(2)}</p>
                ${!product.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
                ${product.onSale ? '<span class="sale-badge" style="font-size: 0.65rem; padding: 2px 6px; margin-left: 5px;">SALE</span>' : ''}
            </div>
        </a>
    `).join('');
}

// --- Product Utility Functions ---
function filterByCategory(category) {
    sessionStorage.setItem('selectedCategory', category);
    window.location.href = 'products.html';
}

function generateStarRating(rating) {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return `${fullStars}${emptyStars} (${rating.toFixed(1)})`;
}

// --- Cart Functions ---
function getCart() {
    try {
        const cart = sessionStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        console.error('Error reading cart:', e);
        return [];
    }
}

function saveCart(cart) {
    try {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cartCount, #navCartCount').forEach(el => {
        if(el) el.textContent = count;
    });
}

// CHANGED: Fixed addToCart with string ID comparison
function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const productIdStr = String(productId);
    const product = products.find(p => p._id === productIdStr);
    
    console.log("🛒 Adding to cart - Product ID:", productIdStr, "Found:", product);
    
    if (!product || quantity < 1) {
        console.error('❌ Product not found or invalid quantity');
        return;
    }
    
    const existingItem = cart.find(item => String(item.id) === productIdStr);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product._id,
            productId: product.productId,
            name: product.name,
            price: product.price,
            image: product.images[0] || 'placeholder.jpg',
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification(`${quantity} x ${product.name} added to cart!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: #000; color: white;
        padding: 1rem 1.5rem; border-radius: 2px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000; font-size: 0.875rem; letter-spacing: 1px; text-transform: uppercase;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function calculateCartTotals() {
    const cart = getCart();
    let subtotal = 0;
    cart.forEach(item => { subtotal += item.price * item.quantity; });
    const shipping = subtotal > 5000 ? 0.00 : 250.00;
    const tax = 0;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}

function displayCart() {
    const cart = getCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummaryColumn = document.querySelector('.cart-summary-column');
    if (!cartItemsList || !emptyCartMessage || !cartSummaryColumn) return;

    const totals = calculateCartTotals();
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsList.style.display = 'none';
        cartSummaryColumn.style.display = 'none';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartItemsList.style.display = 'block';
    cartSummaryColumn.style.display = 'block';

    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-product-id="${escapeHtml(String(item.id))}">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${escapeHtml(item.name)}</h4>
                <p class="cart-item-price">RS.${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn qty-minus" data-id="${escapeHtml(String(item.id))}">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly class="quantity-input">
                    <button class="qty-btn qty-plus" data-id="${escapeHtml(String(item.id))}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-subtotal">RS.${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item-btn btn" data-id="${escapeHtml(String(item.id))}">Remove</button>
            </div>
        </div>
    `).join('');

    const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
    el('cartSubtotal', `RS.${totals.subtotal.toFixed(2)}`);
    el('cartShipping', totals.shipping === 0 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`);
    el('cartTax', `RS.${totals.tax.toFixed(2)}`);
    el('cartTotal', `RS.${totals.total.toFixed(2)}`);
}

function initCartListeners() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;
    cartItemsList.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        if (!productId) return;
        if (e.target.classList.contains('qty-plus')) updateQuantity(productId, 1);
        else if (e.target.classList.contains('qty-minus')) updateQuantity(productId, -1);
        else if (e.target.classList.contains('remove-item-btn')) removeFromCart(productId);
    });
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(i => String(i.id) === String(productId));
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
    }
    saveCart(cart);
    displayCart();
}

function removeFromCart(productId) {
    let cart = getCart().filter(item => String(item.id) !== String(productId));
    saveCart(cart);
    displayCart();
    showNotification("Item removed from cart.");
}

function displayCheckoutSummary() {
    const cart = getCart();
    const itemsListContainer = document.getElementById('checkoutItemsList');
    const totals = calculateCartTotals();
    if (!itemsListContainer) return;
    
    if (cart.length === 0) {
        itemsListContainer.innerHTML = '<p style="padding: 1rem; text-align: center;">Your cart is empty.</p>';
    } else {
        itemsListContainer.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span class="item-name">${escapeHtml(item.name)} x${item.quantity}</span>
                <span class="item-price">RS.${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
    el('checkoutSubtotal', `RS.${totals.subtotal.toFixed(2)}`);
    el('checkoutShipping', totals.shipping === 0 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`);
    el('checkoutTax', `RS.${totals.tax.toFixed(2)}`);
    el('checkoutTotal', `RS.${totals.total.toFixed(2)}`);
}

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navClose = document.getElementById('navClose');
    const navOverlay = document.getElementById('navOverlay');
    if (menuToggle && nav) menuToggle.addEventListener('click', () => nav.classList.add('active'));
    if (navClose && nav) navClose.addEventListener('click', () => nav.classList.remove('active'));
    if (navOverlay && nav) navOverlay.addEventListener('click', () => nav.classList.remove('active'));
}

// CHANGED: Added shortDescription to product display
function displayProducts(containerSelector, productList, limit = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const productsToDisplay = limit ? productList.slice(0, limit) : productList;
    
    if (containerSelector === '#allProducts') {
        const countDisplay = document.getElementById('productCountDisplay');
        if(countDisplay) countDisplay.textContent = productList.length;
    }

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No products found.</p>';
        return;
    }

    if (containerSelector === '#allProducts') {
        container.innerHTML = productsToDisplay.map(product => {
            const shortDesc = product.shortDescription ? `<p class="clean-short-desc">${escapeHtml(product.shortDescription)}</p>` : '';
            return `
                <div class="product-card-clean">
                    <div class="clean-image-container">
                        ${product.onSale ? '<span class="badge-sale">ON SALE</span>' : ''}
                        ${!product.inStock ? '<span class="badge-sale" style="background-color: #333; left: auto; right: 0;">SOLD OUT</span>' : ''}
                        <a href="product.html?id=${escapeHtml(product._id)}">
                            <img src="${escapeHtml(product.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(product.name)}">
                        </a>
                    </div>
                    <div class="clean-info">
                        <h3 class="clean-name">${escapeHtml(product.name.toUpperCase())}</h3>
                        ${shortDesc}
                        <div class="clean-price-box"><span class="clean-price">RS.${product.price.toFixed(2)}</span></div>
                        <div class="star-rating-static">${generateStarRating(product.rating || 4.5)}</div>
                        <div class="color-dots"><div class="dot gold"></div><div class="dot silver"></div></div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = productsToDisplay.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    ${product.onSale ? '<span class="sale-badge">SALE</span>' : ''}
                    <a href="product.html?id=${escapeHtml(product._id)}">
                        <img src="${escapeHtml(product.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(product.name)}" class="product-image">
                    </a>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${escapeHtml(product.name)}</h3>
                    <p class="product-price">RS.${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${escapeHtml(product._id)}" class="btn btn-block">View Details</a>
                </div>
            </div>
        `).join('');
    }
}

function getFiltersAndSortState() {
    return {
        selectedCategory: document.querySelector('.filter-item.active[data-filter-type="category"]')?.dataset.filterValue || 'all',
        maxPrice: parseFloat(document.getElementById('priceRange')?.value) || Infinity,
        inStockOnly: document.getElementById('inStockFilter')?.checked || false,
        sortBy: document.getElementById('sortSelect')?.value || 'default'
    };
}

function applyFiltersAndSort() {
    const { selectedCategory, maxPrice, inStockOnly, sortBy } = getFiltersAndSortState();
    let filtered = [...products];
    if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
    filtered = filtered.filter(p => p.price <= maxPrice);
    if (inStockOnly) filtered = filtered.filter(p => p.inStock);
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    displayProducts('#allProducts', filtered);
}

let currentImageIndex = 0;
let currentProductImages = [];
let currentProduct = null;

function getProductIdFromUrl() {
    const id = new URLSearchParams(window.location.search).get('id');
    console.log("🔍 Product ID from URL:", id);
    return id ? String(id) : null;
}

// CHANGED: Complete rewrite of displayProductDetail
async function displayProductDetail() {
    const productId = getProductIdFromUrl();
    console.log("🔍 Looking for product ID:", productId);
    console.log("🔍 Available products:", products.map(p => ({ _id: p._id, name: p.name })));
    
    if (!productId) {
        console.error("❌ No product ID in URL");
        const productInfo = document.getElementById('productInfo');
        if (productInfo) productInfo.innerHTML = '<p style="padding: 2rem; text-align: center;">No product ID specified.</p>';
        return;
    }

    const product = products.find(p => String(p._id) === String(productId));
    console.log("🔍 Found product:", product);
    
    if (!product) {
        console.error("❌ Product not found for ID:", productId);
        const productInfo = document.getElementById('productInfo');
        if (productInfo) productInfo.innerHTML = `<p style="padding: 2rem; text-align: center;">Product not found (ID: ${escapeHtml(productId)})</p>`;
        return;
    }

    currentProduct = product;
    document.title = `Vestara - ${product.name}`;

    const productInfo = document.getElementById('productInfo');
    if (productInfo) {
        productInfo.innerHTML = `
            <h1 class="product-name">${escapeHtml(product.name)} ${product.onSale ? '<span style="color: #800000; font-size: 0.7rem;">[ON SALE]</span>' : ''}</h1>
            <p class="product-price">RS.${product.price.toFixed(2)}</p>
            <p class="product-short-description">${escapeHtml(product.shortDescription || product.description)}</p>
            <div class="product-variant"><label>Color:</label><div class="variant-options"><span class="variant-option selected">Gold</span></div></div>
            <div class="quantity-selector">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="qty-btn" id="qtyMinus">-</button>
                    <input type="number" id="quantityInput" value="1" min="1" readonly>
                    <button class="qty-btn" id="qtyPlus">+</button>
                </div>
            </div>
            <button class="add-to-cart-btn" id="addToCartBtn" ${!product.inStock ? 'disabled' : ''}>${product.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
            <div class="product-long-description"><h3>Description</h3><p>${escapeHtml(product.longDescription || product.description)}</p></div>
        `;

        const quantityInput = document.getElementById('quantityInput');
        document.getElementById('qtyPlus')?.addEventListener('click', () => { quantityInput.value = (parseInt(quantityInput.value) || 1) + 1; });
        document.getElementById('qtyMinus')?.addEventListener('click', () => { const v = parseInt(quantityInput.value) || 1; if (v > 1) quantityInput.value = v - 1; });
        if (product.inStock) {
            document.getElementById('addToCartBtn')?.addEventListener('click', () => addToCart(product._id, parseInt(quantityInput?.value) || 1));
        }
    }

    currentProductImages = product.images.length > 0 ? product.images : ['placeholder.jpg'];
    const productGallery = document.getElementById('productGallery');
    if (productGallery) {
        productGallery.innerHTML = `
            <div class="main-image-container">
                <img src="${escapeHtml(currentProductImages[0])}" alt="${escapeHtml(product.name)}" class="main-image" id="mainProductImage">
            </div>
            <div class="thumbnail-gallery">${currentProductImages.map((img, i) => `
                <div class="thumbnail-image-container ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} thumbnail" class="thumbnail-image">
                </div>
            `).join('')}</div>
        `;
        document.querySelectorAll('.thumbnail-image-container').forEach(thumb => {
            thumb.addEventListener('click', function() { updateMainImage(parseInt(this.dataset.index)); });
        });
        document.getElementById('mainProductImage')?.addEventListener('click', () => openLightbox(currentImageIndex));
    }
    
    const similarContainer = document.getElementById('similarProductsScroll');
    if(similarContainer) {
        const similar = products.filter(p => p.category === product.category && p._id !== product._id);
        displayProducts('#similarProductsScroll', similar.length > 0 ? similar : products.filter(p => p._id !== product._id).slice(0, 4));
    }
}

function updateMainImage(index) {
    const mainImage = document.getElementById('mainProductImage');
    if(mainImage) mainImage.src = currentProductImages[index];
    document.querySelectorAll('.thumbnail-image-container').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    currentImageIndex = index;
}

function initLightbox() {
    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev')?.addEventListener('click', () => changeLightboxImage(-1));
    document.querySelector('.lightbox-next')?.addEventListener('click', () => changeLightboxImage(1));
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.style.display === "block") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") changeLightboxImage(-1);
            if (e.key === "ArrowRight") changeLightboxImage(1);
        }
    });
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    if(!lightbox || !lightboxImage) return;
    currentImageIndex = index;
    lightbox.style.display = "block";
    lightboxImage.src = currentProductImages[currentImageIndex];
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if(lightbox) lightbox.style.display = "none";
}

function changeLightboxImage(direction) {
    currentImageIndex = (currentImageIndex + direction + currentProductImages.length) % currentProductImages.length;
    const lightboxImage = document.getElementById('lightboxImage');
    if(lightboxImage) lightboxImage.src = currentProductImages[currentImageIndex];
}

// Main Initialization
document.addEventListener('DOMContentLoaded', async () => {
    // CHANGED: Load products first and wait for completion
    await loadProducts();
    console.log("✅ Products loaded, initializing page...");
    
    updateCartCount();
    initNavigation();
    initSearch();
    
    const path = window.location.pathname;

    if (path.includes('products.html')) {
        const filterButtons = document.querySelectorAll('.filter-item[data-filter-type="category"]');
        const priceRange = document.getElementById('priceRange');
        const maxPriceValueEl = document.getElementById('maxPriceValue');

        function updateActiveFilter(category) {
            filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filterValue === category));
        }
        
        const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1600;
        if (priceRange) {
            priceRange.setAttribute('max', Math.ceil(maxProductPrice));
            priceRange.value = Math.ceil(maxProductPrice);
        }
        if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange?.value || maxProductPrice).toFixed(2)}`;

        const selectedCategory = sessionStorage.getItem('selectedCategory');
        updateActiveFilter(selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'all');
        sessionStorage.removeItem('selectedCategory');
        
        applyFiltersAndSort();

        filterButtons.forEach(btn => btn.addEventListener('click', () => { updateActiveFilter(btn.dataset.filterValue); applyFiltersAndSort(); }));
        priceRange?.addEventListener('input', () => { if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`; applyFiltersAndSort(); });
        document.getElementById('inStockFilter')?.addEventListener('change', applyFiltersAndSort);
        document.getElementById('sortSelect')?.addEventListener('change', applyFiltersAndSort);
    }
    else if (path.includes('product.html')) {
        await displayProductDetail();
        initLightbox();
    }
    else if (path.includes('cart.html')) {
        displayCart();
        initCartListeners();
    }
    else if (path.includes('checkout.html')) {
        displayCheckoutSummary();
    }
    else if (path.includes('thankyou.html')) {
        const orderId = sessionStorage.getItem('lastOrderId');
        const thankYouContent = document.getElementById('thankYouContent');
        
        if (thankYouContent) {
            if (orderId) {
                thankYouContent.innerHTML = `
                    <div class="thank-you-message">
                        <h2 class="section-title">Order Placed Successfully!</h2>
                        <p>Thank you for your purchase. Your order number is <strong>${escapeHtml(orderId)}</strong>.</p>
                        <p>A confirmation email has been sent to your provided address.</p>
                        <div style="margin-top: 2rem;">
                            <a href="products.html" class="btn btn-secondary" style="margin-right: 1rem;">Continue Shopping</a>
                            <a href="index.html" class="btn btn-primary">Return to Homepage</a>
                        </div>
                    </div>
                `;
                sessionStorage.removeItem('lastOrderId');
            } else {
                thankYouContent.innerHTML = `
                    <div class="thank-you-message">
                        <h2 class="section-title">Thank You!</h2>
                        <p>We appreciate your business.</p>
                        <div style="margin-top: 2rem;">
                            <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    else if (path.includes('reviews.html')) {
        await initReviewsPage();
    }
    
    else if (path.includes('index.html') || path.endsWith('/')) {
        displayProducts('#featuredProducts', products, 8);
    }
});

// --- Reviews Page Functionality ---
async function initReviewsPage() {
    const reviewForm = document.getElementById('reviewForm');
    const reviewRatingInput = document.getElementById('reviewRating');
    const starRating = document.getElementById('starRating');
    
    // Star rating interaction
    if (starRating) {
        const stars = starRating.querySelectorAll('.star');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                if(reviewRatingInput) reviewRatingInput.value = rating;
                
                stars.forEach((s, index) => {
                    s.textContent = index < rating ? '★' : '☆';
                });
            });
            
            // Optional: Hover effect logic
            star.addEventListener('mouseenter', function() {
                const rating = this.dataset.rating;
                stars.forEach((s, index) => {
                    s.textContent = index < rating ? '★' : '☆';
                });
            });
        });

        starRating.addEventListener('mouseleave', function() {
            const currentRating = reviewRatingInput ? reviewRatingInput.value : 0;
            stars.forEach((s, index) => {
                s.textContent = index < currentRating ? '★' : '☆';
            });
        });
    }
    
    // Load and display all reviews
    await displayAllReviews();
    
    // Handle review form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            if(submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }
            
            const reviewData = {
                product_id: "general", // For site-wide reviews
                name: document.getElementById('reviewName')?.value,
                rating: document.getElementById('reviewRating')?.value || 5,
                review: document.getElementById('reviewText')?.value
            };
            
            const result = await submitReview(reviewData);
            
            if (result.success) {
                showNotification('Review submitted successfully!');
                reviewForm.reset();
                if(reviewRatingInput) reviewRatingInput.value = '5';
                
                // Reset stars
                if(starRating) {
                    starRating.querySelectorAll('.star').forEach((s, i) => {
                        s.textContent = i < 5 ? '★' : '☆';
                    });
                }
                
                // Reload reviews
                await displayAllReviews();
            } else {
                alert('Failed to submit review. Please try again.');
            }
            
            if(submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
            }
        });
    }
}

async function displayAllReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    reviewsList.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading reviews...</p>';
    
    const reviews = await loadReviews();
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No reviews yet. Be the first to review!</p>';
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <h3 class="reviewer-name">${escapeHtml(review.name)}</h3>
                <div class="review-rating">${generateStarRating(parseFloat(review.rating))}</div>
            </div>
            <p class="review-text">${escapeHtml(review.review)}</p>
            <p class="review-date">${escapeHtml(review.date || 'Recently')}</p>
        </div>
    `).join('');
}