// Admin State
let adminToken = localStorage.getItem('lifestyle_admin_token') || null;
// Determine API URL: Use port 3000 for localhost, otherwise current origin
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? `${window.location.protocol}//${window.location.hostname}:3000` 
    : window.location.origin;

// Cache for optimized loading
const cache = {
    stats: null,
    orders: null,
    products: null,
    lastFetch: {
        stats: 0,
        orders: 0,
        products: 0
    }
};
const CACHE_DURATION = 30000; // 30 seconds

// Fetch with timeout helper
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(id);
    }
}

// Preloader UI Helpers
function showPreloader() {
    const content = document.getElementById('admin-content');
    if (content) {
        content.style.opacity = '0.5';
    }
}

function hidePreloader() {
    const content = document.getElementById('admin-content');
    if (content) {
        content.style.opacity = '1';
    }
}

// Global initialization
function init() {
    if (!adminToken) {
        showLogin();
    } else {
        initAdminShell();
        showDashboard();
    }
}

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function initAdminShell() {
    const root = document.getElementById('admin-root') || document.body;
    root.innerHTML = `
        <header class="header admin-header" style="background: #fff; border-bottom: 4px solid #000; padding: 15px 20px; position: sticky; top: 0; z-index: 1000;">
            <div class="header-container" style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <button id="admin-menu-btn" onclick="toggleAdminMenu()" style="background: none; border: 3px solid #000; padding: 8px; cursor: pointer; display: none; align-items: center; justify-content: center; box-shadow: 3px 3px 0px #000;">
                        <i class="fas fa-bars" style="font-size: 1.2rem;"></i>
                    </button>
                    <div class="logo"><h1 style="font-weight: 900; background: #FFD100; padding: 5px 15px; border: 3px solid #000; box-shadow: 4px 4px 0px #000; font-size: 1.2rem; margin: 0;">Life Style Admin</h1></div>
                </div>
                <nav class="nav admin-desktop-nav">
                    <ul class="nav-links admin-nav-links" style="display: flex; gap: 15px; list-style: none; margin: 0; padding: 0;">
                        <li><a href="javascript:void(0)" onclick="showDashboard()" class="admin-nav-link" id="nav-dashboard">Dashboard</a></li>
                        <li><a href="javascript:void(0)" onclick="loadOrders()" class="admin-nav-link" id="nav-orders">Orders</a></li>
                        <li><a href="javascript:void(0)" onclick="loadProducts()" class="admin-nav-link" id="nav-products">Products</a></li>
                        <li><a href="index.html" class="admin-nav-link" style="color: #000;">Site</a></li>
                        <li><a href="javascript:void(0)" onclick="logout()" class="admin-nav-link" style="color: #FF007A;">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <!-- Mobile Menu Drawer -->
        <div id="admin-mobile-drawer" style="position: fixed; top: 0; left: -100%; width: 280px; height: 100vh; background: #fff; z-index: 5000; border-right: 5px solid #000; transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 30px; display: flex; flex-direction: column; gap: 20px; box-shadow: 10px 0 0 rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="font-weight: 900; font-size: 1.5rem; margin: 0;">MENU</h2>
                <button onclick="toggleAdminMenu()" style="background: none; border: 3px solid #000; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 3px 3px 0px #000;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                <li><a href="javascript:void(0)" onclick="showDashboard(); toggleAdminMenu();" class="mobile-nav-link" style="display: block; padding: 15px; border: 3px solid #000; font-weight: 800; text-decoration: none; color: #000; background: #fff; box-shadow: 4px 4px 0px #000;">DASHBOARD</a></li>
                <li><a href="javascript:void(0)" onclick="loadOrders(); toggleAdminMenu();" class="mobile-nav-link" style="display: block; padding: 15px; border: 3px solid #000; font-weight: 800; text-decoration: none; color: #000; background: #fff; box-shadow: 4px 4px 0px #000;">ORDERS</a></li>
                <li><a href="javascript:void(0)" onclick="loadProducts(); toggleAdminMenu();" class="mobile-nav-link" style="display: block; padding: 15px; border: 3px solid #000; font-weight: 800; text-decoration: none; color: #000; background: #fff; box-shadow: 4px 4px 0px #000;">PRODUCTS</a></li>
                <li><a href="index.html" style="display: block; padding: 15px; border: 3px solid #000; font-weight: 800; text-decoration: none; color: #000; background: #00E0FF; box-shadow: 4px 4px 0px #000;">VIEW WEBSITE</a></li>
                <li><a href="javascript:void(0)" onclick="logout()" style="display: block; padding: 15px; border: 3px solid #000; font-weight: 800; text-decoration: none; color: #fff; background: #FF007A; box-shadow: 4px 4px 0px #000; margin-top: 20px;">LOGOUT</a></li>
            </ul>
        </div>
        <div id="admin-menu-overlay" onclick="toggleAdminMenu()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 4999; display: none;"></div>

        <main class="admin-main" style="padding: 20px; max-width: 1400px; margin: 0 auto;">
            <div id="admin-content"></div>
        </main>
    `;
    
    // Add mobile-responsive styles
    const style = document.createElement('style');
    style.textContent = `
        .admin-nav-link { text-decoration: none; color: #000; font-weight: 800; text-transform: uppercase; padding: 8px 12px; transition: all 0.2s; font-size: 0.8rem; border: 2px solid transparent; }
        .admin-nav-link:hover { background: #00E0FF; border-color: #000; }
        .admin-nav-link.active { background: #FFD100; border: 2px solid #000; box-shadow: 2px 2px 0px #000; }
        
        .mobile-nav-link:hover { background: #FFD100 !important; transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #000 !important; }
        
        @media (max-width: 768px) {
            #admin-menu-btn { display: flex !important; }
            .admin-desktop-nav { display: none !important; }
            .admin-header { padding: 10px 15px !important; }
            .admin-header .header-container { justify-content: flex-start !important; }
            .stats-grid { grid-template-columns: 1fr !important; gap: 15px !important; }
            .section-header h2 { font-size: 1.8rem !important; }
            .admin-main { padding: 15px !important; }
            .table-container { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -15px; padding: 0 15px; }
            table { min-width: 600px; }
            .card { padding: 20px !important; }
            .product-card { margin-bottom: 20px; }
        }
    `;
    document.head.appendChild(style);
}

// Global toggle for admin menu
window.toggleAdminMenu = function() {
    const drawer = document.getElementById('admin-mobile-drawer');
    const overlay = document.getElementById('admin-menu-overlay');
    if (drawer.style.left === '0px') {
        drawer.style.left = '-100%';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    } else {
        drawer.style.left = '0px';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function updateActiveNav(id) {
    document.querySelectorAll('.admin-nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.getElementById(`nav-${id}`);
    if (activeLink) activeLink.classList.add('active');
}

function showLogin() {
    const root = document.getElementById('admin-root') || document.body;
    root.innerHTML = `
        <div class="admin-login-container" style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #f4f4f4;">
            <div class="card" style="width: 400px; max-width: 90%; padding: 40px; border: 5px solid #000; background: #fff; box-shadow: 10px 10px 0px #000;">
                <h2 style="margin-bottom: 20px; font-size: 2rem; font-weight: 900;">ADMIN LOGIN</h2>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 5px;">USERNAME</label>
                    <input type="text" id="admin-user" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 10px; font-weight: 700;">
                </div>
                <div class="form-group" style="margin-bottom: 30px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 5px;">PASSWORD</label>
                    <input type="password" id="admin-pass" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 10px; font-weight: 700;">
                </div>
                <button class="btn btn-primary" style="width: 100%; padding: 15px; background: #FFD100; border: 3px solid #000; font-weight: 900; cursor: pointer;" onclick="handleAdminLogin()">LOGIN</button>
            </div>
        </div>
    `;
}

function handleAdminLogin() {
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === 'admin' && pass === 'admin') {
        adminToken = 'admin-secret-token';
        localStorage.setItem('lifestyle_admin_token', adminToken);
        initAdminShell();
        showDashboard();
    } else {
        alert('Invalid credentials');
    }
}

async function showDashboard() {
    showPreloader();
    updateActiveNav('dashboard');
    const content = document.getElementById('admin-content');
    if (!content) return;
    
    content.innerHTML = `
        <div class="section-header" style="border-bottom: 4px solid #000; margin-bottom: 30px; padding-bottom: 10px;"><h2 style="font-size: 2.5rem; font-weight: 900;">DASHBOARD</h2></div>
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 40px;">
            <div class="card" style="padding: 30px; border: 4px solid #000; background: #00E0FF; box-shadow: 8px 8px 0px #000;">
                <h3 style="font-weight: 900; margin-bottom: 10px;">TOTAL SALES</h3>
                <p id="stat-sales" style="font-size: 3rem; font-weight: 900;">₹...</p>
            </div>
            <div class="card" style="padding: 30px; border: 4px solid #000; background: #FFD100; box-shadow: 8px 8px 0px #000;">
                <h3 style="font-weight: 900; margin-bottom: 10px;">TOTAL ORDERS</h3>
                <p id="stat-orders" style="font-size: 3rem; font-weight: 900;">...</p>
            </div>
            <div class="card" style="padding: 30px; border: 4px solid #000; background: #fff; box-shadow: 8px 8px 0px #000;">
                <h3 style="font-weight: 900; margin-bottom: 10px;">PENDING ORDERS</h3>
                <p id="stat-pending" style="font-size: 3rem; font-weight: 900;">...</p>
            </div>
        </div>
        <div id="recent-orders-container">
            <h3 style="font-weight: 900; margin-bottom: 20px; font-size: 1.8rem;">RECENT ORDERS</h3>
            <div id="dashboard-table">Loading...</div>
        </div>
    `;
    await loadStats();
    hidePreloader();
}

async function loadStats() {
    try {
        const now = Date.now();
        let stats, orders;

        // Parallel fetching for optimization
        const fetchPromises = [];
        
        if (!cache.stats || (now - cache.lastFetch.stats > CACHE_DURATION)) {
            fetchPromises.push(fetchWithTimeout(`${API_URL}/api/admin/stats`).then(res => res.json()).then(data => {
                cache.stats = data;
                cache.lastFetch.stats = now;
                return data;
            }));
        } else {
            stats = cache.stats;
        }

        if (!cache.orders || (now - cache.lastFetch.orders > CACHE_DURATION)) {
            fetchPromises.push(fetchWithTimeout(`${API_URL}/api/admin/orders`).then(res => res.json()).then(data => {
                cache.orders = data;
                cache.lastFetch.orders = now;
                return data;
            }));
        } else {
            orders = cache.orders;
        }

        if (fetchPromises.length > 0) {
            const results = await Promise.all(fetchPromises);
            // Assign results based on what was fetched
            let resultIdx = 0;
            if (!stats) stats = results[resultIdx++];
            if (!orders) orders = results[resultIdx++];
        }
        
        // Final fallback if fetch failed but didn't throw (rare)
        if (!stats) stats = cache.stats || { totalSales: 0, totalOrders: 0, pendingOrders: 0 };
        if (!orders) orders = cache.orders || [];

        document.getElementById('stat-sales').innerText = `₹${stats.totalSales || 0}`;
        document.getElementById('stat-orders').innerText = stats.totalOrders || 0;
        document.getElementById('stat-pending').innerText = stats.pendingOrders || 0;
        
        renderRecentOrders(orders);
    } catch (error) {
        console.error('Stats error:', error);
        // Fallback to cache or zeros so UI isn't empty
        const fallbackStats = cache.stats || { totalSales: 0, totalOrders: 0, pendingOrders: 0 };
        const fallbackOrders = cache.orders || [];
        
        const salesEl = document.getElementById('stat-sales');
        if (salesEl) {
            salesEl.innerText = `₹${fallbackStats.totalSales}`;
            document.getElementById('stat-orders').innerText = fallbackStats.totalOrders;
            document.getElementById('stat-pending').innerText = fallbackStats.pendingOrders;
            renderRecentOrders(fallbackOrders);
        }
    }
}

function renderRecentOrders(orders) {
    const container = document.getElementById('dashboard-table');
    if (!container) return;

    const recentOrders = (orders || []).slice(0, 5);
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<p style="font-weight: 800; padding: 20px; text-align: center;">No orders found.</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="table-container">
            <table style="width: 100%; border-collapse: collapse; border: 4px solid #000;">
                <thead style="background: #000; color: #fff;">
                <tr>
                    <th style="padding: 15px; text-align: left;">ORDER ID</th>
                    <th style="padding: 15px; text-align: left;">CUSTOMER</th>
                    <th style="padding: 15px; text-align: left;">AMOUNT</th>
                    <th style="padding: 15px; text-align: left;">STATUS</th>
                    <th style="padding: 15px; text-align: left;">DATE</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders.map(order => `
                    <tr style="border-bottom: 3px solid #000; background: #fff;">
                        <td style="padding: 15px; font-weight: 900;">${order.id}</td>
                        <td style="padding: 15px; font-weight: 700;">${order.shipping_address ? order.shipping_address.street : 'N/A'}</td>
                        <td style="padding: 15px; font-weight: 900;">₹${order.total_amount}</td>
                        <td style="padding: 15px;">
                            <span style="padding: 5px 10px; border: 2px solid #000; font-weight: 800; background: ${getStatusColor(order.status)}">${order.status}</span>
                        </td>
                        <td style="padding: 15px; font-weight: 700;">${new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        </div>
    `;
}

async function loadRecentOrders() {
    // This function is now replaced by renderRecentOrders which is called from loadStats
    // but we keep the signature for compatibility if called elsewhere
    if (cache.orders) {
        renderRecentOrders(cache.orders);
    } else {
        const res = await fetchWithTimeout(`${API_URL}/api/admin/orders`);
        const orders = await res.json();
        cache.orders = orders;
        cache.lastFetch.orders = Date.now();
        renderRecentOrders(orders);
    }
}

function getStatusColor(status) {
    switch(status) {
        case 'Confirmed': return '#00FF94';
        case 'Pending': return '#FFD100';
        case 'Shipped': return '#00E0FF';
        case 'Delivered': return '#00FF94';
        case 'Cancelled': return '#FF007A';
        default: return '#eee';
    }
}

async function loadOrders() {
    showPreloader();
    updateActiveNav('orders');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div class="section-header" style="border-bottom: 4px solid #000; margin-bottom: 30px; padding-bottom: 10px;">
            <h2 style="font-size: 2.5rem; font-weight: 900;">ALL ORDERS</h2>
        </div>
        <div id="orders-list">Loading...</div>
    `;
    
    try {
        const now = Date.now();
        let orders;

        if (!cache.orders || (now - cache.lastFetch.orders > CACHE_DURATION)) {
            const res = await fetchWithTimeout(`${API_URL}/api/admin/orders`);
            if (!res.ok) throw new Error('Failed to fetch orders');
            orders = await res.json();
            cache.orders = orders;
            cache.lastFetch.orders = now;
        } else {
            orders = cache.orders;
        }
        
        const container = document.getElementById('orders-list');
        if (orders.length === 0) {
            container.innerHTML = '<p style="font-weight: 800; padding: 40px; text-align: center;">No orders found.</p>';
            hidePreloader();
            return;
        }
        
        container.innerHTML = orders.map(order => `
            <div class="card" style="border: 4px solid #000; background: #fff; padding: 25px; margin-bottom: 25px; box-shadow: 8px 8px 0px #000;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <h4 style="font-size: 1.5rem; font-weight: 900;">ORDER ${order.id}</h4>
                        <p style="font-weight: 700; color: #666;">Placed on ${new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.8rem; font-weight: 900; color: #FF007A;">₹${order.total_amount}</div>
                        <div style="font-weight: 800; margin-top: 5px;">
                            Status: <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 5px 10px; border: 3px solid #000; font-weight: 800; background: ${getStatusColor(order.status)}">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                                <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 20px; border-top: 3px solid #000; padding-top: 20px;">
                    <div>
                        <h5 style="font-weight: 900; margin-bottom: 10px; text-transform: uppercase;">Items</h5>
                        ${(order.items || []).map(item => `
                            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                                <img src="${item.image}" style="width: 50px; height: 50px; border: 2px solid #000; object-fit: cover;" onerror="this.src='https://via.placeholder.com/50'">
                                <div>
                                    <div style="font-weight: 800;">${item.name}</div>
                                    <div style="font-weight: 700; color: #666;">₹${item.price} x ${item.quantity}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h5 style="font-weight: 900; margin-bottom: 10px; text-transform: uppercase;">Shipping Address</h5>
                        <p style="font-weight: 700;">${order.shipping_address ? order.shipping_address.street : 'N/A'}</p>
                        <p style="font-weight: 700;">${order.shipping_address ? `${order.shipping_address.city}, ${order.shipping_address.pin}` : ''}</p>
                        <p style="font-weight: 900; margin-top: 10px;">Payment: <span style="color: ${order.payment_status === 'Paid' ? '#00FF94' : '#FF007A'}">${order.payment_status}</span></p>
                        <p style="font-weight: 700; font-size: 0.8rem; color: #666;">TXN ID: ${order.txnid}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load orders error:', error);
        document.getElementById('orders-list').innerHTML = `<p style="color: #FF007A; font-weight: 800; padding: 40px; text-align: center;">Error loading orders. Is the server running?</p>`;
    } finally {
        hidePreloader();
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/admin/update-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status })
        });
        if (res.ok) {
            // Invalidate orders cache
            cache.lastFetch.orders = 0;
            cache.lastFetch.stats = 0;
            alert(`Order ${orderId} status updated to ${status}`);
            loadOrders();
        }
    } catch (error) {
        alert('Failed to update status');
    }
}

async function loadProducts() {
    showPreloader();
    updateActiveNav('products');
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid #000; margin-bottom: 30px; padding-bottom: 10px; flex-wrap: wrap; gap: 10px;">
            <h2 style="font-size: 2.5rem; font-weight: 900;">PRODUCTS</h2>
            <button class="btn btn-primary" onclick="showAddProduct()" style="background: #FFD100; border: 3px solid #000; padding: 10px 20px; font-weight: 900; cursor: pointer;">ADD PRODUCT</button>
        </div>
        <div id="products-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">Loading...</div>
    `;
    
    try {
        const now = Date.now();
        let products;

        if (!cache.products || (now - cache.lastFetch.products > CACHE_DURATION)) {
            const res = await fetchWithTimeout(`${API_URL}/api/products`);
            if (!res.ok) throw new Error('Failed to fetch products');
            products = await res.json();
            cache.products = products;
            cache.lastFetch.products = now;
        } else {
            products = cache.products;
        }
        
        const container = document.getElementById('products-list');
        if (products.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; font-weight: 800; padding: 40px; text-align: center;">No products found.</p>';
            hidePreloader();
            return;
        }

        container.innerHTML = products.map(p => {
            const optimizedImg = p.image_url.includes('unsplash.com') 
                ? p.image_url.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=60')
                : p.image_url;

            return `
            <div class="product-card" style="border: 4px solid #000; background: #fff; box-shadow: 8px 8px 0px #000; overflow: hidden; display: flex; flex-direction: column;">
                <img src="${optimizedImg}" style="width: 100%; height: 200px; object-fit: cover; border-bottom: 3px solid #000;" onerror="this.src='https://via.placeholder.com/200'" loading="lazy">
                <div style="padding: 20px; flex: 1;">
                    <h4 style="font-weight: 900; font-size: 1.2rem; margin-bottom: 5px;">${p.name}</h4>
                    <div style="display: flex; gap: 10px; align-items: baseline; margin-bottom: 5px;">
                        <span style="font-weight: 800; color: #FF007A; font-size: 1.1rem;">₹${p.offer_price || p.price}</span>
                        ${p.offer_price && p.offer_price < p.price ? `<span style="text-decoration: line-through; color: #666; font-size: 0.9rem;">₹${p.price}</span>` : ''}
                    </div>
                    <p style="font-weight: 700; color: #666; font-size: 0.9rem; text-transform: uppercase;">${p.category}</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn" style="flex: 1; background: #00E0FF; border: 3px solid #000; padding: 10px; font-weight: 900; cursor: pointer;" onclick="showEditProduct(${p.id})">EDIT</button>
                        <button class="btn" style="flex: 1; background: #FF007A; color: #fff; border: 3px solid #000; padding: 10px; font-weight: 900; cursor: pointer;" onclick="deleteProduct(${p.id})">DELETE</button>
                    </div>
                </div>
            </div>
        `}).join('');
    } catch (error) {
        console.error('Load products error:', error);
        document.getElementById('products-list').innerHTML = `<p style="grid-column: 1/-1; color: #FF007A; font-weight: 800; padding: 40px; text-align: center;">Error loading products. Is the server running?</p>`;
    } finally {
        hidePreloader();
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/admin/products/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            loadProducts();
        }
    } catch (error) {
        alert('Failed to delete product');
    }
}

async function showEditProduct(id) {
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/products`);
        const products = await res.json();
        const product = products.find(p => p.id === id);
        
        if (!product) return alert('Product not found');

        const content = document.getElementById('admin-content');
        content.innerHTML = `
            <div class="section-header" style="border-bottom: 4px solid #000; margin-bottom: 30px; padding-bottom: 10px;">
                <h2 style="font-size: 2.5rem; font-weight: 900;">EDIT PRODUCT</h2>
            </div>
            <div class="card" style="max-width: 600px; border: 4px solid #000; background: #fff; padding: 40px; box-shadow: 8px 8px 0px #000;">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">PRODUCT NAME</label>
                    <input type="text" id="p-name" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;" value="${product.name}">
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">DESCRIPTION</label>
                    <textarea id="p-desc" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700; height: 100px;">${product.description}</textarea>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="display: block; font-weight: 800; margin-bottom: 8px;">EXACT PRICE (₹)</label>
                        <input type="number" id="p-price" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;" value="${product.price}">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-weight: 800; margin-bottom: 8px;">OFFER PRICE (₹)</label>
                        <input type="number" id="p-offer-price" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;" value="${product.offer_price || product.price}">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">CATEGORY</label>
                    <select id="p-cat" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;">
                        <option value="perfumes" ${product.category === 'perfumes' ? 'selected' : ''}>Perfumes</option>
                        <option value="slippers" ${product.category === 'slippers' ? 'selected' : ''}>Slippers</option>
                        <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
                    </select>
                </div>
                <div class="form-group" style="margin-bottom: 30px;">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">IMAGE URL</label>
                    <input type="text" id="p-img" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;" value="${product.image_url}">
                </div>
                <div style="display: flex; gap: 15px;">
                    <button class="btn btn-primary" style="flex: 1; background: #00E0FF; border: 3px solid #000; padding: 15px; font-weight: 900; cursor: pointer;" onclick="handleEditProduct(${product.id})">UPDATE PRODUCT</button>
                    <button class="btn" style="flex: 1; background: #eee; border: 3px solid #000; padding: 15px; font-weight: 900; cursor: pointer;" onclick="loadProducts()">CANCEL</button>
                </div>
            </div>
        `;
    } catch (error) {
        alert('Failed to load product details');
    }
}

async function handleEditProduct(id) {
    const name = document.getElementById('p-name').value;
    const description = document.getElementById('p-desc').value;
    const price = document.getElementById('p-price').value;
    const offer_price = document.getElementById('p-offer-price').value || price;
    const category = document.getElementById('p-cat').value;
    const image_url = document.getElementById('p-img').value;
    
    if (!name || !price || !image_url) return alert('Please fill required fields');
    
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price, offer_price, category, image_url })
        });
        if (res.ok) {
            alert('Product updated successfully');
            loadProducts();
        }
    } catch (error) {
        alert('Failed to update product');
    }
}

function showAddProduct() {
    const content = document.getElementById('admin-content');
    content.innerHTML = `
        <div class="section-header" style="border-bottom: 4px solid #000; margin-bottom: 30px; padding-bottom: 10px;">
            <h2 style="font-size: 2.5rem; font-weight: 900;">ADD NEW PRODUCT</h2>
        </div>
        <div class="card" style="max-width: 600px; border: 4px solid #000; background: #fff; padding: 40px; box-shadow: 8px 8px 0px #000;">
            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 800; margin-bottom: 8px;">PRODUCT NAME</label>
                <input type="text" id="p-name" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;">
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 800; margin-bottom: 8px;">DESCRIPTION</label>
                <textarea id="p-desc" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700; height: 100px;"></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div class="form-group">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">EXACT PRICE (₹)</label>
                    <input type="number" id="p-price" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;">
                </div>
                <div class="form-group">
                    <label style="display: block; font-weight: 800; margin-bottom: 8px;">OFFER PRICE (₹)</label>
                    <input type="number" id="p-offer-price" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;">
                </div>
            </div>
            <div class="form-group" style="margin-bottom: 20px;">
                <label style="display: block; font-weight: 800; margin-bottom: 8px;">CATEGORY</label>
                <select id="p-cat" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;">
                    <option value="perfumes">Perfumes</option>
                    <option value="slippers">Slippers</option>
                    <option value="accessories">Accessories</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 30px;">
                <label style="display: block; font-weight: 800; margin-bottom: 8px;">IMAGE URL</label>
                <input type="text" id="p-img" class="brutal-input" style="width: 100%; border: 3px solid #000; padding: 12px; font-weight: 700;" placeholder="https://unsplash.com/...">
            </div>
            <div style="display: flex; gap: 15px;">
                <button class="btn btn-primary" style="flex: 1; background: #FFD100; border: 3px solid #000; padding: 15px; font-weight: 900; cursor: pointer;" onclick="handleAddProduct()">ADD PRODUCT</button>
                <button class="btn" style="flex: 1; background: #eee; border: 3px solid #000; padding: 15px; font-weight: 900; cursor: pointer;" onclick="loadProducts()">CANCEL</button>
            </div>
        </div>
    `;
}

async function handleAddProduct() {
    const name = document.getElementById('p-name').value;
    const description = document.getElementById('p-desc').value;
    const price = document.getElementById('p-price').value;
    const offer_price = document.getElementById('p-offer-price').value || price;
    const category = document.getElementById('p-cat').value;
    const image_url = document.getElementById('p-img').value;
    
    if (!name || !price || !image_url) return alert('Please fill required fields');
    
    try {
        const res = await fetchWithTimeout(`${API_URL}/api/admin/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price, offer_price, category, image_url })
        });
        if (res.ok) {
            alert('Product added successfully');
            loadProducts();
        }
    } catch (error) {
        alert('Failed to add product');
    }
}

function logout() {
    localStorage.removeItem('lifestyle_admin_token');
    location.reload();
}

