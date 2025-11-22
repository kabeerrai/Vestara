// ==========================================
// OPTIMIZED VESTARA STORE - app.js
// ==========================================
// Features:
// - Client-side caching with sessionStorage
// - Pagination support (20 products per page)
// - Efficient DOM rendering (build once, insert once)
// - Cache expiry (5 minutes)
// ==========================================

// 🔥 PASTE YOUR GOOGLE SCRIPT URL HERE 🔥
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIGmCsHZpn9psKq4Ma_AD9llsg94XxWEMQn2RPB4zJm7K2Yy24JVRFcwex6cV-wnho/exec";

// Configuration
const CONFIG = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes in ms
  PRODUCTS_PER_PAGE: 20,
  CACHE_KEY_PRODUCTS: 'vestara_products_cache',
  CACHE_KEY_REVIEWS: 'vestara_reviews_cache'
};

// Global state
let products = [];
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function generateStarRating(rating) {
  const full = '★'.repeat(Math.floor(rating));
  const empty = '☆'.repeat(5 - Math.ceil(rating));
  return `${full}${empty} (${rating.toFixed(1)})`;
}

// ==========================================
// CACHING SYSTEM
// ==========================================

function getCachedData(key) {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    if (age > CONFIG.CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (e) {
    console.warn('Cache read error:', e);
    return null;
  }
}

function setCachedData(key, data) {
  try {
    const cacheObj = { data, timestamp: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(cacheObj));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

function clearCache() {
  sessionStorage.removeItem(CONFIG.CACHE_KEY_PRODUCTS);
  sessionStorage.removeItem(CONFIG.CACHE_KEY_REVIEWS);
  console.log('Cache cleared');
}

// ==========================================
// PRODUCT LOADING
// ==========================================

async function loadProducts(forceRefresh = false) {
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedData(CONFIG.CACHE_KEY_PRODUCTS);
    if (cached && cached.length > 0) {
      console.log(`✅ Loaded ${cached.length} products from cache`);
      products = cached;
      return products;
    }
  }
  
  try {
    console.log('📦 Fetching products from server...');
    
    // Use 'products' endpoint (works with both old and new backend)
    let response = await fetch(`${SCRIPT_URL}?type=products`);
    let result = await response.json();
    
    console.log('📦 Raw API response:', result);
    
    if (result.error) {
      console.error('❌ Server error:', result.error);
      // Try old endpoint as fallback
      console.log('📦 Trying fallback endpoint...');
      response = await fetch(`${SCRIPT_URL}?type=products`);
      result = await response.json();
      console.log('📦 Fallback response:', result);
    }
    
    // Handle both response formats:
    // New format: { products: [...], fromCache: true, total: N }
    // Old format: [...] (direct array)
    let rawProducts;
    if (result.products && Array.isArray(result.products)) {
      rawProducts = result.products;
    } else if (Array.isArray(result)) {
      rawProducts = result;
    } else {
      console.error('❌ Unexpected response format:', result);
      return [];
    }
    
    if (rawProducts.length === 0) {
      console.warn('⚠️ No products returned from server');
      return [];
    }
    
    // Process products - handle both old and new field names
    products = rawProducts.map(p => ({
      _id: String(p.id || p.ID || ''),
      productId: String(p.id || p.ID || ''),
      name: p.title || p.name || p.Title || 'Unnamed Product',
      price: parseFloat(p.price || p.Price || 0),
      description: p.description || p.Description || '',
      shortDescription: p.shortDescription || p.shortdescription || p.short_description || p.description || '',
      longDescription: p.longDescription || p.longdescription || p.long_description || p.description || '',
      images: [p.image || p.Image].filter(Boolean),
      category: p.category || p.Category || 'Uncategorized',
      rating: parseFloat(p.rating || p.Rating || 4.5),
      inStock: p.inStock !== false && p.instock !== 'FALSE' && p.instock !== false && p.instock !== 'false',
      onSale: p.onSale === true || p.onsale === 'TRUE' || p.onsale === true || p.onsale === 'true'
    }));
    
    // Cache the processed products
    setCachedData(CONFIG.CACHE_KEY_PRODUCTS, products);
    
    console.log(`✅ Loaded ${products.length} products from server`);
    console.log('📦 First product sample:', products[0]);
    return products;
  } catch (error) {
    console.error('❌ Error loading products:', error);
    return [];
  }
}

// ==========================================
// REVIEWS
// ==========================================

async function loadReviews(productId = null, forceRefresh = false) {
  if (!forceRefresh) {
    const cached = getCachedData(CONFIG.CACHE_KEY_REVIEWS);
    if (cached) {
      const reviews = productId 
        ? cached.filter(r => String(r.product_id) === String(productId))
        : cached;
      return reviews;
    }
  }
  
  try {
    const response = await fetch(`${SCRIPT_URL}?type=reviews`);
    const reviews = await response.json();
    
    if (reviews.error || !Array.isArray(reviews)) {
      return [];
    }
    
    setCachedData(CONFIG.CACHE_KEY_REVIEWS, reviews);
    
    return productId 
      ? reviews.filter(r => String(r.product_id) === String(productId))
      : reviews;
  } catch (error) {
    console.error('❌ Error loading reviews:', error);
    return [];
  }
}

async function submitReview(reviewData) {
  try {
    const response = await fetch(`${SCRIPT_URL}?type=addReview`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        product_id: reviewData.product_id || 'general',
        name: reviewData.name,
        rating: reviewData.rating,
        review: reviewData.review,
        date: new Date().toLocaleDateString()
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Clear reviews cache
      sessionStorage.removeItem(CONFIG.CACHE_KEY_REVIEWS);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error submitting review:', error);
    return { success: false, error: error.message };
  }
}

// ==========================================
// SEARCH
// ==========================================

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
      setTimeout(() => searchInput?.focus(), 100);
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
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
          if (searchResults) searchResults.innerHTML = '';
          return;
        }
        const results = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
        );
        displaySearchResults(results);
      }, 200);
    });
  }
}

function displaySearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  
  if (results.length === 0) {
    container.innerHTML = '<p class="no-results">No products found</p>';
    return;
  }
  
  // Build HTML in memory
  const html = results.map(p => `
    <a href="product.html?id=${escapeHtml(p._id)}" class="search-result-item">
      <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}">
      <div class="search-result-info">
        <h4>${escapeHtml(p.name)}</h4>
        <p class="search-result-price">RS.${p.price.toFixed(2)}</p>
        ${!p.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
        ${p.onSale ? '<span class="sale-badge" style="font-size:0.65rem;padding:2px 6px;margin-left:5px;">SALE</span>' : ''}
      </div>
    </a>
  `).join('');
  
  container.innerHTML = html;
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function getCart() {
  try {
    return JSON.parse(sessionStorage.getItem('cart') || '[]');
  } catch (e) {
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
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cartCount, #navCartCount').forEach(el => {
    if (el) el.textContent = count;
  });
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const pid = String(productId);
  const product = products.find(p => p._id === pid);
  
  if (!product || quantity < 1) {
    console.error('❌ Product not found or invalid quantity');
    return;
  }
  
  const existing = cart.find(item => String(item.id) === pid);
  
  if (existing) {
    existing.quantity += quantity;
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
    position:fixed;top:100px;right:20px;background:#000;color:#fff;
    padding:1rem 1.5rem;border-radius:2px;box-shadow:0 4px 12px rgba(0,0,0,0.15);
    z-index:1000;font-size:0.875rem;letter-spacing:1px;text-transform:uppercase;
    transition:all 0.3s ease;
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
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const tax = 0;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
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
  
  // Build HTML efficiently
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
  
  // Update totals
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('cartSubtotal', `RS.${totals.subtotal.toFixed(2)}`);
  setEl('cartShipping', totals.shipping === 0 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`);
  setEl('cartTax', `RS.${totals.tax.toFixed(2)}`);
  setEl('cartTotal', `RS.${totals.total.toFixed(2)}`);
}

function initCartListeners() {
  const cartItemsList = document.getElementById('cartItemsList');
  if (!cartItemsList) return;
  
  cartItemsList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;
    
    if (e.target.classList.contains('qty-plus')) updateQuantity(id, 1);
    else if (e.target.classList.contains('qty-minus')) updateQuantity(id, -1);
    else if (e.target.classList.contains('remove-item-btn')) removeFromCart(id);
  });
}

function updateQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(productId));
  if (item) {
    item.quantity = Math.max(1, item.quantity + change);
  }
  saveCart(cart);
  displayCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => String(item.id) !== String(productId));
  saveCart(cart);
  displayCart();
  showNotification("Item removed from cart.");
}

function displayCheckoutSummary() {
  const cart = getCart();
  const container = document.getElementById('checkoutItemsList');
  const totals = calculateCartTotals();
  
  if (!container) return;
  
  if (cart.length === 0) {
    container.innerHTML = '<p style="padding:1rem;text-align:center;">Your cart is empty.</p>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="summary-item">
        <span class="item-name">${escapeHtml(item.name)} x${item.quantity}</span>
        <span class="item-price">RS.${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }
  
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('checkoutSubtotal', `RS.${totals.subtotal.toFixed(2)}`);
  setEl('checkoutShipping', totals.shipping === 0 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`);
  setEl('checkoutTax', `RS.${totals.tax.toFixed(2)}`);
  setEl('checkoutTotal', `RS.${totals.total.toFixed(2)}`);
}

// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navClose = document.getElementById('navClose');
  const navOverlay = document.getElementById('navOverlay');
  
  if (menuToggle && nav) menuToggle.addEventListener('click', () => nav.classList.add('active'));
  if (navClose && nav) navClose.addEventListener('click', () => nav.classList.remove('active'));
  if (navOverlay && nav) navOverlay.addEventListener('click', () => nav.classList.remove('active'));
}

function filterByCategory(category) {
  sessionStorage.setItem('selectedCategory', category);
  window.location.href = 'products.html';
}

// ==========================================
// PRODUCT DISPLAY - OPTIMIZED
// ==========================================

function displayProducts(containerSelector, productList, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const toDisplay = limit ? productList.slice(0, limit) : productList;
  
  // Update product count if on products page
  if (containerSelector === '#allProducts') {
    const countEl = document.getElementById('productCountDisplay');
    if (countEl) countEl.textContent = productList.length;
  }
  
  // Show loading skeleton if products not yet loaded
  if (toDisplay.length === 0 && products.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;">
        <div style="display:inline-block;width:30px;height:30px;border:3px solid #eee;border-top-color:#000;border-radius:50%;animation:spin 1s linear infinite;"></div>
        <p style="margin-top:1rem;color:#666;font-size:0.9rem;">Loading products...</p>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      </div>
    `;
    return;
  }
  
  if (toDisplay.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#666;">No products found.</p>';
    return;
  }
  
  // Build HTML in memory for efficiency
  let html = '';
  
  if (containerSelector === '#allProducts') {
    // Products page grid view
    html = toDisplay.map(p => {
      const shortDesc = p.shortDescription ? `<p class="clean-short-desc">${escapeHtml(p.shortDescription)}</p>` : '';
      return `
        <div class="product-card-clean">
          <div class="clean-image-container">
            ${p.onSale ? '<span class="badge-sale">ON SALE</span>' : ''}
            ${!p.inStock ? '<span class="badge-sale" style="background-color:#333;left:auto;right:0;">SOLD OUT</span>' : ''}
            <a href="product.html?id=${escapeHtml(p._id)}">
              <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}" loading="lazy">
            </a>
          </div>
          <div class="clean-info">
            <h3 class="clean-name">${escapeHtml(p.name.toUpperCase())}</h3>
            ${shortDesc}
            <div class="clean-price-box"><span class="clean-price">RS.${p.price.toFixed(2)}</span></div>
            <div class="star-rating-static">${generateStarRating(p.rating || 4.5)}</div>
            <div class="color-dots"><div class="dot gold"></div><div class="dot silver"></div></div>
          </div>
        </div>
      `;
    }).join('');
  } else {
    // Homepage / scroll view
    html = toDisplay.map(p => `
      <div class="product-card">
        <div class="product-image-container">
          ${p.onSale ? '<span class="sale-badge">SALE</span>' : ''}
          <a href="product.html?id=${escapeHtml(p._id)}">
            <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}" class="product-image" loading="lazy">
          </a>
        </div>
        <div class="product-info">
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <p class="product-price">RS.${p.price.toFixed(2)}</p>
          <a href="product.html?id=${escapeHtml(p._id)}" class="btn btn-block">View Details</a>
        </div>
      </div>
    `).join('');
  }
  
  // Single DOM update
  container.innerHTML = html;
}

// ==========================================
// FILTERS & SORTING
// ==========================================

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
  
  // Apply filters
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }
  filtered = filtered.filter(p => p.price <= maxPrice);
  if (inStockOnly) {
    filtered = filtered.filter(p => p.inStock);
  }
  
  // Apply sort
  switch (sortBy) {
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  
  displayProducts('#allProducts', filtered);
}

// ==========================================
// PRODUCT DETAIL PAGE
// ==========================================

let currentImageIndex = 0;
let currentProductImages = [];
let currentProduct = null;

function getProductIdFromUrl() {
  const id = new URLSearchParams(window.location.search).get('id');
  return id ? String(id) : null;
}

async function displayProductDetail() {
  const productId = getProductIdFromUrl();
  
  if (!productId) {
    const productInfo = document.getElementById('productInfo');
    if (productInfo) productInfo.innerHTML = '<p style="padding:2rem;text-align:center;">No product ID specified.</p>';
    return;
  }
  
  const product = products.find(p => String(p._id) === String(productId));
  
  if (!product) {
    const productInfo = document.getElementById('productInfo');
    if (productInfo) productInfo.innerHTML = `<p style="padding:2rem;text-align:center;">Product not found (ID: ${escapeHtml(productId)})</p>`;
    return;
  }
  
  currentProduct = product;
  document.title = `Vestara - ${product.name}`;
  
  // Product Info
  const productInfo = document.getElementById('productInfo');
  if (productInfo) {
    productInfo.innerHTML = `
      <h1 class="product-name">${escapeHtml(product.name)} ${product.onSale ? '<span style="color:#800000;font-size:0.7rem;">[ON SALE]</span>' : ''}</h1>
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
    
    // Quantity controls
    const quantityInput = document.getElementById('quantityInput');
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
      quantityInput.value = (parseInt(quantityInput.value) || 1) + 1;
    });
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
      const v = parseInt(quantityInput.value) || 1;
      if (v > 1) quantityInput.value = v - 1;
    });
    
    // Add to cart
    if (product.inStock) {
      document.getElementById('addToCartBtn')?.addEventListener('click', () => {
        addToCart(product._id, parseInt(quantityInput?.value) || 1);
      });
    }
  }
  
  // Gallery
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
      thumb.addEventListener('click', function() {
        updateMainImage(parseInt(this.dataset.index));
      });
    });
    
    document.getElementById('mainProductImage')?.addEventListener('click', () => openLightbox(currentImageIndex));
  }
  
  // Similar products
  const similarContainer = document.getElementById('similarProductsScroll');
  if (similarContainer) {
    const similar = products.filter(p => p.category === product.category && p._id !== product._id);
    displayProducts('#similarProductsScroll', similar.length > 0 ? similar : products.filter(p => p._id !== product._id).slice(0, 4));
  }
}

function updateMainImage(index) {
  const mainImage = document.getElementById('mainProductImage');
  if (mainImage) mainImage.src = currentProductImages[index];
  
  document.querySelectorAll('.thumbnail-image-container').forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });
  currentImageIndex = index;
}

// ==========================================
// LIGHTBOX
// ==========================================

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
  if (!lightbox || !lightboxImage) return;
  
  currentImageIndex = index;
  lightbox.style.display = "block";
  lightboxImage.src = currentProductImages[currentImageIndex];
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) lightbox.style.display = "none";
}

function changeLightboxImage(direction) {
  currentImageIndex = (currentImageIndex + direction + currentProductImages.length) % currentProductImages.length;
  const lightboxImage = document.getElementById('lightboxImage');
  if (lightboxImage) lightboxImage.src = currentProductImages[currentImageIndex];
}

// ==========================================
// REVIEWS PAGE
// ==========================================

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
        if (reviewRatingInput) reviewRatingInput.value = rating;
        stars.forEach((s, idx) => {
          s.textContent = idx < rating ? '★' : '☆';
        });
      });
      
      star.addEventListener('mouseenter', function() {
        const rating = this.dataset.rating;
        stars.forEach((s, idx) => {
          s.textContent = idx < rating ? '★' : '☆';
        });
      });
    });
    
    starRating.addEventListener('mouseleave', function() {
      const currentRating = reviewRatingInput ? reviewRatingInput.value : 0;
      stars.forEach((s, idx) => {
        s.textContent = idx < currentRating ? '★' : '☆';
      });
    });
  }
  
  await displayAllReviews();
  
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }
      
      const reviewData = {
        product_id: "general",
        name: document.getElementById('reviewName')?.value,
        rating: document.getElementById('reviewRating')?.value || 5,
        review: document.getElementById('reviewText')?.value
      };
      
      const result = await submitReview(reviewData);
      
      if (result.success) {
        showNotification('Review submitted successfully!');
        reviewForm.reset();
        if (reviewRatingInput) reviewRatingInput.value = '5';
        
        if (starRating) {
          starRating.querySelectorAll('.star').forEach((s, i) => {
            s.textContent = i < 5 ? '★' : '☆';
          });
        }
        
        await displayAllReviews();
      } else {
        alert('Failed to submit review. Please try again.');
      }
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
      }
    });
  }
}

async function displayAllReviews() {
  const reviewsList = document.getElementById('reviewsList');
  if (!reviewsList) return;
  
  reviewsList.innerHTML = '<p style="text-align:center;padding:2rem;">Loading reviews...</p>';
  
  const reviews = await loadReviews();
  
  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p style="text-align:center;padding:2rem;color:#666;">No reviews yet. Be the first to review!</p>';
    return;
  }
  
  reviewsList.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <h3 class="reviewer-name">${escapeHtml(r.name)}</h3>
        <div class="review-rating">${generateStarRating(parseFloat(r.rating))}</div>
      </div>
      <p class="review-text">${escapeHtml(r.review)}</p>
      <p class="review-date">${escapeHtml(r.date || 'Recently')}</p>
    </div>
  `).join('');
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Load products first (no floating indicator - we'll use inline loading states)
  await loadProducts();
  
  console.log('✅ Products loaded, initializing page...');
  
  // Initialize common features
  updateCartCount();
  initNavigation();
  initSearch();
  
  const path = window.location.pathname;
  
  // ========== PRODUCTS PAGE ==========
  if (path.includes('products.html')) {
    const filterButtons = document.querySelectorAll('.filter-item[data-filter-type="category"]');
    const priceRange = document.getElementById('priceRange');
    const maxPriceValueEl = document.getElementById('maxPriceValue');
    
    function updateActiveFilter(category) {
      filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filterValue === category));
    }
    
    // Set max price based on products
    const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1600;
    if (priceRange) {
      priceRange.setAttribute('max', Math.ceil(maxProductPrice));
      priceRange.value = Math.ceil(maxProductPrice);
    }
    if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange?.value || maxProductPrice).toFixed(2)}`;
    
    // Check for category from homepage
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    updateActiveFilter(selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'all');
    sessionStorage.removeItem('selectedCategory');
    
    // Initial display
    applyFiltersAndSort();
    
    // Event listeners
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        updateActiveFilter(btn.dataset.filterValue);
        applyFiltersAndSort();
      });
    });
    
    priceRange?.addEventListener('input', () => {
      if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`;
      applyFiltersAndSort();
    });
    
    document.getElementById('inStockFilter')?.addEventListener('change', applyFiltersAndSort);
    document.getElementById('sortSelect')?.addEventListener('change', applyFiltersAndSort);
  }
  
  // ========== PRODUCT DETAIL PAGE ==========
  else if (path.includes('product.html')) {
    await displayProductDetail();
    initLightbox();
  }
  
  // ========== CART PAGE ==========
  else if (path.includes('cart.html')) {
    displayCart();
    initCartListeners();
  }
  
  // ========== CHECKOUT PAGE ==========
  else if (path.includes('checkout.html')) {
    displayCheckoutSummary();
  }
  
  // ========== THANK YOU PAGE ==========
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
            <div style="margin-top:2rem;">
              <a href="products.html" class="btn btn-secondary" style="margin-right:1rem;">Continue Shopping</a>
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
            <div style="margin-top:2rem;">
              <a href="products.html" class="btn btn-primary">Continue Shopping</a>
            </div>
          </div>
        `;
      }
    }
  }
  
  // ========== REVIEWS PAGE ==========
  else if (path.includes('reviews.html')) {
    await initReviewsPage();
  }
  
  // ========== HOMEPAGE ==========
  else if (path.includes('index.html') || path.endsWith('/')) {
    displayProducts('#featuredProducts', products, 8);
  }
});

// ==========================================
// EXPOSE GLOBAL FUNCTIONS
// ==========================================

// For category cards on homepage
window.filterByCategory = filterByCategory;

// For manual cache clear (debug)
window.clearVestaraCache = clearCache;

// For checkout page (called from inline script)
window.getCart = getCart;
window.calculateCartTotals = calculateCartTotals;