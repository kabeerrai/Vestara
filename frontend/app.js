// ==========================================
// VESTARA STORE - app.js (FIXED FOR SALE PRICES)
// ==========================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby5gaho5wCz43gFzx0sQaNOgCxh-mmuV9P1B7aTxOZVrhgPh-t1hzXGJZkEoH0ppL7p/exec";



const CONFIG = {
  CACHE_TTL: 5 * 60 * 1000,
  PRODUCTS_PER_PAGE: 20,
  CACHE_KEY_PRODUCTS: 'vestara_products_cache',
  CACHE_KEY_REVIEWS: 'vestara_reviews_cache'
};

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

// Calculate discount percentage from original and sale price
function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

// ==========================================
// SKELETON LOADING
// ==========================================

function generateSkeletonCards(count, isGridView = false) {
  let html = '';
  for (let i = 0; i < count; i++) {
    if (isGridView) {
      html += `
        <div class="product-card-clean skeleton-card">
          <div class="clean-image-container skeleton-box skeleton-image"></div>
          <div class="clean-info">
            <div class="skeleton-box skeleton-title"></div>
            <div class="skeleton-box skeleton-price"></div>
            <div class="skeleton-box skeleton-rating"></div>
          </div>
        </div>`;
    } else {
      html += `
        <div class="product-card skeleton-card">
          <div class="product-image-container skeleton-box skeleton-image"></div>
          <div class="product-info">
            <div class="skeleton-box skeleton-title"></div>
            <div class="skeleton-box skeleton-price"></div>
            <div class="skeleton-box skeleton-btn"></div>
          </div>
        </div>`;
    }
  }
  return html;
}

function showSkeletonLoading(containerSelector, count = 8) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const isGridView = containerSelector === '#allProducts';
  container.innerHTML = generateSkeletonCards(count, isGridView);
}

// ==========================================
// CACHING SYSTEM
// ==========================================

function getCachedData(key) {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CONFIG.CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (e) { return null; }
}

function setCachedData(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) { console.warn('Cache write error:', e); }
}

function clearCache() {
  sessionStorage.removeItem(CONFIG.CACHE_KEY_PRODUCTS);
  sessionStorage.removeItem(CONFIG.CACHE_KEY_REVIEWS);
}

// ==========================================
// PRODUCT LOADING - FIXED PRICE LOGIC
// ==========================================

async function loadProducts(forceRefresh = false) {
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
    const response = await fetch(`${SCRIPT_URL}?type=products`);
    const result = await response.json();
    
    let rawProducts;
    if (result.products && Array.isArray(result.products)) {
      rawProducts = result.products;
    } else if (Array.isArray(result)) {
      rawProducts = result;
    } else {
      console.error('❌ Unexpected response format:', result);
      return [];
    }
    
    if (rawProducts.length === 0) return [];
    
    // FIXED: Process products with correct sale price logic
    products = rawProducts.map(p => {
      // Parse images
      let imagesArray = [];
      const imageField = p.images || p.image || p.Image || '';
      if (Array.isArray(imageField)) {
        imagesArray = imageField.filter(Boolean);
      } else if (typeof imageField === 'string' && imageField.length > 0) {
        imagesArray = imageField.split(',').map(url => url.trim()).filter(url => url.length > 0);
      }
      
      // FIXED PRICE LOGIC:
      // From Google Apps Script:
      // - p.price = original price (full price from sheet)
      // - p.salePrice = sale price (discounted price, null if not on sale)
      // - p.onSale = true/false
      // - p.discountPercent = calculated discount %
      
      const originalPrice = parseFloat(p.price || 0);
      const salePrice = parseFloat(p.salePrice || 0);
      const isOnSale = p.onSale === true;
      const discountFromServer = parseInt(p.discountPercent || 0);
      
      // Calculate what to display
      let displayPrice, displayOriginalPrice, discountPercent;
      
      if (isOnSale && salePrice > 0) {
        // ON SALE: show salePrice as main, originalPrice as strikethrough
        displayPrice = salePrice;
        displayOriginalPrice = originalPrice;
        discountPercent = discountFromServer > 0 ? discountFromServer : calculateDiscount(originalPrice, salePrice);
      } else {
        // NOT ON SALE: show originalPrice as main, no strikethrough
        displayPrice = originalPrice;
        displayOriginalPrice = 0;
        discountPercent = 0;
      }
      
      // Debug log
      console.log(`Product: ${p.title} | Original: ${originalPrice} | Sale: ${salePrice} | OnSale: ${isOnSale} | Display: ${displayPrice} | Discount: ${discountPercent}%`);
      
      return {
        _id: String(p.id || p.ID || ''),
        productId: String(p.id || p.ID || ''),
        name: p.title || p.name || p.Title || 'Unnamed Product',
        price: displayPrice,                    // Current selling price
        originalPrice: displayOriginalPrice,    // Original price (for strikethrough)
        discountPercent: discountPercent,       // e.g. 50 for 50% off
        description: p.description || p.Description || '',
        shortDescription: p.shortDescription || p.shortdescription || p.short_description || '',
        longDescription: p.longDescription || p.longdescription || p.long_description || p.description || '',
        images: imagesArray.length > 0 ? imagesArray : ['placeholder.jpg'],
        category: p.category || p.Category || 'Uncategorized',
        rating: parseFloat(p.rating || p.Rating || 4.5),
        inStock: p.inStock !== false && p.instock !== 'FALSE' && p.instock !== false && p.instock !== 'false',
        onSale: isOnSale && salePrice > 0  // Only truly on sale if has salePrice
      };
    });
    
    setCachedData(CONFIG.CACHE_KEY_PRODUCTS, products);
    console.log(`✅ Loaded ${products.length} products`);
    console.log('📦 Sample product:', products[0]);
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
      return productId ? cached.filter(r => String(r.product_id) === String(productId)) : cached;
    }
  }
  try {
    const response = await fetch(`${SCRIPT_URL}?type=reviews`);
    const reviews = await response.json();
    if (reviews.error || !Array.isArray(reviews)) return [];
    setCachedData(CONFIG.CACHE_KEY_REVIEWS, reviews);
    return productId ? reviews.filter(r => String(r.product_id) === String(productId)) : reviews;
  } catch (error) { return []; }
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
    if (result.success) sessionStorage.removeItem(CONFIG.CACHE_KEY_REVIEWS);
    return result;
  } catch (error) { return { success: false, error: error.message }; }
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
        if (query.length < 2) { if (searchResults) searchResults.innerHTML = ''; return; }
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
  
  const html = results.map(p => {
    // Build badge
    let badgeHtml = '';
    if (p.onSale && p.discountPercent > 0) {
      badgeHtml = `<span class="sale-badge-new">SAVE ${p.discountPercent}%</span>`;
    } else if (p.onSale) {
      badgeHtml = '<span class="sale-badge-new">ON SALE</span>';
    }
    
    // Build price with strikethrough
    let priceHtml = `<span class="search-current-price">RS.${p.price.toFixed(2)}</span>`;
    if (p.originalPrice > 0) {
      priceHtml += ` <span class="search-original-price">RS.${p.originalPrice.toFixed(2)}</span>`;
    }
    
    return `
      <a href="product.html?id=${escapeHtml(p._id)}" class="search-result-item">
        <div class="search-result-image-wrap">
          ${badgeHtml}
          <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}">
        </div>
        <div class="search-result-info">
          <h4>${escapeHtml(p.name)}</h4>
          <p class="search-result-price">${priceHtml}</p>
          ${!p.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
        </div>
      </a>`;
  }).join('');
  
  container.innerHTML = html;
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function getCart() {
  try { return JSON.parse(sessionStorage.getItem('cart') || '[]'); } catch (e) { return []; }
}

function saveCart(cart) {
  try { sessionStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); } catch (e) {}
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cartCount, #navCartCount').forEach(el => { if (el) el.textContent = count; });
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = products.find(p => p._id === String(productId));
  if (!product || quantity < 1) return;
  
  const existing = cart.find(item => String(item.id) === String(productId));
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product._id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || null,  // Save original price for savings calculation
      image: product.images[0] || 'placeholder.jpg',
      quantity: quantity
    });
  }
  saveCart(cart);
  showNotification(`${quantity} x ${product.name} added to cart!`);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `position:fixed;top:100px;right:20px;background:#000;color:#fff;padding:1rem 1.5rem;border-radius:2px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000;font-size:0.875rem;letter-spacing:1px;text-transform:uppercase;transition:all 0.3s ease;`;
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
  return { subtotal, shipping, tax: 0, total: subtotal + shipping };
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
    </div>`).join('');
  
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
  if (item) item.quantity = Math.max(1, item.quantity + change);
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
  
  container.innerHTML = cart.length === 0 
    ? '<p style="padding:1rem;text-align:center;">Your cart is empty.</p>'
    : cart.map(item => `
        <div class="summary-item">
          <span class="item-name">${escapeHtml(item.name)} x${item.quantity}</span>
          <span class="item-price">RS.${(item.price * item.quantity).toFixed(2)}</span>
        </div>`).join('');
  
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
// PRODUCT DISPLAY - FIXED WITH SALE PRICES
// ==========================================

function displayProducts(containerSelector, productList, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const toDisplay = limit ? productList.slice(0, limit) : productList;
  
  if (containerSelector === '#allProducts') {
    const countEl = document.getElementById('productCountDisplay');
    if (countEl) countEl.textContent = productList.length;
  }
  
  if (toDisplay.length === 0 && products.length === 0) {
    showSkeletonLoading(containerSelector, 8);
    return;
  }
  
  if (toDisplay.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#666;">No products found.</p>';
    return;
  }
  
  let html = '';
  
  if (containerSelector === '#allProducts') {
    // PRODUCTS PAGE GRID VIEW
    html = toDisplay.map(p => {
      const shortDesc = p.shortDescription ? `<p class="clean-short-desc">${escapeHtml(p.shortDescription)}</p>` : '';
      
      // Sale badge with percentage
      let badgeHtml = '';
      if (p.onSale && p.discountPercent > 0) {
        badgeHtml = `<span class="sale-badge-new">SAVE ${p.discountPercent}%</span>`;
      } else if (p.onSale) {
        badgeHtml = `<span class="sale-badge-new">ON SALE</span>`;
      }
      
      const soldOutBadge = !p.inStock ? '<span class="sold-out-badge">SOLD OUT</span>' : '';
      
      // Price display with strikethrough for original price
      let priceHtml;
      if (p.originalPrice > 0) {
        priceHtml = `<span class="clean-price">RS.${p.price.toFixed(2)}</span><span class="clean-original-price">RS.${p.originalPrice.toFixed(2)}</span>`;
      } else {
        priceHtml = `<span class="clean-price-normal">RS.${p.price.toFixed(2)}</span>`;
      }
      
      return `
        <div class="product-card-clean loaded">
          <div class="clean-image-container">
            ${badgeHtml}
            ${soldOutBadge}
            <a href="product.html?id=${escapeHtml(p._id)}">
              <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}" loading="lazy">
            </a>
          </div>
          <div class="clean-info">
            <h3 class="clean-name">${escapeHtml(p.name.toUpperCase())}</h3>
            ${shortDesc}
            <div class="clean-price-box">${priceHtml}</div>
            <div class="star-rating-static">${generateStarRating(p.rating || 4.5)}</div>
            <div class="color-dots"><div class="dot gold"></div><div class="dot silver"></div></div>
          </div>
        </div>`;
    }).join('');
  } else {
    // HOMEPAGE SCROLL VIEW
    html = toDisplay.map(p => {
      // Sale badge with percentage
      let badgeHtml = '';
      if (p.onSale && p.discountPercent > 0) {
        badgeHtml = `<span class="sale-badge-new">SAVE ${p.discountPercent}%</span>`;
      } else if (p.onSale) {
        badgeHtml = `<span class="sale-badge-new">ON SALE</span>`;
      }
      
      // Price display with strikethrough
      let priceHtml;
      if (p.originalPrice > 0) {
        priceHtml = `<span class="current-price">RS.${p.price.toFixed(2)}</span> <span class="original-price">RS.${p.originalPrice.toFixed(2)}</span>`;
      } else {
        priceHtml = `RS.${p.price.toFixed(2)}`;
      }
      
      return `
        <div class="product-card loaded">
          <div class="product-image-container">
            ${badgeHtml}
            <a href="product.html?id=${escapeHtml(p._id)}">
              <img src="${escapeHtml(p.images[0]) || 'placeholder.jpg'}" alt="${escapeHtml(p.name)}" class="product-image" loading="lazy">
            </a>
          </div>
          <div class="product-info">
            <h3 class="product-name">${escapeHtml(p.name)}</h3>
            <p class="product-price">${priceHtml}</p>
            <a href="product.html?id=${escapeHtml(p._id)}" class="btn btn-block">View Details</a>
          </div>
        </div>`;
    }).join('');
  }
  
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
  
  if (selectedCategory !== 'all') filtered = filtered.filter(p => p.category === selectedCategory);
  filtered = filtered.filter(p => p.price <= maxPrice);
  if (inStockOnly) filtered = filtered.filter(p => p.inStock);
  
  switch (sortBy) {
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
    case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  
  displayProducts('#allProducts', filtered);
}

// ==========================================
// PRODUCT DETAIL PAGE - FIXED PRICES
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
  
  // Sale tag with percentage
  let saleTag = '';
  if (product.onSale && product.discountPercent > 0) {
    saleTag = `<span class="detail-sale-tag">SAVE ${product.discountPercent}%</span>`;
  } else if (product.onSale) {
    saleTag = `<span class="detail-sale-tag">ON SALE</span>`;
  }
  
  // Price with strikethrough original
  let priceHtml;
  if (product.originalPrice > 0) {
    priceHtml = `<p class="product-price"><span class="detail-current-price">RS.${product.price.toFixed(2)}</span> <span class="detail-original-price">RS.${product.originalPrice.toFixed(2)}</span></p>`;
  } else {
    priceHtml = `<p class="product-price">RS.${product.price.toFixed(2)}</p>`;
  }
  
  const productInfo = document.getElementById('productInfo');
  if (productInfo) {
    productInfo.innerHTML = `
      <h1 class="product-name">${escapeHtml(product.name)} ${saleTag}</h1>
      ${priceHtml}
      <p class="product-short-description">${escapeHtml(product.shortDescription || product.description || '')}</p>
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
      document.getElementById('addToCartBtn')?.addEventListener('click', () => { addToCart(product._id, parseInt(quantityInput?.value) || 1); });
    }
  }
  
  currentProductImages = product.images.length > 0 ? product.images : ['placeholder.jpg'];
  const productGallery = document.getElementById('productGallery');
  if (productGallery) {
    const thumbnailsHtml = currentProductImages.length > 1 
      ? `<div class="thumbnail-gallery">${currentProductImages.map((img, i) => `
          <div class="thumbnail-image-container ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} - Image ${i + 1}" class="thumbnail-image">
          </div>`).join('')}</div>` : '';
    
    productGallery.innerHTML = `
      <div class="main-image-container">
        <img src="${escapeHtml(currentProductImages[0])}" alt="${escapeHtml(product.name)}" class="main-image" id="mainProductImage">
        ${currentProductImages.length > 1 ? `<div class="image-counter">1 / ${currentProductImages.length}</div>` : ''}
      </div>
      ${thumbnailsHtml}
    `;
    
    document.querySelectorAll('.thumbnail-image-container').forEach(thumb => {
      thumb.addEventListener('click', function() { updateMainImage(parseInt(this.dataset.index)); });
    });
    document.getElementById('mainProductImage')?.addEventListener('click', () => openLightbox(currentImageIndex));
  }
  
  const similarContainer = document.getElementById('similarProductsScroll');
  if (similarContainer) {
    const similar = products.filter(p => p.category === product.category && p._id !== product._id);
    displayProducts('#similarProductsScroll', similar.length > 0 ? similar : products.filter(p => p._id !== product._id).slice(0, 4));
  }
}

function updateMainImage(index) {
  const mainImage = document.getElementById('mainProductImage');
  if (mainImage) mainImage.src = currentProductImages[index];
  const counter = document.querySelector('.image-counter');
  if (counter) counter.textContent = `${index + 1} / ${currentProductImages.length}`;
  document.querySelectorAll('.thumbnail-image-container').forEach((thumb, i) => { thumb.classList.toggle('active', i === index); });
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
  
  if (starRating) {
    const stars = starRating.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const rating = this.dataset.rating;
        if (reviewRatingInput) reviewRatingInput.value = rating;
        stars.forEach((s, idx) => { s.textContent = idx < rating ? '★' : '☆'; });
      });
      star.addEventListener('mouseenter', function() {
        const rating = this.dataset.rating;
        stars.forEach((s, idx) => { s.textContent = idx < rating ? '★' : '☆'; });
      });
    });
    starRating.addEventListener('mouseleave', function() {
      const currentRating = reviewRatingInput ? reviewRatingInput.value : 0;
      stars.forEach((s, idx) => { s.textContent = idx < currentRating ? '★' : '☆'; });
    });
  }
  
  await displayAllReviews();
  
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = reviewForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }
      
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
        if (starRating) starRating.querySelectorAll('.star').forEach((s, i) => { s.textContent = i < 5 ? '★' : '☆'; });
        await displayAllReviews();
      } else { alert('Failed to submit review. Please try again.'); }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Review'; }
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
    </div>`).join('');
}

// ==========================================
// MAIN INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  updateCartCount();
  initNavigation();
  initSearch();
  
  const path = window.location.pathname;
  
  if (path.includes('products.html')) showSkeletonLoading('#allProducts', 8);
  else if (path.includes('index.html') || path.endsWith('/')) showSkeletonLoading('#featuredProducts', 8);
  
  await loadProducts();
  console.log('✅ Products loaded, initializing page...');
  
  if (path.includes('products.html')) {
    const filterButtons = document.querySelectorAll('.filter-item[data-filter-type="category"]');
    const priceRange = document.getElementById('priceRange');
    const maxPriceValueEl = document.getElementById('maxPriceValue');
    
    function updateActiveFilter(category) { filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filterValue === category)); }
    
    const maxProductPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 1600;
    if (priceRange) { priceRange.setAttribute('max', Math.ceil(maxProductPrice)); priceRange.value = Math.ceil(maxProductPrice); }
    if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange?.value || maxProductPrice).toFixed(2)}`;
    
    const selectedCategory = sessionStorage.getItem('selectedCategory');
    updateActiveFilter(selectedCategory && selectedCategory !== 'all' ? selectedCategory : 'all');
    sessionStorage.removeItem('selectedCategory');
    
    applyFiltersAndSort();
    
    filterButtons.forEach(btn => { btn.addEventListener('click', () => { updateActiveFilter(btn.dataset.filterValue); applyFiltersAndSort(); }); });
    priceRange?.addEventListener('input', () => { if (maxPriceValueEl) maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`; applyFiltersAndSort(); });
    document.getElementById('inStockFilter')?.addEventListener('change', applyFiltersAndSort);
    document.getElementById('sortSelect')?.addEventListener('change', applyFiltersAndSort);
  }
  else if (path.includes('product.html')) { await displayProductDetail(); initLightbox(); }
  else if (path.includes('cart.html')) { displayCart(); initCartListeners(); }
  else if (path.includes('checkout.html')) { displayCheckoutSummary(); }
  else if (path.includes('thankyou.html')) {
    displayThankYouPage();
  }
  else if (path.includes('reviews.html')) { await initReviewsPage(); }
  else if (path.includes('index.html') || path.endsWith('/')) { displayProducts('#featuredProducts', products, 8); }
});

// ==========================================
// EXPOSE GLOBAL FUNCTIONS
// ==========================================

window.filterByCategory = filterByCategory;
window.clearVestaraCache = clearCache;
window.getCart = getCart;
window.calculateCartTotals = calculateCartTotals;

// ==========================================
// THANK YOU PAGE - ENHANCED
// ==========================================

function displayThankYouPage() {
  const thankYouContent = document.getElementById('thankYouContent');
  if (!thankYouContent) return;
  
  // Get saved order data
  const orderId = sessionStorage.getItem('lastOrderId');
  const orderDataStr = sessionStorage.getItem('lastOrderData');
  
  if (!orderId) {
    // No order found
    thankYouContent.innerHTML = `
      <div class="thank-you-container">
        <div class="thank-you-icon">✓</div>
        <h1 class="thank-you-title">Thank You!</h1>
        <p class="thank-you-subtitle">We appreciate your business.</p>
        <div class="thank-you-actions">
          <a href="products.html" class="btn btn-primary">Continue Shopping</a>
          <a href="index.html" class="btn btn-secondary">Back to Home</a>
        </div>
      </div>
    `;
    return;
  }
  
  // Parse order data
  let orderData = {};
  try {
    orderData = JSON.parse(orderDataStr) || {};
  } catch (e) {
    orderData = {};
  }
  
  const customerName = orderData.name || 'Valued Customer';
  const items = orderData.items || [];
  const subtotal = parseFloat(orderData.subtotal) || 0;
  const shipping = parseFloat(orderData.shipping) || 0;
  const total = parseFloat(orderData.total) || 0;
  const totalSavings = parseFloat(orderData.savings) || 0;
  
  // Build order items HTML
  let itemsHtml = '';
  if (items.length > 0) {
    itemsHtml = items.map(item => {
      const itemTotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
      return `
        <div class="order-item">
          <span class="order-item-name">${escapeHtml(item.name)} × ${item.quantity}</span>
          <span class="order-item-price">Rs ${itemTotal.toFixed(2)}</span>
        </div>
      `;
    }).join('');
  }
  
  // Shipping text
  const shippingText = shipping === 0 
    ? '<span class="free-shipping">FREE</span>' 
    : `Rs ${shipping.toFixed(2)}`;
  
  // Savings row (only show if there are savings)
  const savingsHtml = totalSavings > 0 
    ? `<div class="order-total-row savings-row">
         <span>Total Savings:</span>
         <span class="savings-amount">Rs ${totalSavings.toFixed(2)}</span>
       </div>` 
    : '';
  
  thankYouContent.innerHTML = `
    <div class="thank-you-container">
      <div class="confirmation-number">Confirmation #${escapeHtml(orderId)}</div>
      
      <div class="thank-you-header">
        <div class="thank-you-icon">✓</div>
        <h1 class="thank-you-title">Thank you, ${escapeHtml(customerName)}!</h1>
      </div>
      
      <div class="order-summary-box">
        <h2 class="order-summary-title">Order Summary</h2>
        
        <div class="order-items-list">
          ${itemsHtml}
        </div>
        
        <div class="order-totals">
          <div class="order-total-row">
            <span>Subtotal:</span>
            <span>Rs ${subtotal.toFixed(2)}</span>
          </div>
          <div class="order-total-row">
            <span>Shipping:</span>
            <span>${shippingText}</span>
          </div>
          <div class="order-total-row total-final">
            <span>Total:</span>
            <span>Rs ${total.toFixed(2)}</span>
          </div>
          ${savingsHtml}
        </div>
      </div>
      
      <p class="thank-you-message">
        We appreciate your purchase with Vestara! Your order is being processed and you'll receive a confirmation soon.
      </p>
      
      <div class="thank-you-actions">
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
        <a href="index.html" class="btn btn-secondary">Back to Home</a>
      </div>
    </div>
  `;
  
  // Clear order data after displaying
  sessionStorage.removeItem('lastOrderId');
  sessionStorage.removeItem('lastOrderData');
}

// ==========================================
// SAVE ORDER DATA FOR THANK YOU PAGE
// Call this function when order is placed
// ==========================================

function saveOrderForThankYou(orderId, customerName, cartItems, subtotal, shipping, total, savings = 0) {
  sessionStorage.setItem('lastOrderId', orderId);
  sessionStorage.setItem('lastOrderData', JSON.stringify({
    name: customerName,
    items: cartItems,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    savings: savings
  }));
}

// Expose function globally
window.saveOrderForThankYou = saveOrderForThankYou;