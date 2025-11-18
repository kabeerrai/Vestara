
// Product Data with Categories
const products = [
    {
        id: 1,
        name: "Modern Velvet Sofa",
        price: 899.99,
        category: "Bracelets",
        shortDescription: "Luxurious velvet sofa with solid wood frame and plush cushioning",
        longDescription: "Transform your living space with this stunning modern velvet sofa. Crafted with premium velvet upholstery and a sturdy solid wood frame, this sofa combines comfort with contemporary design. The deep seating and plush cushioning provide exceptional comfort for relaxation. Perfect for modern homes, apartments, and condos. Available in multiple colors. Dimensions: 84\"W x 36\"D x 32\"H. Assembly required.",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
    },
    {
        id: 2,
        name: "Ceramic Table Lamp",
        price: 129.99,
        category: "Earrings",
        shortDescription: "Elegant ceramic lamp with linen shade and brass accents",
        longDescription: "Illuminate your space with this sophisticated ceramic table lamp. Features a hand-crafted ceramic base with a beautiful textured finish, complemented by a natural linen shade and brass hardware. Perfect for bedside tables, console tables, or accent lighting in any room. Includes a 3-way switch for adjustable brightness. Bulb not included (requires E26 base). Dimensions: 16\" height x 9\" diameter shade.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80"
    },
    {
        id: 3,
        name: "Geometric Wall Art Set",
        price: 199.99,
        category: "Necklaces",
        shortDescription: "Set of 3 framed geometric prints with gold foil accents",
        longDescription: "Elevate your wall decor with this stunning set of three geometric art prints. Each piece features modern geometric patterns with elegant gold foil accents on premium art paper. Comes in sleek black frames with premium glass and ready to hang. Perfect for living rooms, bedrooms, offices, or galleries. Creates a cohesive and sophisticated look. Frame dimensions: 16\" x 20\" each. Arrives ready to hang with included hardware.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80"
    },
    {
        id: 4,
        name: "Marble Coffee Table",
        price: 549.99,
        category: "Anklets",
        shortDescription: "Contemporary round coffee table with marble top and gold base",
        longDescription: "Make a statement with this luxurious marble coffee table. Features a genuine marble top with unique natural veining, supported by an elegant gold-finished metal base. The round design provides a soft aesthetic while the durable construction ensures long-lasting beauty. Perfect centerpiece for modern living rooms. Easy to clean and maintain. Dimensions: 36\" diameter x 18\" height. Minor assembly required. Each piece is unique due to natural marble variations.",
        image: "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?w=800&q=80"
    },
    {
        id: 5,
        name: "Bohemian Area Rug",
        price: 279.99,
        category: "Bracelets",
        shortDescription: "Hand-woven area rug with vintage-inspired medallion pattern",
        longDescription: "Add warmth and character to any room with this beautiful bohemian area rug. Hand-woven from premium quality materials featuring an intricate vintage-inspired medallion pattern in rich, earthy tones. The durable construction makes it perfect for high-traffic areas while remaining soft underfoot. Features a low pile height for easy furniture placement. Size: 8' x 10'. Spot clean only. Non-slip rug pad recommended (sold separately).",
        image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=800&q=80"
    },
    {
        id: 6,
        name: "Accent Armchair",
        price: 449.99,
        category: "Earrings",
        shortDescription: "Mid-century modern armchair with solid oak legs",
        longDescription: "Bring timeless style to your space with this mid-century modern accent armchair. Features premium upholstery in a sophisticated neutral tone, solid oak legs with a natural finish, and ergonomic design for optimal comfort. The compact size makes it perfect for reading nooks, bedrooms, or as additional seating in living areas. Removable cushion cover for easy cleaning. Supports up to 300 lbs. Dimensions: 30\"W x 32\"D x 35\"H. Minimal assembly required.",
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80"
    },
    {
        id: 7,
        name: "Glass Pendant Light",
        price: 189.99,
        category: "Necklaces",
        shortDescription: "Elegant glass pendant with adjustable hanging height",
        longDescription: "Create ambient lighting with this stunning glass pendant light. Features hand-blown clear glass with subtle bubbles and imperfections that add character. The adjustable cord allows you to customize the hanging height. Perfect for kitchen islands, dining tables, or entryways. Compatible with LED bulbs for energy efficiency. Includes all mounting hardware. Bulb not included (requires E26 base, max 60W). Dimensions: 10\" diameter x 12\" height.",
        image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80"
    },
    {
        id: 8,
        name: "Decorative Throw Pillows",
        price: 79.99,
        category: "Anklets",
        shortDescription: "Set of 2 velvet throw pillows with hidden zippers",
        longDescription: "Add instant style and comfort to your sofa or bed with this set of two premium velvet throw pillows. Made from high-quality velvet fabric in a rich, saturated color that resists fading. Features hidden zippers for a seamless look and removable covers for easy washing. Includes premium poly-fill inserts that maintain their shape. Perfect for layering with other textures and patterns. Dimensions: 18\" x 18\" each. Available in multiple colors. Machine washable covers.",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80"
    },
    {
        id: 9,
        name: "Wooden Console Table",
        price: 399.99,
        category: "Bracelets",
        shortDescription: "Rustic console table with bottom shelf for storage",
        longDescription: "Maximize your entryway or hallway with this functional wooden console table. Crafted from solid wood with a beautiful natural grain finish, this table combines rustic charm with modern functionality. Features a spacious top surface and bottom shelf for storage or display. Perfect for keys, mail, decorative items, or as a media console. Sturdy construction supports up to 150 lbs. Dimensions: 48\"W x 16\"D x 32\"H. Easy assembly with included instructions and hardware.",
        image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80"
    },
    {
        id: 10,
        name: "Metal Wall Shelf Set",
        price: 149.99,
        category: "Earrings",
        shortDescription: "Set of 3 floating shelves with industrial metal brackets",
        longDescription: "Create functional and stylish wall storage with this set of three floating shelves. Features solid wood shelves with industrial-style metal brackets in a matte black finish. Perfect for displaying books, plants, photos, and decorative objects. Adds character to any room while providing practical storage. Includes all mounting hardware. Each shelf supports up to 25 lbs when properly installed. Shelf dimensions: Large (24\"W), Medium (20\"W), Small (16\"W), all 6\"D x 1.5\"H.",
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80"
    },
    {
        id: 11,
        name: "Textured Throw Blanket",
        price: 89.99,
        category: "Necklaces",
        shortDescription: "Chunky knit throw blanket in soft cotton blend",
        longDescription: "Cozy up with this luxuriously soft chunky knit throw blanket. Made from a premium cotton blend that's both warm and breathable, perfect for year-round use. The oversized design provides full coverage whether you're relaxing on the sofa or adding an extra layer to your bed. The beautiful texture adds visual interest to any room. Machine washable for easy care. Dimensions: 50\" x 60\". Available in multiple neutral colors to complement any decor.",
        image: "https://images.unsplash.com/photo-1610224267999-b1a0e1f64f89?w=800&q=80"
    },
    {
        id: 12,
        name: "Ceramic Vase Collection",
        price: 119.99,
        category: "Anklets",
        shortDescription: "Set of 3 modern ceramic vases in varying heights",
        longDescription: "Enhance your tabletop or shelf with this elegant set of three ceramic vases. Each vase features a unique modern silhouette with a smooth matte finish in coordinating neutral tones. Perfect for fresh or dried flowers, or beautiful as standalone decorative pieces. The varying heights create visual interest when grouped together. Made from high-quality ceramic with attention to detail. Dimensions: Tall (12\"H), Medium (9\"H), Short (6\"H). Hand wash recommended.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80"
    }
];

// Default Reviews Data
const defaultReviews = [
    {
        name: "Sarah Johnson",
        rating: 5,
        text: "Absolutely love my purchases from Luxe Living! The quality is outstanding and the pieces look even better in person. The velvet sofa is so comfortable and has become the centerpiece of my living room.",
        date: "2025-11-10"
    },
    {
        name: "Michael Chen",
        rating: 5,
        text: "Great customer service and beautiful products. I ordered the marble coffee table and it arrived perfectly packaged. The natural veining in the marble is gorgeous. Highly recommend!",
        date: "2025-11-08"
    },
    {
        name: "Emily Rodriguez",
        rating: 4,
        text: "Really happy with my order. The geometric wall art set looks amazing in my office. One star off because shipping took a bit longer than expected, but worth the wait!",
        date: "2025-11-05"
    },
    {
        name: "David Thompson",
        rating: 5,
        text: "The accent armchair is perfect! Exactly what I was looking for. Comfortable, stylish, and well-made. Assembly was super easy too.",
        date: "2025-11-02"
    },
    {
        name: "Jessica Lee",
        rating: 5,
        text: "I've ordered multiple items and everything has been fantastic. The attention to detail and quality is evident in every piece. My home has never looked better!",
        date: "2025-10-28"
    }
];

// Cart Functions
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
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = count;
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
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification('Item added to cart!');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart(cart);
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
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

// Navigation Functions
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

// Product Display Functions
function displayProducts(containerSelector, productList, limit = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const productsToDisplay = limit ? productList.slice(0, limit) : productList;
    
    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.shortDescription}</p>
                <a href="product.html?id=${product.id}" class="btn btn-primary btn-block">View Details</a>
            </div>
        </div>
    `).join('');
}

// Category Functions
function initCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const categoryContents = document.querySelectorAll('.category-content');
    
    if (categoryTabs.length === 0) return;
    
    // Display products for each category
    const categories = ['Bracelets', 'Earrings', 'Necklaces', 'Anklets'];
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const containerId = `#category-${category.toLowerCase()}`;
        displayProducts(containerId, categoryProducts, 6);
    });
    
    // Tab switching functionality
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Remove active class from all tabs and contents
            categoryTabs.forEach(t => t.classList.remove('active'));
            categoryContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`category-${category}`).classList.add('active');
        });
    });
    
    // Activate first tab by default
    if (categoryTabs.length > 0) {
        categoryTabs[0].click();
    }
}

// Similar Products Functions
function getSimilarProducts(currentProduct, limit = 3) {
    // First, try to get products from the same category
    let similarProducts = products.filter(p => 
        p.id !== currentProduct.id && p.category === currentProduct.category
    );
    
    // If not enough products in the same category, add random products
    if (similarProducts.length < limit) {
        const remainingProducts = products.filter(p => 
            p.id !== currentProduct.id && p.category !== currentProduct.category
        );
        
        // Shuffle and add remaining products
        const shuffled = remainingProducts.sort(() => 0.5 - Math.random());
        similarProducts = [...similarProducts, ...shuffled].slice(0, limit);
    } else {
        similarProducts = similarProducts.slice(0, limit);
    }
    
    return similarProducts;
}

function displaySimilarProducts(currentProductId) {
    const currentProduct = products.find(p => p.id === currentProductId);
    const container = document.getElementById('similarProductsGrid');
    
    if (!container || !currentProduct) return;
    
    const similarProducts = getSimilarProducts(currentProduct, 3);
    
    container.innerHTML = similarProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.shortDescription}</p>
                <a href="product.html?id=${product.id}" class="btn btn-primary btn-block">View Product</a>
            </div>
        </div>
    `).join('');
}

function displayProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productShortDescription').textContent = product.shortDescription;
    document.getElementById('productLongDescription').textContent = product.longDescription;
    
    document.title = `${product.name} - Luxe Living`;
    
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    qtyMinus.addEventListener('click', () => {
        if (qtyInput.value > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
    
    qtyPlus.addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    
    addToCartBtn.addEventListener('click', () => {
        addToCart(product.id, parseInt(qtyInput.value));
    });
    
    // Display similar products
    displaySimilarProducts(productId);
}

// Cart Functions
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
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = count;
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
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    showNotification('Item added to cart!');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart(cart);
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Navigation Functions
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

// Product Display Functions
function displayProducts(containerSelector, productList, limit = null) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const productsToDisplay = limit ? productList.slice(0, limit) : productList;
    
    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.shortDescription}</p>
                <a href="product.html?id=${product.id}" class="btn btn-primary btn-block">View Details</a>
            </div>
        </div>
    `).join('');
}

function displayProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'products.html';
        return;
    }
    
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productShortDescription').textContent = product.shortDescription;
    document.getElementById('productLongDescription').textContent = product.longDescription;
    
    document.title = `${product.name} - Luxe Living`;
    
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    qtyMinus.addEventListener('click', () => {
        if (qtyInput.value > 1) {
            qtyInput.value = parseInt(qtyInput.value) - 1;
        }
    });
    
    qtyPlus.addEventListener('click', () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    
    addToCartBtn.addEventListener('click', () => {
        addToCart(product.id, parseInt(qtyInput.value));
    });
}

// Cart Page Functions
function displayCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('emptyCart');
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Checkout Functions
function displayCheckoutSummary() {
    const cart = getCart();
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    const checkoutItems = document.getElementById('checkoutItems');
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div>
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;
    
    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    const cardFields = document.getElementById('cardFields');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardFields.style.display = 'block';
                document.getElementById('cardNumber').required = true;
                document.getElementById('expiry').required = true;
                document.getElementById('cvv').required = true;
            } else {
                cardFields.style.display = 'none';
                document.getElementById('cardNumber').required = false;
                document.getElementById('expiry').required = false;
                document.getElementById('cvv').required = false;
            }
        });
    });
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const orderNumber = Math.floor(100000 + Math.random() * 900000);
            const cart = getCart();
            
            localStorage.setItem('lastOrder', JSON.stringify({
                orderNumber: orderNumber,
                items: cart,
                date: new Date().toISOString()
            }));
            
            clearCart();
            window.location.href = 'thankyou.html';
        });
    }
}

// Thank You Page
function displayOrderConfirmation() {
    const lastOrder = localStorage.getItem('lastOrder');
    
    if (!lastOrder) {
        window.location.href = 'index.html';
        return;
    }
    
    const order = JSON.parse(lastOrder);
    document.getElementById('orderNumber').textContent = order.orderNumber;
    
    const orderDetails = document.getElementById('orderDetails');
    const subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + shipping;
    
    orderDetails.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Order Summary</h3>
        ${order.items.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('')}
        <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.125rem; margin-top: 0.5rem;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
    `;
}

// Reviews Functions
function getReviews() {
    const savedReviews = localStorage.getItem('reviews');
    return savedReviews ? JSON.parse(savedReviews) : defaultReviews;
}

function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function displayReviews() {
    const reviews = getReviews();
    const reviewsList = document.getElementById('reviewsList');
    
    if (!reviewsList) return;
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-author">${review.name}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
            </div>
            <div class="review-date">${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

function initReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    const starRating = document.getElementById('starRating');
    const reviewRatingInput = document.getElementById('reviewRating');
    const stars = starRating.querySelectorAll('.star');
    
    let selectedRating = 5;
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            reviewRatingInput.value = selectedRating;
            updateStars(selectedRating);
        });
        
        star.addEventListener('mouseenter', () => {
            updateStars(parseInt(star.dataset.rating));
        });
    });
    
    starRating.addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });
    
    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.dataset.rating);
            star.classList.toggle('active', starRating <= rating);
            star.textContent = starRating <= rating ? '★' : '☆';
        });
    }
    
    updateStars(5);
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newReview = {
                name: document.getElementById('reviewName').value,
                rating: selectedRating,
                text: document.getElementById('reviewText').value,
                date: new Date().toISOString().split('T')[0]
            };
            
            const reviews = getReviews();
            reviews.unshift(newReview);
            saveReviews(reviews);
            
            reviewForm.reset();
            selectedRating = 5;
            updateStars(5);
            displayReviews();
            showNotification('Thank you for your review!');
        });
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const successMsg = document.getElementById('contactSuccess');
            successMsg.style.display = 'block';
            contactForm.reset();
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 5000);
        });
    }
}

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initNavigation();
    
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        displayProducts('#featuredProducts', products, 6);
    }
    
    if (path.includes('products.html')) {
        displayProducts('#allProducts', products);
    }
    
    if (path.includes('product.html')) {
        displayProductDetail();
    }
    
    if (path.includes('cart.html')) {
        displayCart();
    }
    
    if (path.includes('checkout.html')) {
        displayCheckoutSummary();
        initCheckoutForm();
    }
    
    if (path.includes('thankyou.html')) {
        displayOrderConfirmation();
    }
    
    if (path.includes('reviews.html')) {
        displayReviews();
        initReviewForm();
    }
    
    if (path.includes('contact.html')) {
        initContactForm();
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);