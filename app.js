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

// --- Product Utility Functions ---

// NEW FUNCTION: Handles redirection and filtering from the homepage
function filterByCategory(category) {
    // 1. Save the selected category to local storage
    localStorage.setItem('selectedCategory', category);
    // 2. Redirect to the products page
    window.location.href = 'products.html';
}

// Helper to generate star rating string
function generateStarRating(rating) {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return `${fullStars}${emptyStars} (${rating.toFixed(1)})`;
}

// --- Cart Functions (No Change) ---
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
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
    
    if (!product) return;
    
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
    showNotification(`${product.name} added to cart!`);
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
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// --- Navigation Functions (No Change) ---
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

// --- Display Functions (Corrected to isolate homepage/product page styling) ---
function displayProducts(containerSelector, productList, limit = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const productsToDisplay = limit ? productList.slice(0, limit) : productList;
    
    // Update product count if on the main product page
    if (containerSelector === '#allProducts') {
        const countDisplay = document.getElementById('productCountDisplay');
        if(countDisplay) countDisplay.textContent = productList.length;
    }

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">No products found in this category.</p>';
        return;
    }

    // Use the CLEAN card design ONLY for the main product list page
    if (containerSelector === '#allProducts') { 
        container.innerHTML = productsToDisplay.map(product => {
            // Logic to simulate Sale price
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
                            <span class="clean-price">$${product.price.toFixed(2)}</span>
                            ${isSale ? `<span class="clean-original-price">$${originalPrice}</span>` : ''}
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
         // Use the OLD design for other pages (index.html, product.html similar products)
        container.innerHTML = productsToDisplay.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                    <a href="product.html?id=${product.id}">
                        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                    </a>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <a href="product.html?id=${product.id}" class="btn btn-block">View Details</a>
                </div>
            </div>
        `).join('');
    }
}


// --- Filtering and Sorting Logic (No Change) ---

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

    // 1. Category Filter
    if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Price Filter
    filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);

    // 3. Stock Filter
    if (inStockOnly) {
        filteredProducts = filteredProducts.filter(p => p.inStock);
    }
    
    // 4. Sorting
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
        // 'default' or any other option maintains the filtered order
    }

    // 5. Display Results
    displayProducts('#allProducts', filteredProducts);
}

// --- Product Detail Page Logic (No Change) ---
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

    // Update Title
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.textContent = `Vestara - ${product.name}`;

    // Product Info
    const productInfo = document.getElementById('productInfo');
    if (productInfo) {
        productInfo.innerHTML = `
            <h1 class="product-name">${product.name}</h1>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-short-description" style="margin-bottom: 1rem; color: #666;">${product.shortDescription}</p>
            
            <div class="product-variant">
                <label>Color:</label>
                <div class="variant-options">
                    <span class="variant-option selected">Gold</span>
                </div>
            </div>

            <button class="add-to-cart-btn" id="addToCartBtn">Add to Cart</button>
            
            <div class="product-long-description" style="margin-top: 2rem; font-size: 0.9rem; line-height: 1.6;">
                <h3>Description</h3>
                <p>${product.longDescription}</p>
            </div>
        `;

        document.getElementById('addToCartBtn').addEventListener('click', () => {
            addToCart(product.id, 1);
        });
    }

    // Product Gallery
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

        productGallery.innerHTML = mainImageHtml + `<div class="thumbnail-gallery" style="margin-top: 1rem;">${thumbnailsHtml}</div>`;

        // Thumbnails logic
        document.querySelectorAll('.thumbnail-image-container').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                updateMainImage(index);
            });
        });
        
        // Lightbox trigger
        const mainImg = document.getElementById('mainProductImage');
        if(mainImg) {
            mainImg.addEventListener('click', () => openLightbox(currentImageIndex));
        }
    }
    
    // Similar Products
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

// --- Lightbox Functions (No Change) ---
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


// --- MASTER INITIALIZATION (FIXED STRUCTURE) ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initNavigation();
    
    const path = window.location.pathname;

    // 1. PRODUCTS LIST PAGE (Products.html - Contains filtering/sorting)
    if (path.includes('products.html')) {
        const filterButtons = document.querySelectorAll('.filter-item[data-filter-type="category"]'); 
        const priceRange = document.getElementById('priceRange');
        const maxPriceValueEl = document.getElementById('maxPriceValue');
        const inStockFilter = document.getElementById('inStockFilter');
        const sortSelect = document.getElementById('sortSelect');

        // Helper to update UI buttons
        function updateActiveFilter(category) { 
            filterButtons.forEach(b => {
                if(b.dataset.filterValue === category) b.classList.add('active');
                else b.classList.remove('active');
            });
        }
        
        // Setup initial price filter values
        const maxProductPrice = Math.max(...products.map(p => p.price));
        if (priceRange) {
            priceRange.setAttribute('max', Math.ceil(maxProductPrice));
            priceRange.value = Math.ceil(maxProductPrice);
        }
        if (maxPriceValueEl) {
            maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`;
        }

        // Handle initial load (from homepage redirect)
        const selectedCategory = localStorage.getItem('selectedCategory');
        
        if (selectedCategory && selectedCategory !== 'all') {
            updateActiveFilter(selectedCategory);
            // Crucial: remove it after reading so that subsequent visits to products.html aren't stuck on one category
            localStorage.removeItem('selectedCategory'); 
        } else {
            updateActiveFilter('all');
        }
        
        // Initial Display
        applyFiltersAndSort(); 

        // --- Event Listeners ---

        // Category Filter Clicks
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                updateActiveFilter(btn.dataset.filterValue);
                applyFiltersAndSort();
            });
        });

        // Price Range Input
        if (priceRange) {
            priceRange.addEventListener('input', () => {
                if (maxPriceValueEl) {
                    maxPriceValueEl.textContent = `${parseFloat(priceRange.value).toFixed(2)}`;
                }
                // Delay applying the filter slightly for better performance while dragging the slider
                applyFiltersAndSort(); 
            });
        }
        
        // In Stock Checkbox
        if (inStockFilter) {
            inStockFilter.addEventListener('change', applyFiltersAndSort);
        }
        
        // Sort Dropdown
        if (sortSelect) {
            sortSelect.addEventListener('change', applyFiltersAndSort);
        }
    }
    
    // 2. PRODUCT DETAILS PAGE (product.html - Does NOT run on products.html)
    else if (path.includes('product.html')) {
        displayProductDetail();
        initLightbox();
    }
    
    // 3. HOME PAGE (index.html)
    else if (path.includes('index.html') || path.endsWith('/')) {
        displayProducts('#featuredProducts', products, 8);
    }
});