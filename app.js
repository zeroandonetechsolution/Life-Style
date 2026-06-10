// --- Global State Management ---
window.cart = JSON.parse(localStorage.getItem('lifestyle_cart')) || [];
window.user = JSON.parse(localStorage.getItem('lifestyle_user')) || null;

window.saveCart = function() {
    localStorage.setItem('lifestyle_cart', JSON.stringify(window.cart));
}

// Determine API URL: Use port 3000 for localhost, otherwise current origin
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.')) 
    ? `${window.location.protocol}//${window.location.hostname}:3000` 
    : window.location.origin;

// Mock Data Fallback (to ensure UI works even if server is slow/down)
const MOCK_PRODUCTS = [
    { id: 1, name: "Premium Oud", description: "Deep, mysterious woody scent.", price: 4500, offer_price: 3999, category: "perfumes", image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", rating: 4.8 },
    { id: 2, name: "Royal Saffron", description: "Spicy and floral luxury.", price: 3200, offer_price: 2800, category: "perfumes", image_url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80", rating: 4.6 },
    { id: 3, name: "Velvet Slippers", description: "Pure comfort for your feet.", price: 1800, offer_price: 1500, category: "slippers", image_url: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80", rating: 4.7 },
    { id: 4, name: "Classic Accessories", description: "Complete your look.", price: 999, offer_price: 799, category: "accessories", image_url: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80", rating: 4.5 }
];

const PRODUCT_EXTRAS = {
    1: {
        long_description: "Premium Oud is crafted from aged agarwood resin, delivering a rich, smoky base with hints of amber and sandalwood. Long-lasting projection makes it perfect for evening wear and special occasions.",
        gallery: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
            "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800&q=80"
        ],
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-spraying-perfume-4029-large.mp4",
        review_count: 128,
        reviews: [
            { author: "Ananya R.", rating: 5, date: "2026-02-10", text: "Absolutely luxurious scent. Lasts all day and gets compliments everywhere.", photos: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=60"] },
            { author: "Rahul M.", rating: 5, date: "2026-01-28", text: "Worth every rupee. The oud note is authentic and not overpowering.", photos: [] },
            { author: "Sneha K.", rating: 4, date: "2026-01-15", text: "Beautiful packaging and fast delivery. Slightly strong for daytime.", photos: [] }
        ]
    },
    2: {
        long_description: "Royal Saffron blends golden saffron threads with rose petals and white musk. A warm, opulent fragrance that feels regal without being heavy.",
        gallery: [
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&q=80",
            "https://images.unsplash.com/photo-1595425970375-c89af49b5a70?w=800&q=80",
            "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&q=80"
        ],
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-perfume-4027-large.mp4",
        review_count: 94,
        reviews: [
            { author: "Divya P.", rating: 5, date: "2026-02-05", text: "My signature scent now. The saffron note is so unique!", photos: ["https://images.unsplash.com/photo-1595425970375-c89af49b5a70?w=300&q=60"] },
            { author: "Arjun V.", rating: 4, date: "2026-01-20", text: "Great gift for my wife. She loves the floral warmth.", photos: [] }
        ]
    },
    3: {
        long_description: "Velvet Slippers feature memory-foam cushioning with a soft suede upper. Designed for all-day comfort at home without compromising on style.",
        gallery: [
            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80",
            "https://images.unsplash.com/photo-1603487742131-4163ec6cde8b?w=800&q=80",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80"
        ],
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-feet-in-comfortable-slippers-4030-large.mp4",
        review_count: 76,
        reviews: [
            { author: "Meera S.", rating: 5, date: "2026-02-08", text: "Like walking on clouds. The velvet finish feels premium.", photos: ["https://images.unsplash.com/photo-1603487742131-4163ec6cde8b?w=300&q=60"] },
            { author: "Karan D.", rating: 5, date: "2026-01-30", text: "Best slippers I've owned. True to size and very durable.", photos: [] }
        ]
    },
    4: {
        long_description: "Classic Accessories set includes curated pieces to elevate any outfit — from minimalist chains to statement rings, finished in hypoallergenic plating.",
        gallery: [
            "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80",
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"
        ],
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-golden-necklace-4026-large.mp4",
        review_count: 52,
        reviews: [
            { author: "Isha T.", rating: 5, date: "2026-02-01", text: "Stunning quality for the price. Photos don't do justice!", photos: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=60"] },
            { author: "Nikhil B.", rating: 4, date: "2026-01-18", text: "Bought for my sister. She loved the packaging and finish.", photos: [] }
        ]
    }
};

window.getPageCategory = function() {
    if (window.category) return window.category;
    const path = window.location.pathname;
    if (path.includes('perfumes')) return 'perfumes';
    if (path.includes('slippers')) return 'slippers';
    if (path.includes('accessories')) return 'accessories';
    return null;
};

window.applyPageFilterContext = function() {
    const pageCategory = window.getPageCategory();
    if (!pageCategory) return;

    document.querySelectorAll('.filter-tag[data-filter]').forEach(tag => tag.remove());
    document.querySelectorAll('.filter-drawer .filter-group').forEach(group => {
        if (group.querySelector('[data-filter]')) group.remove();
    });

    window.currentFilters.category = pageCategory;
};

window.mergeProductDetails = function(product) {
    const extras = PRODUCT_EXTRAS[product.id] || {};
    return {
        ...product,
        ...extras,
        gallery: extras.gallery || [product.image_url],
        reviews: extras.reviews || [],
        review_count: extras.review_count || 0,
        long_description: extras.long_description || product.description,
        rating: product.rating || 4.5
    };
};

window.getProductById = async function(id) {
    const mock = MOCK_PRODUCTS.find(p => String(p.id) === String(id));
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/products/${id}`, { timeout: 2000 });
        if (res.ok) {
            const product = await res.json();
            return window.mergeProductDetails(product);
        }
    } catch (e) { /* fallback to mock */ }
    if (mock) return window.mergeProductDetails(mock);
    return null;
};

window.renderStarRating = function(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= full) html += '<i class="fas fa-star"></i>';
        else if (i === full + 1 && half) html += '<i class="fas fa-star-half-alt"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    return html;
};

// Client-side cache for products
const productCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Fetch with timeout helper
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 1000 } = options; // Ultra-fast 1s timeout
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(id);
    }
}

let searchTimeout;

window.registerServiceWorker = function() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Error:', err));
    }
}

// --- Payment Status Check ---
window.checkPaymentStatus = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('payment');
    const txnid = urlParams.get('txnid');

    if (status === 'success') {
        // Find order ID from backend using txnid
        fetch(`${API_URL}/api/admin/orders`)
            .then(res => res.json())
            .then(orders => {
                const order = orders.find(o => o.txnid === txnid);
                if (order) {
                    window.showSuccessModal(order.id);
                    window.cart = [];
                    window.saveCart();
                    window.updateCartBadge();
                }
            });
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'failed') {
        alert('Payment was cancelled or failed.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// --- Search Implementation ---
window.setupSearch = function() {
    const desktopSearch = document.getElementById('desktop-search-input');
    const mobileSearch = document.getElementById('mobile-search-input');

    const handleSearch = (e) => {
        clearTimeout(searchTimeout);
        const term = e.target.value.trim();
        searchTimeout = setTimeout(() => {
            window.renderProducts(window.category || '', term);
        }, 500);
    };

    if (desktopSearch) desktopSearch.addEventListener('input', handleSearch);
    if (mobileSearch) mobileSearch.addEventListener('input', handleSearch);
}

// --- Theme Management ---
window.initTheme = function() {
    const savedTheme = localStorage.getItem('lifestyle_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('lifestyle_theme', newTheme);
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// --- Authentication ---
window.initAuth = function() {
    if (window.user) {
        const authBtn = document.getElementById('open-auth-btn');
        if (authBtn) {
            authBtn.innerHTML = `<i class="fas fa-user"></i>`;
        }
    }

    // Google Sign-In Initialization
    if (window.google) {
        google.accounts.id.initialize({
            client_id: "572682440348-vfaaljc997ee9q3175i3rj3155lvs13t.apps.googleusercontent.com",
            callback: window.handleGoogleResponse
        });
        
        // One Tap prompt
        google.accounts.id.prompt();

        // Handle Custom Google Button Click
        const customGoogleBtn = document.getElementById('google-auth-btn');
        if (customGoogleBtn) {
            customGoogleBtn.onclick = () => {
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        console.log('Google prompt not displayed.');
                    }
                });
            };
        }
    }
}

window.handleGoogleResponse = async function(response) {
    const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
    });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('lifestyle_token', data.token);
        localStorage.setItem('lifestyle_user', JSON.stringify(data.user));
        window.user = data.user;
        location.reload();
    }
}

// Logout logic
window.logoutUser = function() {
    localStorage.removeItem('lifestyle_user');
    window.user = null;
    location.reload();
}

// --- Filter State ---
window.currentFilters = {
    category: 'all',
    price: 'all',
    rating: 'all'
};

// --- Product Management ---
// Check if current device is mobile
window.isMobile = function() {
    return window.innerWidth <= 768;
}

window.toggleFilterDrawer = function() {
    const drawer = document.getElementById('filter-drawer');
    const overlay = document.getElementById('filter-overlay');
    if (drawer && overlay) {
        const isOpen = drawer.classList.toggle('active');
        overlay.classList.toggle('active', isOpen);
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
}

window.applyFilters = function() {
    window.toggleFilterDrawer();
    window.renderProducts();
}

window.clearFilters = function() {
    window.currentFilters = { category: 'all', price: 'all', rating: 'all' };
    
    // Reset UI
    document.querySelectorAll('.filter-option, .filter-tag').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.filter === 'all') el.classList.add('active');
    });
    
    window.renderProducts();
    const drawer = document.getElementById('filter-drawer');
    if (drawer && drawer.classList.contains('active')) {
        window.toggleFilterDrawer();
    }
}

window.setupFilters = function() {
    const filterBar = document.querySelector('.mobile-filter-section');
    if (!filterBar) return;

    const drawer = document.getElementById('filter-drawer');
    if (drawer) drawer.setAttribute('aria-hidden', 'true');

    window.applyPageFilterContext();

    // Horizontal Tag Clicks
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const filter = tag.dataset.filter;
            const price = tag.dataset.price;
            
            if (filter) {
                window.currentFilters.category = filter;
                document.querySelectorAll('.filter-tag[data-filter]').forEach(t => t.classList.remove('active'));
            }
            if (price) {
                window.currentFilters.price = price;
                document.querySelectorAll('.filter-tag[data-price]').forEach(t => t.classList.remove('active'));
            }
            
            tag.classList.add('active');
            window.renderProducts();
        });
    });

    // Drawer Option Clicks
    document.querySelectorAll('.filter-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const filter = opt.dataset.filter;
            const price = opt.dataset.price;
            const rating = opt.dataset.rating;
            
            if (filter) {
                window.currentFilters.category = filter;
                opt.parentElement.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            }
            if (price) {
                window.currentFilters.price = price;
                opt.parentElement.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            }
            if (rating) {
                window.currentFilters.rating = rating;
                opt.parentElement.querySelectorAll('.filter-option').forEach(o => o.classList.remove('active'));
            }
            
            opt.classList.add('active');
        });
    });

    // Open/Close Buttons
    const openBtn = document.getElementById('mobile-filter-open-btn');
    const closeBtn = document.getElementById('close-filter-btn');
    const overlay = document.getElementById('filter-overlay');
    
    if (openBtn) openBtn.onclick = window.toggleFilterDrawer;
    if (closeBtn) closeBtn.onclick = window.toggleFilterDrawer;
    if (overlay) overlay.onclick = window.toggleFilterDrawer;
}

window.renderProducts = async function(searchTerm = '') {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    // Determine category from URL or state
    let category = window.currentFilters.category === 'all' ? '' : window.currentFilters.category;
    if (!category) {
        const path = window.location.pathname;
        if (path.includes('perfumes')) category = 'perfumes';
        else if (path.includes('slippers')) category = 'slippers';
        else if (path.includes('accessories')) category = 'accessories';
    }

    // Step 1: Render Mock Data IMMEDIATELY
    let filteredMock = MOCK_PRODUCTS.filter(p => !category || p.category === category);
    filteredMock = window.applyClientFilters(filteredMock);
    window.renderToDOM(filteredMock, productList, category);

    // Step 2: Background Fetch
    try {
        let cacheKey = `${category}-${searchTerm}-${JSON.stringify(window.currentFilters)}`;
        let products;

        if (productCache.has(cacheKey) && (Date.now() - productCache.get(cacheKey).timestamp < CACHE_EXPIRY)) {
            products = productCache.get(cacheKey).data;
        } else {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (searchTerm) params.append('search', searchTerm);
            
            const url = `${API_URL}/api/products${params.toString() ? '?' + params.toString() : ''}`;

            const res = await fetchWithTimeout(url, { timeout: 3000 });
            if (!res.ok) throw new Error('Failed to fetch');
            
            products = await res.json();
            
            // Apply client-side filters (Price & Rating)
            products = window.applyClientFilters(products);
            
            productCache.set(cacheKey, { data: products, timestamp: Date.now() });
        }

        if (products) {
            if (productList.closest('#trending')) {
                products = products.slice(0, 4);
            }
            window.renderToDOM(products, productList, category);
        }
    } catch (error) {
        console.warn('Background fetch failed:', error);
    }
}

window.applyClientFilters = function(products) {
    let result = [...products];
    
    // Price Filter
    if (window.currentFilters.price !== 'all') {
        const [min, max] = window.currentFilters.price.split('-').map(v => v === 'plus' ? Infinity : Number(v));
        result = result.filter(p => {
            const price = p.offer_price || p.price;
            return price >= min && price <= max;
        });
    }
    
    // Rating Filter
    if (window.currentFilters.rating !== 'all') {
        const minRating = Number(window.currentFilters.rating);
        result = result.filter(p => (p.rating || 4.5) >= minRating);
    }
    
    return result;
}

window.renderToDOM = function(products, container, category) {
    if (!products || products.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px; font-size: 1.5rem; font-weight: 800;">NO PRODUCTS FOUND.</div>`;
        return;
    }

    container.innerHTML = products.map(p => {
        const optimizedImg = p.image_url.includes('unsplash.com') 
            ? p.image_url.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=60')
            : p.image_url;
        
        const escapedName = p.name.replace(/'/g, "\\'");

        return `
        <a href="product.html?id=${p.id}" class="product-card-link">
            <div class="product-card">
                <div class="product-img">
                    <img src="${optimizedImg}" alt="${p.name}" loading="lazy" width="400" height="400">
                    <button class="add-to-cart-overlay" onclick="event.preventDefault(); event.stopPropagation(); window.addToCart('${p.id}', '${escapedName}', ${p.offer_price || p.price}, '${optimizedImg}')">
                        <i class="fas fa-plus"></i> ADD TO BAG
                    </button>
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.description}</p>
                    <div class="product-price">
                        <span class="current-price">₹${p.offer_price || p.price}</span>
                        ${p.offer_price && p.offer_price < p.price ? `<span class="original-price" style="text-decoration: line-through; color: #666; font-size: 0.9rem; margin-left: 10px;">₹${p.price}</span>` : ''}
                    </div>
                </div>
            </div>
        </a>
    `}).join('');
}

window.initProductPage = async function() {
    const container = document.getElementById('product-detail-content');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) {
        container.innerHTML = '<p class="pdp-error">Product not found.</p>';
        return;
    }

    const product = await window.getProductById(productId);
    if (!product) {
        container.innerHTML = '<p class="pdp-error">Product not found.</p>';
        return;
    }

    document.title = `Life Style | ${product.name}`;
    const categoryPage = { perfumes: 'perfumes.html', slippers: 'slippers.html', accessories: 'accessories.html' };
    const breadcrumbCat = product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Shop';
    const breadcrumbLink = categoryPage[product.category] || 'collections.html';
    const price = product.offer_price || product.price;
    const savedReviews = JSON.parse(localStorage.getItem(`lifestyle_reviews_${productId}`) || '[]');
    const allReviews = [...(product.reviews || []), ...savedReviews];
    const avgRating = allReviews.length
        ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
        : product.rating;

    const galleryHtml = product.gallery.map((img, i) =>
        `<button type="button" class="pdp-thumb${i === 0 ? ' active' : ''}" data-img="${img}" aria-label="View image ${i + 1}">
            <img src="${img.replace(/w=\d+/, 'w=150').replace(/q=\d+/, 'q=60')}" alt="">
        </button>`
    ).join('');

    const reviewsHtml = allReviews.length ? allReviews.map(r => `
        <div class="pdp-review-card">
            <div class="pdp-review-header">
                <strong>${r.author}</strong>
                <span class="pdp-review-stars">${window.renderStarRating(r.rating)}</span>
                <span class="pdp-review-date">${r.date}</span>
            </div>
            <p>${r.text}</p>
            ${r.photos && r.photos.length ? `<div class="pdp-review-photos">${r.photos.map(ph => `<img src="${ph}" alt="Customer photo">`).join('')}</div>` : ''}
        </div>
    `).join('') : '<p class="pdp-no-reviews">No reviews yet. Be the first!</p>';

    container.innerHTML = `
        <nav class="pdp-breadcrumb">
            <a href="index.html">Home</a> <span>/</span>
            <a href="${breadcrumbLink}">${breadcrumbCat}</a> <span>/</span>
            <span>${product.name}</span>
        </nav>

        <div class="pdp-layout">
            <div class="pdp-media">
                <div class="pdp-main-image">
                    <img id="pdp-main-img" src="${product.gallery[0]}" alt="${product.name}">
                </div>
                <div class="pdp-thumbs">${galleryHtml}</div>
                ${product.video_url ? `
                <div class="pdp-video-section">
                    <h3>PRODUCT VIDEO</h3>
                    <video class="pdp-video" controls playsinline poster="${product.gallery[0]}">
                        <source src="${product.video_url}" type="video/mp4">
                    </video>
                </div>` : ''}
            </div>

            <div class="pdp-info">
                <span class="pdp-category-tag">${breadcrumbCat}</span>
                <h1>${product.name}</h1>
                <div class="pdp-rating-row">
                    <span class="pdp-stars">${window.renderStarRating(Number(avgRating))}</span>
                    <span class="pdp-rating-text">${avgRating} / 5 (${allReviews.length} reviews)</span>
                </div>
                <div class="pdp-price-row">
                    <span class="pdp-price">₹${price}</span>
                    ${product.offer_price && product.offer_price < product.price ? `<span class="pdp-original-price">₹${product.price}</span>` : ''}
                </div>
                <p class="pdp-description">${product.long_description}</p>
                <button class="btn btn-primary pdp-add-btn" onclick="window.addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${price}, '${product.image_url}')">
                    <i class="fas fa-shopping-bag"></i> ADD TO BAG
                </button>
            </div>
        </div>

        <section class="pdp-reviews-section">
            <h2>CUSTOMER REVIEWS & FEEDBACK</h2>
            <div class="pdp-reviews-grid">
                <div class="pdp-reviews-list">${reviewsHtml}</div>
                <div class="pdp-review-form-card">
                    <h3>WRITE A REVIEW</h3>
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" class="brutal-input" id="review-author" placeholder="Your name">
                    </div>
                    <div class="form-group">
                        <label>Rating</label>
                        <select class="brutal-select" id="review-rating">
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Your Feedback</label>
                        <textarea class="brutal-input" id="review-text" rows="4" placeholder="Share your experience..."></textarea>
                    </div>
                    <button class="btn btn-primary" id="submit-review-btn" style="width:100%;">SUBMIT REVIEW</button>
                </div>
            </div>
        </section>
    `;

    container.querySelectorAll('.pdp-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            document.getElementById('pdp-main-img').src = thumb.dataset.img;
            container.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    document.getElementById('submit-review-btn').addEventListener('click', () => {
        const author = document.getElementById('review-author').value.trim();
        const rating = Number(document.getElementById('review-rating').value);
        const text = document.getElementById('review-text').value.trim();
        if (!author || !text) return alert('Please enter your name and feedback.');
        const review = { author, rating, text, date: new Date().toISOString().slice(0, 10), photos: [] };
        const key = `lifestyle_reviews_${productId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(review);
        localStorage.setItem(key, JSON.stringify(existing));
        window.initProductPage();
    });
};

// --- Cart Algorithm (REBUILT FOR RELIABILITY) ---
window.addToCart = function(id, name, price, image) {
    console.log('Adding to cart:', {id, name, price});
    
    // Ensure ID is treated as a string for consistent matching
    const productId = String(id);
    
    const existingIndex = window.cart.findIndex(item => String(item.id) === productId);
    
    if (existingIndex > -1) {
        window.cart[existingIndex].quantity += 1;
    } else {
        window.cart.push({ 
            id: productId, 
            name: name, 
            price: Number(price), 
            image: image, 
            quantity: 1 
        });
    }
    
    window.saveCart();
    window.updateCartBadge();
    window.openCart();
    window.renderCartItems();
}

window.changeQty = function(index, delta) {
    if (window.cart[index]) {
        window.cart[index].quantity += delta;
        if (window.cart[index].quantity < 1) {
            window.cart.splice(index, 1);
        }
        window.saveCart();
        window.updateCartBadge();
        window.renderCartItems();
    }
}

window.removeItem = function(index) {
    if (window.cart[index]) {
        window.cart.splice(index, 1);
        window.saveCart();
        window.updateCartBadge();
        window.renderCartItems();
    }
}

window.updateCartBadge = function() {
    const totalItems = window.cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count, #cart-badge, #mobile-cart-badge');
    badges.forEach(badge => {
        if (badge) {
            badge.innerText = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
}

window.renderCartItems = function() {
    const container = document.getElementById('cart-items-container');
    const totalPrice = document.getElementById('cart-total-price');
    if (!container) return;

    if (window.cart.length === 0) {
        container.innerHTML = `<div class="empty-cart"><i class="fas fa-box-open"></i><p>Your bag is empty.</p></div>`;
        if (totalPrice) totalPrice.innerText = '₹0';
        return;
    }

    container.innerHTML = window.cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} x ${item.quantity}</p>
                <div class="cart-item-qty">
                    <button onclick="window.changeQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="window.changeQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-item" onclick="window.removeItem(${index})"><i class="fas fa-times"></i></button>
        </div>
    `).join('');

    const total = window.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    if (totalPrice) totalPrice.innerText = `₹${total}`;
}

// --- Checkout Logic ---
window.completeCheckout = async function() {
    if (!window.user) {
        document.getElementById('cart-drawer').classList.remove('active');
        document.getElementById('cart-overlay').classList.remove('active');
        document.getElementById('auth-modal').classList.add('active');
        document.getElementById('auth-overlay').classList.add('active');
        alert('Please login to complete your order.');
        return;
    }

    const name = window.user.email.split('@')[0];
    const email = window.user.email;
    const amount = window.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 100;
    const txnid = 'TXN' + Date.now();

    try {
        const orderRes = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: window.user.id,
                items: window.cart,
                total_amount: amount,
                shipping_address: { street: 'Default Street', city: 'Default City', state: 'Default State', pin: '000000' },
                txnid
            })
        });
        
        if (!orderRes.ok) throw new Error('Order creation failed');

        const orderData = await orderRes.json();
        window.location.href = `payment.html?txnid=${txnid}&amount=${amount}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&orderId=${orderData.orderId}`;

    } catch (error) {
        console.error('Checkout Error:', error);
        alert('Checkout failed.');
    }
}

window.showSuccessModal = function(orderId) {
    document.getElementById('success-modal').classList.add('active');
    document.getElementById('order-id').innerText = orderId;
}

window.handleSendOTP = function() {
    const email = document.getElementById('auth-email').value;
    if (!email) {
        alert('Please enter an email or phone number.');
        return;
    }
    alert(`OTP sent to ${email}`);
}

window.closeSuccessModal = function() {
    document.getElementById('success-modal').classList.remove('active');
    window.location.href = 'index.html';
}

// --- UI Helpers ---
window.openCart = function() {
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    window.renderCartItems();
}

window.closeCart = function() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
    document.body.style.overflow = '';
}

window.toggleCart = function() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer && drawer.classList.contains('active')) {
        window.closeCart();
    } else {
        window.openCart();
    }
}

window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
        // Prevent body scroll when menu is open
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

window.setupEventListeners = function() {
    // Helper to add click listener safely
    const addSafeClick = (id, fn) => {
        const el = document.getElementById(id);
        if (el) {
            el.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                fn(e);
            };
        }
    };

    // Mobile Menu
    addSafeClick('mobile-menu-btn', window.toggleMenu);
    addSafeClick('close-menu-btn', window.toggleMenu);
    addSafeClick('bottom-menu-trigger', window.toggleMenu);

    // Auth Modal/Drawer
    const openAuth = (e) => {
        const modal = document.getElementById('auth-modal');
        const overlay = document.getElementById('auth-overlay');
        const drawer = document.getElementById('auth-drawer');
        if (modal && overlay) {
            modal.classList.add('active');
            overlay.classList.add('active');
        } else if (drawer && overlay) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        }
    };
    
    const closeAuth = (e) => {
        const modal = document.getElementById('auth-modal');
        const overlay = document.getElementById('auth-overlay');
        const drawer = document.getElementById('auth-drawer');
        if (modal && overlay) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        } else if (drawer && overlay) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
    };

    addSafeClick('open-auth-btn', openAuth);
    addSafeClick('auth-btn', openAuth); // Support multiple IDs
    addSafeClick('close-auth-btn', closeAuth);
    addSafeClick('auth-overlay', closeAuth);

    // Settings Modal
    addSafeClick('close-settings-btn', window.closeSettings);
    addSafeClick('settings-overlay', window.closeSettings);

    // Theme Toggle
    addSafeClick('theme-toggle-btn', window.toggleTheme);
    addSafeClick('theme-toggle', window.toggleTheme); // Support multiple IDs

    // Cart Drawer
    addSafeClick('open-cart-btn', window.openCart);
    addSafeClick('cart-btn', window.openCart); // Support multiple IDs
    addSafeClick('close-cart-btn', window.closeCart);
    addSafeClick('cart-overlay', window.closeCart);
    addSafeClick('shop-now-btn', (e) => {
        window.closeCart();
        window.location.href = 'index.html#trending';
    });

    // Checkout
    const checkoutBtns = document.querySelectorAll('.checkout-btn');
    checkoutBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            window.completeCheckout();
        };
    });

    // PDP Close
    addSafeClick('close-pdp-btn', () => {
        document.getElementById('pdp-modal').classList.remove('active');
        document.getElementById('pdp-overlay').classList.remove('active');
    });
    addSafeClick('pdp-overlay', () => {
        document.getElementById('pdp-modal').classList.remove('active');
        document.getElementById('pdp-overlay').classList.remove('active');
    });

    // Success Modal Close
    addSafeClick('close-success-modal-btn', window.closeSuccessModal);

    // Filter/Sort Handlers
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.onchange = (e) => renderProducts(window.category, '', e.target.value);
    }
}

// --- Settings Implementation ---
window.openSettings = function(type) {
    const modal = document.getElementById('settings-modal');
    const overlay = document.getElementById('settings-overlay');
    const title = document.getElementById('settings-title');
    const content = document.getElementById('settings-content');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenu) mobileMenu.classList.remove('active');

    let html = '';
    let headerText = '';

    switch(type) {
        case 'plus':
            headerText = 'Life Style Plus';
            html = `<div style="text-align:center; padding: 20px;"><i class="fas fa-crown" style="font-size: 4rem; color: var(--accent-yellow); margin-bottom: 20px;"></i><h3>GOLD MEMBER</h3><p>Exclusive benefits active.</p></div>`;
            break;
        case 'devices':
            headerText = 'Manage Devices';
            html = `<div class="settings-row"><div><h4>This Device</h4><p>Active Now</p></div><span style="color: var(--accent-green);">ACTIVE</span></div>`;
            break;
        case 'profile':
            headerText = 'Edit Profile';
            html = `<div class="form-group"><label>Full Name</label><input type="text" class="brutal-input" value="${window.user ? window.user.email.split('@')[0].toUpperCase() : 'GUEST'}"></div><button class="btn btn-primary" style="width:100%" onclick="alert('Profile Updated!')">SAVE</button>`;
            break;
        case 'cards':
            headerText = 'Saved Cards';
            html = `<div class="settings-row" style="background:#000; color:#fff; padding:15px; border:3px solid #000;"><h4>VISA •••• 4242</h4></div>`;
            break;
        case 'addresses':
            headerText = 'Saved Addresses';
            html = `<div class="settings-row" style="border:3px solid #000; padding:15px;"><h4>Home</h4><p>123 Luxury Lane, Beverly Hills</p></div>`;
            break;
        case 'language':
            headerText = 'Language';
            html = `<div class="custom-radio"><input type="radio" checked> <label>English (UK)</label></div>`;
            break;
        case 'notifications':
            headerText = 'Notifications';
            html = `<div class="settings-row"><div><h4>Order Updates</h4></div><label class="toggle-switch"><input type="checkbox" checked><span class="slider"></span></label></div>`;
            break;
        case 'reviews':
            headerText = 'My Reviews';
            html = `<div style="text-align:center; padding:20px;"><p>No reviews yet.</p></div>`;
            break;
        case 'qa':
            headerText = 'Questions & Answers';
            html = `<div style="text-align:center; padding:20px;"><p>No questions yet.</p></div>`;
            break;
        case 'policies':
            headerText = 'Policies';
            html = `<div style="font-size:0.9rem;"><h4>Privacy Policy</h4><p>Your data is safe.</p></div>`;
            break;
        case 'faqs':
            headerText = 'FAQs';
            html = `<div style="font-size:0.9rem;"><h4>How to return?</h4><p>Contact support within 30 days.</p></div>`;
            break;
    }

    if (title) title.innerText = headerText.toUpperCase();
    if (content) content.innerHTML = html;
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

window.closeSettings = function() {
    const modal = document.getElementById('settings-modal');
    const overlay = document.getElementById('settings-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// --- INITIALIZATION (DO NOT MOVE - MUST BE AT BOTTOM) ---
window.initApp = function() {
    console.log('Life Style: Initializing functional engine...');
    window.initTheme();
    window.initAuth();
    window.updateCartBadge();
    window.renderCartItems();
    window.setupSearch();
    if (document.getElementById('product-detail-content')) {
        window.initProductPage();
    } else {
        window.renderProducts();
        window.setupFilters();
    }
    window.registerServiceWorker();
    window.setupEventListeners();
    window.checkPaymentStatus();
}

// Trigger initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initApp);
} else {
    window.initApp();
}
