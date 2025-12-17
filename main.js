// Router and Event Handlers

let currentRoute = 'home';

function navigate(route) {
  currentRoute = route;
  
  // Check authentication
  if (!Session.isAuthenticated() && !['home', 'login', 'register'].includes(route)) {
    navigate('login');
    return;
  }
  
  const mainContent = document.getElementById('mainContent');
  const header = document.getElementById('header');
  const sidebar = document.getElementById('sidebar');
  
  // Handle public pages
  if (['home', 'login', 'register'].includes(route)) {
    header.classList.add('hidden');
    sidebar.classList.add('hidden');
    mainContent.classList.remove('with-sidebar');
    mainContent.classList.add('no-sidebar');
  } else {
    header.classList.remove('hidden');
    sidebar.classList.remove('hidden');
    mainContent.classList.add('with-sidebar');
    mainContent.classList.remove('no-sidebar');
    updateSidebar();
  }
  
  // Render content
  switch(route) {
    case 'home':
      mainContent.innerHTML = renderHomepage();
      break;
    case 'login':
      mainContent.innerHTML = renderLogin();
      break;
    case 'register':
      mainContent.innerHTML = renderRegister();
      break;
    case 'admin-dashboard':
      mainContent.innerHTML = renderAdminDashboard();
      setTimeout(renderRevenueChart, 100);
      break;
    case 'farmer-dashboard':
      mainContent.innerHTML = renderFarmerDashboard();
      break;
    case 'consumer-dashboard':
      mainContent.innerHTML = renderConsumerDashboard();
      break;
    case 'products':
      mainContent.innerHTML = renderProducts();
      break;
    case 'tools':
      mainContent.innerHTML = renderTools();
      break;
    case 'checkout':
      mainContent.innerHTML = renderCheckout();
      break;
    case 'orders':
      const myOrders = OrderService.getByUser(Session.currentUser.id);
      mainContent.innerHTML = `
        <div class="dashboard">
          <div class="dashboard-header">
            <h1>My Orders</h1>
          </div>
          <div class="card">
            <div class="card-body">
              ${renderOrdersList(myOrders)}
            </div>
          </div>
        </div>
      `;
      break;
    default:
      mainContent.innerHTML = '<div class="dashboard"><h1>404 - Page Not Found</h1></div>';
  }
  
  updateCartBadge();
}

function updateSidebar() {
  const sidebarNav = document.querySelector('.sidebar-nav');
  const user = Session.currentUser;
  
  if (!user) return;
  
  let links = [];
  
  if (user.role === 'ADMIN') {
    links = [
      { icon: '📊', text: 'Dashboard', route: 'admin-dashboard' },
      { icon: '📦', text: 'Products', route: 'products' },
      { icon: '🔧', text: 'Tools', route: 'tools' },
      { icon: '👥', text: 'Users', route: 'users' }
    ];
  } else if (user.role === 'FARMER') {
    links = [
      { icon: '📊', text: 'Dashboard', route: 'farmer-dashboard' },
      { icon: '📦', text: 'Products', route: 'products' },
      { icon: '🔧', text: 'Tools', route: 'tools' },
      { icon: '📋', text: 'Orders', route: 'orders' }
    ];
  } else if (user.role === 'CONSUMER') {
    links = [
      { icon: '📊', text: 'Dashboard', route: 'consumer-dashboard' },
      { icon: '📦', text: 'Products', route: 'products' },
      { icon: '🔧', text: 'Tools', route: 'tools' },
      { icon: '📋', text: 'Orders', route: 'orders' },
      { icon: '🛒', text: 'Checkout', route: 'checkout' }
    ];
  }
  
  sidebarNav.innerHTML = links.map(link => `
    <a href="#" onclick="navigate('${link.route}'); return false;" class="${currentRoute === link.route ? 'active' : ''}">
      <span>${link.icon}</span>
      <span>${link.text}</span>
    </a>
  `).join('');
  
  // Update user name in header
  document.getElementById('userName').textContent = user.name.split(' ')[0];
}

// Auth Handlers
function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  const result = Session.login(email, password);
  
  if (result.success) {
    showToast('Login successful!', 'success');
    
    // Navigate to role-specific dashboard
    if (result.user.role === 'ADMIN') {
      navigate('admin-dashboard');
    } else if (result.user.role === 'FARMER') {
      navigate('farmer-dashboard');
    } else {
      navigate('consumer-dashboard');
    }
  } else {
    showToast(result.message, 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const userData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
    role: formData.get('role')
  };
  
  const result = Session.register(userData);
  
  if (result.success) {
    showToast('Registration successful!', 'success');
    
    if (result.user.role === 'FARMER') {
      navigate('farmer-dashboard');
    } else {
      navigate('consumer-dashboard');
    }
  } else {
    showToast(result.message, 'error');
  }
}

function handleLogout() {
  Session.logout();
  CartService.clear();
  showToast('Logged out successfully', 'success');
  navigate('home');
}

// Cart Handlers
function addToCart(type, itemId) {
  if (!Session.isAuthenticated()) {
    showToast('Please login to add items to cart', 'error');
    navigate('login');
    return;
  }
  
  CartService.addItem(type, itemId, 1);
  showToast('Item added to cart!', 'success');
  updateCartBadge();
  renderCart();
}

function updateCartItem(type, itemId, quantity) {
  CartService.updateQuantity(type, itemId, quantity);
  renderCart();
}

function removeCartItem(type, itemId) {
  CartService.removeItem(type, itemId);
  showToast('Item removed from cart', 'success');
  renderCart();
}

function toggleCart() {
  const cartDrawer = document.getElementById('cartDrawer');
  cartDrawer.classList.toggle('open');
  if (cartDrawer.classList.contains('open')) {
    renderCart();
  }
}

function placeOrder() {
  const cart = CartService.getCart();
  const total = CartService.getTotal();
  
  const order = OrderService.create({
    items: cart.map(item => ({
      type: item.type,
      id: item.itemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      emoji: item.emoji
    })),
    totalPrice: total
  });
  
  showToast(`Order #${order.id} placed successfully!`, 'success');
  updateCartBadge();
  navigate('orders');
}

// Product Handlers
function approveProduct(id) {
  ProductService.approve(id);
  showToast('Product approved!', 'success');
  navigate('admin-dashboard');
}

function rejectProduct(id) {
  ProductService.reject(id);
  showToast('Product rejected', 'success');
  navigate('admin-dashboard');
}

function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    ProductService.delete(id);
    showToast('Product deleted', 'success');
    navigate('farmer-dashboard');
  }
}

function editProduct(id) {
  const product = ProductService.getById(id);
  showModal('Edit Product', `
    <form id="editProductForm" onsubmit="handleEditProduct(event, ${id})">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" name="name" value="${product.name}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Price</label>
        <input type="number" class="form-control" name="price" value="${product.price}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" name="quantity" value="${product.quantity}" required>
      </div>
      <button type="submit" class="btn btn--primary btn--full-width">Update Product</button>
    </form>
  `);
}

function handleEditProduct(e, id) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  ProductService.update(id, {
    name: formData.get('name'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity'))
  });
  
  showToast('Product updated!', 'success');
  closeModal();
  navigate('farmer-dashboard');
}

function showAddProductModal() {
  showModal('Add New Product', `
    <form id="addProductForm" onsubmit="handleAddProduct(event)">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" name="name" required>
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-control" name="category" required>
          <option value="GRAIN">Grain</option>
          <option value="VEGETABLE">Vegetable</option>
          <option value="FRUIT">Fruit</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Price (₹)</label>
        <input type="number" class="form-control" name="price" required>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" name="quantity" required>
      </div>
      <div class="form-group">
        <label class="form-label">Unit</label>
        <input type="text" class="form-control" name="unit" value="kg" required>
      </div>
      <div class="form-group">
        <label class="form-label">Emoji</label>
        <input type="text" class="form-control" name="emoji" value="🌾" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" name="description" rows="3" required></textarea>
      </div>
      <button type="submit" class="btn btn--primary btn--full-width">Add Product</button>
    </form>
  `);
}

function handleAddProduct(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  ProductService.add({
    farmerId: Session.currentUser.id,
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')),
    unit: formData.get('unit'),
    emoji: formData.get('emoji'),
    description: formData.get('description')
  });
  
  showToast('Product added! Waiting for admin approval.', 'success');
  closeModal();
  navigate('farmer-dashboard');
}

// Tool Handlers
function approveTool(id) {
  ToolService.approve(id);
  showToast('Tool approved!', 'success');
  navigate('admin-dashboard');
}

function rejectTool(id) {
  ToolService.reject(id);
  showToast('Tool rejected', 'success');
  navigate('admin-dashboard');
}

function deleteTool(id) {
  if (confirm('Are you sure you want to delete this tool?')) {
    ToolService.delete(id);
    showToast('Tool deleted', 'success');
    navigate('farmer-dashboard');
  }
}

function editTool(id) {
  const tool = ToolService.getById(id);
  showModal('Edit Tool', `
    <form id="editToolForm" onsubmit="handleEditTool(event, ${id})">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" name="name" value="${tool.name}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Price</label>
        <input type="number" class="form-control" name="price" value="${tool.price}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" name="quantity" value="${tool.quantity}" required>
      </div>
      <button type="submit" class="btn btn--primary btn--full-width">Update Tool</button>
    </form>
  `);
}

function handleEditTool(e, id) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  ToolService.update(id, {
    name: formData.get('name'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity'))
  });
  
  showToast('Tool updated!', 'success');
  closeModal();
  navigate('farmer-dashboard');
}

function showAddToolModal() {
  showModal('Add New Tool', `
    <form id="addToolForm" onsubmit="handleAddTool(event)">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" class="form-control" name="name" required>
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-control" name="category" required>
          <option value="TRACTOR">Tractor</option>
          <option value="FERTILIZER">Fertilizer</option>
          <option value="SEEDS">Seeds</option>
          <option value="PESTICIDE">Pesticide</option>
          <option value="SPRAY_EQUIPMENT">Spray Equipment</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Price (₹)</label>
        <input type="number" class="form-control" name="price" required>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity</label>
        <input type="number" class="form-control" name="quantity" required>
      </div>
      <div class="form-group">
        <label class="form-label">Warranty (months)</label>
        <input type="number" class="form-control" name="warranty" value="12">
      </div>
      <div class="form-group">
        <label class="form-label">Emoji</label>
        <input type="text" class="form-control" name="emoji" value="🔧" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" name="description" rows="3" required></textarea>
      </div>
      <button type="submit" class="btn btn--primary btn--full-width">Add Tool</button>
    </form>
  `);
}

function handleAddTool(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  ToolService.add({
    farmerId: Session.currentUser.id,
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')),
    warranty: parseInt(formData.get('warranty') || 0),
    emoji: formData.get('emoji'),
    description: formData.get('description')
  });
  
  showToast('Tool added! Waiting for admin approval.', 'success');
  closeModal();
  navigate('farmer-dashboard');
}

// Modal Helpers
function showModal(title, content) {
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.innerHTML = `
    <div style="padding: 32px;">
      <h2 style="margin-bottom: 24px;">${title}</h2>
      ${content}
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
}

// Chart Renderer
function renderRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  
  // Simple bar chart with div elements
  const monthlyRevenue = {
    'Oct': 45000,
    'Nov': 78000,
    'Dec': 92000
  };
  
  const max = Math.max(...Object.values(monthlyRevenue));
  
  canvas.innerHTML = Object.entries(monthlyRevenue).map(([month, value]) => {
    const height = (value / max) * 100;
    return `
      <div style="display: flex; align-items: flex-end; flex: 1; gap: 8px;">
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 100%; height: ${height}%; min-height: 40px; background: var(--color-primary); border-radius: 8px 8px 0 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
            ₹${(value/1000).toFixed(0)}K
          </div>
          <div style="margin-top: 8px; font-weight: bold;">${month}</div>
        </div>
      </div>
    `;
  }).join('');
  
  canvas.style.display = 'flex';
  canvas.style.gap = '16px';
  canvas.style.alignItems = 'flex-end';
}

// Filter Functions
function filterProducts() {
  const category = document.getElementById('categoryFilter').value;
  let products = Session.hasRole('ADMIN') ? ProductService.getAll() : ProductService.getApproved();
  
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  document.getElementById('productsGrid').innerHTML = products.map(p => renderProductCard(p, true)).join('');
}

function filterTools() {
  const category = document.getElementById('toolCategoryFilter').value;
  let tools = Session.hasRole('ADMIN') ? ToolService.getAll() : ToolService.getApproved();
  
  if (category) {
    tools = tools.filter(t => t.category === category);
  }
  
  document.getElementById('toolsGrid').innerHTML = tools.map(t => renderToolCard(t, true)).join('');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  // Setup event listeners
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
  
  document.getElementById('cartBtn').addEventListener('click', toggleCart);
  document.getElementById('closeCart').addEventListener('click', toggleCart);
  
  document.getElementById('userMenuBtn').addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('hidden');
  });
  
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
  });
  
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
  });
  
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    toggleCart();
    navigate('checkout');
  });
  
  document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (query) {
      const products = ProductService.search(query);
      const tools = ToolService.search(query);
      showToast(`Found ${products.length + tools.length} results`, 'success');
    }
  });
  
  // Start on homepage
  navigate('home');
});