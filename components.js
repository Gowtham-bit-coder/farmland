// UI Components and Page Renderers

// Show Toast Notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Update Cart Badge
function updateCartBadge() {
  const cartCount = document.getElementById('cartCount');
  const cart = CartService.getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  if (totalItems > 0) {
    cartCount.style.display = 'block';
  } else {
    cartCount.style.display = 'none';
  }
}

// Render Cart Drawer
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cart = CartService.getCart();
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛒</div><p>Your cart is empty</p></div>';
    cartTotal.textContent = '₹0';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        <div class="cart-item-controls">
          <button onclick="updateCartItem('${item.type}', ${item.itemId}, ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateCartItem('${item.type}', ${item.itemId}, ${item.quantity + 1})">+</button>
          <button onclick="removeCartItem('${item.type}', ${item.itemId})" style="margin-left: auto; color: var(--color-error);">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
  
  cartTotal.textContent = `₹${CartService.getTotal().toLocaleString()}`;
  updateCartBadge();
}

// Homepage
function renderHomepage() {
  return `
    <div class="hero">
      <div class="hero-bg">
        <div class="floating-shape" style="width: 100px; height: 100px; top: 10%; left: 10%; animation-delay: 0s;"></div>
        <div class="floating-shape" style="width: 150px; height: 150px; top: 60%; left: 70%; animation-delay: 2s;"></div>
        <div class="floating-shape" style="width: 80px; height: 80px; top: 30%; left: 80%; animation-delay: 4s;"></div>
      </div>
      <div class="hero-content">
        <h1>🌾 Welcome to FarmerCommerce</h1>
        <p>Connecting farmers directly with consumers. Fresh produce, fair prices, sustainable farming.</p>
        <div class="hero-buttons">
          <button class="btn btn--primary" onclick="navigate('products')">Browse Products</button>
          <button class="btn btn--primary" onclick="navigate('tools')">Browse Tools</button>
          <button class="btn btn--primary" onclick="navigate('login')">Get Started</button>
        </div>
      </div>
    </div>
  `;
}

// Login Page
function renderLogin() {
  return `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="logo-icon" style="font-size: 48px;">🌾</div>
          <h1>Login</h1>
          <p>Welcome back to FarmerCommerce</p>
        </div>
        <form id="loginForm" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" name="password" required>
          </div>
          <button type="submit" class="btn btn--primary btn--full-width">Login</button>
        </form>
        <div class="form-link">
          Don't have an account? <a href="#" onclick="navigate('register')">Register</a>
        </div>
        <div style="margin-top: 24px; padding: 16px; background: var(--color-bg-1); border-radius: 8px; font-size: 12px;">
          <strong>Demo Accounts:</strong><br>
          Admin: admin@farmercommerce.com / admin123<br>
          Farmer: farmer@farmercommerce.com / farmer123<br>
          Consumer: consumer@farmercommerce.com / consumer123
        </div>
      </div>
    </div>
  `;
}

// Register Page
function renderRegister() {
  return `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <div class="logo-icon" style="font-size: 48px;">🌾</div>
          <h1>Register</h1>
          <p>Join FarmerCommerce today</p>
        </div>
        <form id="registerForm" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" name="name" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" name="email" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" class="form-control" name="phone" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" name="password" required minlength="6">
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <select class="form-control" name="role" required>
              <option value="CONSUMER">Consumer</option>
              <option value="FARMER">Farmer</option>
            </select>
          </div>
          <button type="submit" class="btn btn--primary btn--full-width">Register</button>
        </form>
        <div class="form-link">
          Already have an account? <a href="#" onclick="navigate('login')">Login</a>
        </div>
      </div>
    </div>
  `;
}

// Admin Dashboard
function renderAdminDashboard() {
  const pendingProducts = ProductService.getPending().length;
  const pendingTools = ToolService.getPending().length;
  const totalUsers = AppData.users.length;
  const totalOrders = AppData.orders.length;
  const totalRevenue = AppData.orders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your platform</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <div class="value">₹${totalRevenue.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="value">${totalOrders}</div>
        </div>
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="value">${totalUsers}</div>
        </div>
        <div class="stat-card">
          <h3>Pending Approvals</h3>
          <div class="value">${pendingProducts + pendingTools}</div>
        </div>
      </div>
      
      <div style="display: grid; gap: 24px; margin-top: 24px;">
        <div class="card">
          <div class="card-header">
            <h2>Pending Product Approvals</h2>
            <span class="badge">${pendingProducts}</span>
          </div>
          <div class="card-body">
            ${renderPendingProducts()}
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Pending Tool Approvals</h2>
            <span class="badge">${pendingTools}</span>
          </div>
          <div class="card-body">
            ${renderPendingTools()}
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Revenue Chart</h2>
          </div>
          <div class="card-body">
            <div class="chart-container" id="revenueChart"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPendingProducts() {
  const pending = ProductService.getPending();
  if (pending.length === 0) {
    return '<div class="empty-state"><p>No pending products</p></div>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Category</th>
          <th>Price</th>
          <th>Farmer</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pending.map(p => {
          const farmer = AppData.users.find(u => u.id === p.farmerId);
          return `
            <tr>
              <td><span style="font-size: 24px; margin-right: 8px;">${p.emoji}</span>${p.name}</td>
              <td>${p.category}</td>
              <td>₹${p.price}</td>
              <td>${farmer ? farmer.name : 'Unknown'}</td>
              <td>
                <button class="btn btn--primary btn--sm" onclick="approveProduct(${p.id})">Approve</button>
                <button class="btn btn--danger btn--sm" onclick="rejectProduct(${p.id})">Reject</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderPendingTools() {
  const pending = ToolService.getPending();
  if (pending.length === 0) {
    return '<div class="empty-state"><p>No pending tools</p></div>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Tool</th>
          <th>Category</th>
          <th>Price</th>
          <th>Farmer</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${pending.map(t => {
          const farmer = AppData.users.find(u => u.id === t.farmerId);
          return `
            <tr>
              <td><span style="font-size: 24px; margin-right: 8px;">${t.emoji}</span>${t.name}</td>
              <td>${t.category}</td>
              <td>₹${t.price.toLocaleString()}</td>
              <td>${farmer ? farmer.name : 'Unknown'}</td>
              <td>
                <button class="btn btn--primary btn--sm" onclick="approveTool(${t.id})">Approve</button>
                <button class="btn btn--danger btn--sm" onclick="rejectTool(${t.id})">Reject</button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// Farmer Dashboard
function renderFarmerDashboard() {
  const myProducts = ProductService.getByFarmer(Session.currentUser.id);
  const myTools = ToolService.getByFarmer(Session.currentUser.id);
  const myOrders = AppData.orders.filter(o => 
    o.items.some(item => {
      const product = myProducts.find(p => p.id === item.id);
      const tool = myTools.find(t => t.id === item.id);
      return product || tool;
    })
  );
  const revenue = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Farmer Dashboard</h1>
        <p>Welcome back, ${Session.currentUser.name}</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Revenue</h3>
          <div class="value">₹${revenue.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <h3>My Products</h3>
          <div class="value">${myProducts.length}</div>
        </div>
        <div class="stat-card">
          <h3>My Tools</h3>
          <div class="value">${myTools.length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="value">${myOrders.length}</div>
        </div>
      </div>
      
      <div style="display: grid; gap: 24px; margin-top: 24px;">
        <div class="card">
          <div class="card-header">
            <h2>My Products</h2>
            <button class="btn btn--primary btn--sm" onclick="showAddProductModal()">+ Add Product</button>
          </div>
          <div class="card-body">
            <div class="product-grid">
              ${myProducts.map(p => renderProductCard(p)).join('')}
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>My Tools</h2>
            <button class="btn btn--primary btn--sm" onclick="showAddToolModal()">+ Add Tool</button>
          </div>
          <div class="card-body">
            <div class="product-grid">
              ${myTools.map(t => renderToolCard(t)).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Consumer Dashboard
function renderConsumerDashboard() {
  const myOrders = OrderService.getByUser(Session.currentUser.id);
  const totalSpent = myOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Consumer Dashboard</h1>
        <p>Welcome back, ${Session.currentUser.name}</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="value">${myOrders.length}</div>
        </div>
        <div class="stat-card">
          <h3>Total Spent</h3>
          <div class="value">₹${totalSpent.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <h3>Cart Items</h3>
          <div class="value">${CartService.getCart().length}</div>
        </div>
      </div>
      
      <div style="display: grid; gap: 24px; margin-top: 24px;">
        <div class="card">
          <div class="card-header">
            <h2>My Orders</h2>
          </div>
          <div class="card-body">
            ${renderOrdersList(myOrders)}
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div class="card-body">
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <button class="btn btn--primary" onclick="navigate('products')">Browse Products</button>
              <button class="btn btn--primary" onclick="navigate('tools')">Browse Tools</button>
              <button class="btn btn--secondary" onclick="navigate('orders')">View All Orders</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOrdersList(orders) {
  if (orders.length === 0) {
    return '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No orders yet</p></div>';
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${orders.map(o => `
          <tr>
            <td>#${o.id}</td>
            <td>${o.items.length} items</td>
            <td>₹${o.totalPrice.toLocaleString()}</td>
            <td><span class="product-status ${o.status.toLowerCase()}">${o.status}</span></td>
            <td>${o.createdAt}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Products Page
function renderProducts() {
  const products = Session.hasRole('ADMIN') ? ProductService.getAll() : ProductService.getApproved();
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Products</h1>
        <p>Browse our fresh agricultural products</p>
      </div>
      
      <div class="filter-bar">
        <select id="categoryFilter" onchange="filterProducts()">
          <option value="">All Categories</option>
          <option value="GRAIN">Grains</option>
          <option value="VEGETABLE">Vegetables</option>
          <option value="FRUIT">Fruits</option>
        </select>
      </div>
      
      <div class="product-grid" id="productsGrid">
        ${products.map(p => renderProductCard(p, true)).join('')}
      </div>
    </div>
  `;
}

function renderProductCard(product, showAddToCart = false) {
  return `
    <div class="product-card">
      <div class="product-image">
        ${product.emoji}
        <div class="product-status ${product.status.toLowerCase()}">${product.status}</div>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-category">${product.category}</div>
        <div class="product-price">₹${product.price} / ${product.unit || 'unit'}</div>
        <div class="product-footer">
          ${showAddToCart && product.status === 'APPROVED' && Session.hasRole('CONSUMER') ? 
            `<button class="btn btn--primary btn--sm" onclick="addToCart('product', ${product.id})">Add to Cart</button>` : ''}
          ${Session.hasRole('FARMER') && product.farmerId === Session.currentUser.id ? 
            `<button class="btn btn--secondary btn--sm" onclick="editProduct(${product.id})">Edit</button>
             <button class="btn btn--danger btn--sm" onclick="deleteProduct(${product.id})">Delete</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Tools Page
function renderTools() {
  const tools = Session.hasRole('ADMIN') ? ToolService.getAll() : ToolService.getApproved();
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Farming Tools</h1>
        <p>Browse our farming equipment and supplies</p>
      </div>
      
      <div class="filter-bar">
        <select id="toolCategoryFilter" onchange="filterTools()">
          <option value="">All Categories</option>
          <option value="TRACTOR">Tractors</option>
          <option value="FERTILIZER">Fertilizers</option>
          <option value="SEEDS">Seeds</option>
          <option value="PESTICIDE">Pesticides</option>
          <option value="SPRAY_EQUIPMENT">Spray Equipment</option>
        </select>
      </div>
      
      <div class="product-grid" id="toolsGrid">
        ${tools.map(t => renderToolCard(t, true)).join('')}
      </div>
    </div>
  `;
}

function renderToolCard(tool, showAddToCart = false) {
  return `
    <div class="product-card">
      <div class="product-image">
        ${tool.emoji}
        <div class="product-status ${tool.status.toLowerCase()}">${tool.status}</div>
      </div>
      <div class="product-info">
        <h3>${tool.name}</h3>
        <div class="product-category">${tool.category}</div>
        <div class="product-price">₹${tool.price.toLocaleString()}</div>
        ${tool.warranty ? `<div style="font-size: 12px; color: var(--color-text-secondary);">Warranty: ${tool.warranty} months</div>` : ''}
        <div class="product-footer">
          ${showAddToCart && tool.status === 'APPROVED' && Session.hasRole('CONSUMER') ? 
            `<button class="btn btn--primary btn--sm" onclick="addToCart('tool', ${tool.id})">Add to Cart</button>` : ''}
          ${Session.hasRole('FARMER') && tool.farmerId === Session.currentUser.id ? 
            `<button class="btn btn--secondary btn--sm" onclick="editTool(${tool.id})">Edit</button>
             <button class="btn btn--danger btn--sm" onclick="deleteTool(${tool.id})">Delete</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

// Checkout Page
function renderCheckout() {
  const cart = CartService.getCart();
  const total = CartService.getTotal();
  
  if (cart.length === 0) {
    return `
      <div class="dashboard">
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <button class="btn btn--primary" onclick="navigate('products')">Browse Products</button>
        </div>
      </div>
    `;
  }
  
  return `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Checkout</h1>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2>Order Summary</h2>
        </div>
        <div class="card-body">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td><span style="font-size: 24px; margin-right: 8px;">${item.emoji}</span>${item.name}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>${item.quantity}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-bottom: 16px;">
              <span>Total:</span>
              <span>₹${total.toLocaleString()}</span>
            </div>
            <button class="btn btn--primary btn--full-width" onclick="placeOrder()">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  `;
}