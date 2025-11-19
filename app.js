// --- Product Data ---
const products = [
    {
        id: 1,
        name: "Golden Mesh Ring",
        price: 900.00,
        category: "Bracelets",
        inStock: true,
        rating: 4.5,
        shortDescription: "Luxurious mesh design gold plated ring",
        longDescription: "This stunning mesh ring features an intricate design that catches the light from every angle. Gold plated and adjustable.",
        images: [
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
        ]
    },
    {
        id: 2,
        name: "Heart Drop Earrings",
        price: 1530.00,
        category: "Earrings",
        inStock: true,
        rating: 4.9,
        shortDescription: "Double heart gold statement earrings",
        longDescription: "Bold and beautiful, these double heart drop earrings are the perfect statement piece for any outfit. Lightweight and comfortable.",
        images: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
            "https://images.unsplash.com/photo-1630019852942-f89202989a51?w=800&q=80"
        ]
    },
    {
        id: 3,
        name: "Snake Chain Necklace",
        price: 1130.00,
        category: "Necklaces",
        inStock: true,
        rating: 4.2,
        shortDescription: "Flat herringbone gold snake chain",
        longDescription: "A classic essential. This herringbone snake chain lays flat against the skin, creating a liquid gold effect. Perfect for layering.",
        images: [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
        ]
    },
    {
        id: 4,
        name: "Chain Link Cuff",
        price: 830.00,
        category: "Anklets",
        inStock: false,
        rating: 3.8,
        shortDescription: "Minimalist chain link adjustable cuff",
        longDescription: "Modern and minimalist, this chain link cuff adds a touch of edge to your everyday look. Adjustable fit.",
        images: [
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
        ]
    },
    {
        id: 5,
        name: "Pearl Drop Earrings",
        price: 1200.00,
        category: "Earrings",
        inStock: true,
        rating: 5.0,
        shortDescription: "Classic freshwater pearl drop earrings",
        longDescription: "Timeless elegance. These freshwater pearl drop earrings feature a delicate gold setting.",
        images: [
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
        ]
    },
    {
        id: 6,
        name: "Layered Gold Necklace",
        price: 1450.00,
        category: "Necklaces",
        inStock: true,
        rating: 4.7,
        shortDescription: "Pre-layered double chain necklace",
        longDescription: "Get the layered look instantly with this double chain necklace set. Features two complementary chain styles.",
        images: [
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"
        ]
    },
    {
        id: 7,
        name: "Charm Bracelet",
        price: 950.00,
        category: "Bracelets",
        inStock: false,
        rating: 4.1,
        shortDescription: "Dainty gold chain with mini charms",
        longDescription: "A delicate addition to your wrist stack. This dainty chain features small, light-catching charms.",
        images: [
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80"
        ]
    },
    {
        id: 8,
        name: "Beaded Anklet",
        price: 650.00,
        category: "Anklets",
        inStock: true,
        rating: 4.0,
        shortDescription: "Gold beaded summer anklet",
        longDescription: "Summer ready. This beaded anklet features small gold beads on a durable chain.",
        images: [
            "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80"
        ]
    }
];

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
            setTimeout(() => searchInput.focus(), 100);
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchModal.classList.remove('active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        });
    }

    // Close on overlay click
    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                searchInput.value = '';
                searchResults.innerHTML = '';
            }
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const results = products.filter(product => 
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.shortDescription.toLowerCase().includes(query)
            );

            displaySearchResults(results);
        });
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <a href="product.html?id=${product.id}" class="search-result-item">
            <img src="${product.images[0]}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p class="search-result-price">RS.${product.price.toFixed(2)}</p>
                ${!product.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ''}
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
    const cartCountElements = document.querySelectorAll('#cartCount, #navCartCount');
    cartCountElements.forEach(el => {
        if(el) el.textContent = count;
    });
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const product = products.find(p => p.id === productId);
    
    if (!product || quantity < 1) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification(`${quantity} x ${product.name} added to cart!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #000000;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 0.875rem;
        letter-spacing: 1px;
        text-transform: uppercase;
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
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = subtotal > 5000 ? 0.00 : 250.00;
    const taxRate = 0.0;
    const tax = subtotal * taxRate;
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
        <div class="cart-item" data-product-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">RS.${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly class="quantity-input" data-id="${item.id}">
                    <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-subtotal">RS.${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item-btn btn" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');

    document.getElementById('cartSubtotal').textContent = `RS.${totals.subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = totals.shipping === 0.00 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`;
    document.getElementById('cartTax').textContent = `RS.${totals.tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `RS.${totals.total.toFixed(2)}`;
}

function initCartListeners() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    cartItemsList.addEventListener('click', (e) => {
        const target = e.target;
        const productId = parseInt(target.dataset.id);

        if (isNaN(productId)) return;

        if (target.classList.contains('qty-plus')) {
            updateQuantity(productId, 1);
        } else if (target.classList.contains('qty-minus')) {
            updateQuantity(productId, -1);
        } else if (target.classList.contains('remove-item-btn')) {
            removeFromCart(productId);
        }
    });
}

function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity < 1) {
            item.quantity = 1;
        }
    }
    saveCart(cart);
    displayCart();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    displayCart();
    showNotification("Item removed from cart.");
}

function displayCheckoutSummary() {
    const cart = getCart();
    const itemsListContainer = document.getElementById('checkoutItemsList');
    const totals = calculateCartTotals();
    
    if (!itemsListContainer) return;
    
    const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
    const checkoutShippingEl = document.getElementById('checkoutShipping');
    const checkoutTaxEl = document.getElementById('checkoutTax');
    const checkoutTotalEl = document.getElementById('checkoutTotal');
    
    if (!checkoutTotalEl) return;
    
    if (cart.length === 0) {
        itemsListContainer.innerHTML = '<p style="padding: 1rem; text-align: center;">Your cart is empty. Please add items to proceed.</p>';
        
        checkoutSubtotalEl.textContent = '$0.00';
        checkoutShippingEl.textContent = '$0.00';
        checkoutTaxEl.textContent = '$0.00';
        checkoutTotalEl.textContent = '$0.00';
        return;
    }
    
    itemsListContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span class="item-name">${item.name} x${item.quantity}</span>
            <span class="item-price">RS.${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    checkoutSubtotalEl.textContent = `RS.${totals.subtotal.toFixed(2)}`;
    checkoutShippingEl.textContent = totals.shipping === 0.00 ? 'FREE' : `RS.${totals.shipping.toFixed(2)}`;
    checkoutTaxEl.textContent = `RS.${totals.tax.toFixed(2)}`;
    checkoutTotalEl.textContent = `RS.${totals.total.toFixed(2)}`;
}

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navClose = document.getElementById('navClose');
    const navOverlay = document.getElementById('navOverlay');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }
    
    if (navClose) {
        navClose.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }
}

function displayProducts(containerSelector, productList, limit = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const productsToDisplay = limit ? productList.slice(0, limit) : productList;
    
    if (containerSelector === '#allProducts') {
        const countDisplay = document.getElementById('productCountDisplay');
        if(countDisplay) countDisplay.textContent = productList.length;
    }

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No products found in this category.</p>';
        return;
    }

    if (containerSelector === '#allProducts') {
        container.innerHTML = productsToDisplay.map(product => {
            const isSale = product.id % 2 === 0;
            const originalPrice = (product.price * 1.2).toFixed(2);
            const discount = Math.floor(Math.random() * 20) + 10;
            const productNameUpper = product.name.toUpperCase();
            
            return `
                <div class="product-card-clean">
                    <div class="clean-image-container">
                        ${isSale ? `<span class="badge-sale">SAVE ${discount}%</span>` : ''}
                        ${!product.inStock ? '<span class="badge-sale" style="background-color: #333; left: auto; right: 0;">SOLD OUT</span>' : ''}
                        <a href="product.html?id=${product.id}">
                            <img src="${product.images[0]}" alt="${product.name}">
                        </a>
                    </div>
                    <div class="clean-info">
                        <h3 class="clean-name">${productNameUpper}</h3>
                        <div class="clean-price-box">
                            <span class="clean-price">RS.${product.price.toFixed(2)}</span>
                            ${isSale ? `<span class="clean-original-price">RS.${originalPrice}</span>` : ''}
                        </div>
                        <div class="star-rating-static">${generateStarRating(product.rating || 4.5)}</div>
                        <div class="color-dots">
                            <div class="dot gold"></div>
                            <div class="dot silver"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        container.innerHTML = productsToDisplay.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                    </a>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">RS.${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}" class="btn btn-block">View Details</a>
                </div>
            </div>
        `).join('');
    }
}

function getFiltersAndSortState() {
    const selectedCategory = document.querySelector('.filter-item.active[data-filter-type="category"]')?.dataset.filterValue || 'all';
    const maxPrice = parseFloat(document.getElementById('priceRange')?.value) || Infinity;
    const inStockOnly = document.getElementById('inStockFilter')?.checked || false;
    const sortBy = document.getElementById('sortSelect')?.value || 'default';

    return { selectedCategory, maxPrice, inStockOnly, sortBy };
}

function applyFiltersAndSort() {
    const { selectedCategory, maxPrice, inStockOnly, sortBy } = getFiltersAndSortState();
    let filteredProducts = [...products];

    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);

    if (inStockOnly) {
        filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    
    switch (sortBy) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    displayProducts('#allProducts', filteredProducts);
}

let currentImageIndex = 0;
let currentProductImages = [];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id')) || 1;
}

function displayProductDetail() {
    const productId = getProductIdFromUrl();
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Product not found");
        return;
    }

    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.textContent = `Vestara - ${product.name}`;

    const productInfo = document.getElementById('productInfo');
    if (productInfo) {
        productInfo.innerHTML = `
            <h1 class="product-name">${product.name}</h1>
            <p class="product-price">RS.${product.price.toFixed(2)}</p>
            <p class="product-short-description">${product.shortDescription}</p>
            
            <div class="product-variant">
                <label>Color:</label>
                <div class="variant-options">
                    <span class="variant-option selected">Gold</span>
                </div>
            </div>
            
            <div class="quantity-selector">
                <label>Quantity:</label>
                <div class="quantity-controls">
                    <button class="qty-btn" id="qtyMinus">-</button>
                    <input type="number" id="quantityInput" value="1" min="1" readonly>
                    <button class="qty-btn" id="qtyPlus">+</button>
                </div>
            </div>

            <button class="add-to-cart-btn" id="addToCartBtn">${product.inStock ? 'Add to Cart' : 'Out of Stock'}</button>
            
            <div class="product-long-description">
                <h3>Description</h3>
                <p>${product.longDescription}</p>
            </div>
        `;

        const quantityInput = document.getElementById('quantityInput');
        const qtyMinus = document.getElementById('qtyMinus');
        const qtyPlus = document.getElementById('qtyPlus');
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        if (qtyPlus) {
            qtyPlus.addEventListener('click', () => {
                let currentQty = parseInt(quantityInput.value);
                quantityInput.value = currentQty + 1;
            });
        }
        
        if (qtyMinus) {
            qtyMinus.addEventListener('click', () => {
                let currentQty = parseInt(quantityInput.value);
                if (currentQty > 1) {
                    quantityInput.value = currentQty - 1;
                }
            });
        }
        
        if (addToCartBtn && product.inStock) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                addToCart(product.id, quantity);
            });
        }
    }

    currentProductImages = product.images;
    const productGallery = document.getElementById('productGallery');
    
    if (productGallery) {
        const mainImageHtml = `
            <div class="main-image-container">
                <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="mainProductImage">
            </div>
        `;

        const thumbnailsHtml = product.images.map((img, index) => `
            <div class="thumbnail-image-container ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${img}" alt="${product.name} thumbnail" class="thumbnail-image">
            </div>
        `).join('');

        productGallery.innerHTML = mainImageHtml + `<div class="thumbnail-gallery">${thumbnailsHtml}</div>`;

        document.querySelectorAll('.thumbnail-image-container').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                updateMainImage(index);
            });
        });
        
        const mainImg = document.getElementById('mainProductImage');
        if(mainImg) {
            mainImg.addEventListener('click', () => openLightbox(currentImageIndex));
        }
    }
    
    const similarContainer = document.getElementById('similarProductsScroll');
    if(similarContainer) {
        const similar = products.filter(p => p.category === product.category && p.id !== product.id);
        displayProducts('#similarProductsScroll', similar.length ? similar : products.slice(0,4));
    }
}

function updateMainImage(index) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail-image-container');

    if(mainImage) mainImage.src = currentProductImages[index];

    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    if(thumbnails[index]) thumbnails[index].classList.add('active');
    currentImageIndex = index;
}

function initLightbox() {
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => changeLightboxImage(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeLightboxImage(1));

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.style.display === "block") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") changeLightboxImage(-1);
            if (e.key === "ArrowRight") changeLightboxImage(1);
        }
    });
}

function openLightbox(index) {
    if(!lightbox || !lightboxImage) return;
    currentImageIndex = index;
    lightbox.style.display = "block";
    lightboxImage.src = currentProductImages[currentImageIndex];
}

function closeLightbox() {
    if(lightbox) lightbox.style.display = "none";
}

function changeLightboxImage(direction) {
    currentImageIndex = (currentImageIndex + direction + currentProductImages.length) % currentProductImages.length;
    if(lightboxImage) lightboxImage.src = currentProductImages[currentImageIndex];
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initNavigation();
    initSearch();
    
    const path = window.location.pathname;

    if (path.includes('products.html')) {
        const filterButtons = document.querySelectorAll('.filter-item[data-filter-type="category"]');
        const priceRange = document.getElementById('priceRange');
        const maxPriceValueEl = document.getElementById('maxPriceValue');
        const inStockFilter = document.getElementById('inStockFilter');
        const sortSelect = document.getElementById('sortSelect');

        function updateActiveFilter(category) {
            filterButtons.forEach(b => {
                if(b.dataset.filterValue === category) b.classList.add('active');
                else b.classList.remove('active');
            });
        }
        
        const maxProductPrice = Math.max(...products.map(p => p.price));
        if (priceRange) {
            priceRange.setAttribute('max', Math.ceil(maxProductPrice));
            priceRange.value = Math.ceil(maxProductPrice);
        }
        if (maxPriceValueEl) {
            maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`;
        }

        const selectedCategory = sessionStorage.getItem('selectedCategory');
        
        if (selectedCategory && selectedCategory !== 'all') {
            updateActiveFilter(selectedCategory);
            sessionStorage.removeItem('selectedCategory');
        } else {
            updateActiveFilter('all');
        }
        
        applyFiltersAndSort();

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                updateActiveFilter(btn.dataset.filterValue);
                applyFiltersAndSort();
            });
        });

        if (priceRange) {
            priceRange.addEventListener('input', () => {
                if (maxPriceValueEl) {
                    maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`;
                }
                applyFiltersAndSort();
            });
        }
        
        if (inStockFilter) {
            inStockFilter.addEventListener('change', applyFiltersAndSort);
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFiltersAndSort);
        }
    }
    
    else if (path.includes('product.html')) {
        displayProductDetail();
        initLightbox();
    }
    
    else if (path.includes('cart.html')) {
        displayCart();
        initCartListeners();
    }
    
    else if (path.includes('checkout.html')) {
        displayCheckoutSummary();
        
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (checkoutForm.checkValidity()) {
                    const orderId = `VESTARA-${Math.floor(Math.random() * 100000)}`;
                    sessionStorage.setItem('lastOrderId', orderId);
                    sessionStorage.removeItem('cart');
                    updateCartCount();
                    window.location.href = 'thankyou.html';
                } else {
                    checkoutForm.reportValidity();
                }
            });
        }
    }
    
    else if (path.includes('thankyou.html')) {
        const orderId = sessionStorage.getItem('lastOrderId');
        const thankYouContent = document.getElementById('thankYouContent');
        
        if (thankYouContent) {
            if (orderId) {
                thankYouContent.innerHTML = `
                    <div class="thank-you-message">
                        <h2 class="section-title">Order Placed Successfully!</h2>
                        <p>Thank you for your purchase. Your order number is <strong>${orderId}</strong>.</p>
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
                        <p>We appreciate your business. If you just completed an order, please check your email for confirmation.</p>
                        <div style="margin-top: 2rem;">
                            <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                        </div>
                    </div>
                `;
            }
        }
    }
    
    else if (path.includes('index.html') || path.endsWith('/')) {
        displayProducts('#featuredProducts', products, 8);
    }
});