// Data Store (In-Memory)
const AppData = {
  users: [
    { id: 1, name: 'Admin', email: 'admin@farmercommerce.com', password: 'admin123', role: 'ADMIN', phone: '+919876543210', verified: true, createdAt: '2025-01-01' },
    { id: 2, name: 'Raja Kumar', email: 'farmer@farmercommerce.com', password: 'farmer123', role: 'FARMER', phone: '+919876543211', farmName: 'Golden Fields Farm', verified: true, createdAt: '2025-01-15' },
    { id: 3, name: 'Abishek Sharma', email: 'consumer@farmercommerce.com', password: 'consumer123', role: 'CONSUMER', phone: '+919876543212', verified: true, createdAt: '2025-02-01' }
  ],
  
  products: [
    { id: 101, farmerId: 2, name: 'Basmati Rice', category: 'GRAIN', price: 150, quantity: 500, unit: 'kg', status: 'APPROVED', rating: 4.8, reviews: 45, description: 'Premium quality basmati rice', emoji: '🌾' },
    { id: 102, farmerId: 2, name: 'Organic Tomatoes', category: 'VEGETABLE', price: 50, quantity: 1000, unit: 'kg', status: 'PENDING', rating: 0, reviews: 0, description: 'Fresh organic tomatoes', emoji: '🍅' },
    { id: 103, farmerId: 2, name: 'Fresh Potatoes', category: 'VEGETABLE', price: 30, quantity: 800, unit: 'kg', status: 'APPROVED', rating: 4.5, reviews: 32, description: 'Locally grown potatoes', emoji: '🥔' },
    { id: 104, farmerId: 2, name: 'Golden Wheat', category: 'GRAIN', price: 40, quantity: 1200, unit: 'kg', status: 'APPROVED', rating: 4.7, reviews: 56, description: 'High quality wheat', emoji: '🌾' },
    { id: 105, farmerId: 2, name: 'Fresh Carrots', category: 'VEGETABLE', price: 45, quantity: 600, unit: 'kg', status: 'APPROVED', rating: 4.6, reviews: 28, description: 'Crunchy orange carrots', emoji: '🥕' },
    { id: 106, farmerId: 2, name: 'Green Spinach', category: 'VEGETABLE', price: 35, quantity: 400, unit: 'kg', status: 'PENDING', rating: 0, reviews: 0, description: 'Nutrient-rich spinach', emoji: '🥬' },
    { id: 107, farmerId: 2, name: 'Red Onions', category: 'VEGETABLE', price: 40, quantity: 700, unit: 'kg', status: 'APPROVED', rating: 4.4, reviews: 41, description: 'Fresh red onions', emoji: '🧅' },
    { id: 108, farmerId: 2, name: 'Organic Corn', category: 'GRAIN', price: 60, quantity: 500, unit: 'kg', status: 'APPROVED', rating: 4.9, reviews: 67, description: 'Sweet organic corn', emoji: '🌽' }
  ],
  
  tools: [
    { id: 201, farmerId: 2, name: 'John Deere Tractor', category: 'TRACTOR', price: 500000, quantity: 5, status: 'APPROVED', warranty: 24, description: '50HP agricultural tractor', emoji: '🚜', rating: 4.8, reviews: 12 },
    { id: 202, farmerId: 2, name: 'Spraying Equipment', category: 'SPRAY_EQUIPMENT', price: 25000, quantity: 10, status: 'APPROVED', warranty: 12, description: 'High-pressure sprayer', emoji: '💦', rating: 4.5, reviews: 8 },
    { id: 203, farmerId: 2, name: 'NPK Fertilizer', category: 'FERTILIZER', price: 800, quantity: 200, status: 'APPROVED', warranty: 0, description: 'Balanced NPK formula', emoji: '🧪', rating: 4.6, reviews: 34 },
    { id: 204, farmerId: 2, name: 'Wheat Seeds', category: 'SEEDS', price: 120, quantity: 500, status: 'PENDING', warranty: 0, description: 'High-yield wheat seeds', emoji: '🌱', rating: 0, reviews: 0 },
    { id: 205, farmerId: 2, name: 'Organic Pesticide', category: 'PESTICIDE', price: 450, quantity: 150, status: 'APPROVED', warranty: 0, description: 'Eco-friendly pest control', emoji: '🐛', rating: 4.7, reviews: 19 },
    { id: 206, farmerId: 2, name: 'Mini Tiller', category: 'TRACTOR', price: 35000, quantity: 8, status: 'APPROVED', warranty: 18, description: 'Compact soil tiller', emoji: '⚙️', rating: 4.4, reviews: 6 }
  ],
  
  orders: [
    { id: 1001, userId: 3, items: [{ type: 'product', id: 101, name: 'Basmati Rice', quantity: 5, price: 150, emoji: '🌾' }], totalPrice: 750, status: 'DELIVERED', createdAt: '2025-11-10', deliveredAt: '2025-11-13' },
    { id: 1002, userId: 3, items: [{ type: 'tool', id: 201, name: 'John Deere Tractor', quantity: 1, price: 500000, emoji: '🚜' }], totalPrice: 500000, status: 'SHIPPED', createdAt: '2025-11-14', shippedAt: '2025-11-15' },
    { id: 1003, userId: 3, items: [{ type: 'product', id: 103, name: 'Fresh Potatoes', quantity: 10, price: 30, emoji: '🥔' }], totalPrice: 300, status: 'PROCESSING', createdAt: '2025-11-16' }
  ],
  
  cart: [],
  
  reviews: [
    { id: 1, productId: 101, userId: 3, userName: 'Priya Sharma', rating: 5, comment: 'Excellent quality rice!', createdAt: '2025-11-14' },
    { id: 2, productId: 103, userId: 3, userName: 'Priya Sharma', rating: 4, comment: 'Good potatoes, fresh delivery', createdAt: '2025-11-12' }
  ],
  
  approvals: []
};

// Session Management
const Session = {
  currentUser: null,
  token: null,
  
  login(email, password) {
    const user = AppData.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      this.token = `token_${user.id}_${Date.now()}`;
      return { success: true, user, token: this.token };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  register(userData) {
    const exists = AppData.users.find(u => u.email === userData.email);
    if (exists) {
      return { success: false, message: 'Email already exists' };
    }
    
    const newUser = {
      id: AppData.users.length + 1,
      ...userData,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    AppData.users.push(newUser);
    this.currentUser = newUser;
    this.token = `token_${newUser.id}_${Date.now()}`;
    
    return { success: true, user: newUser, token: this.token };
  },
  
  logout() {
    this.currentUser = null;
    this.token = null;
  },
  
  isAuthenticated() {
    return this.currentUser !== null;
  },
  
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }
};

// Product Service
const ProductService = {
  getAll() {
    return AppData.products;
  },
  
  getById(id) {
    return AppData.products.find(p => p.id === parseInt(id));
  },
  
  getByFarmer(farmerId) {
    return AppData.products.filter(p => p.farmerId === farmerId);
  },
  
  getApproved() {
    return AppData.products.filter(p => p.status === 'APPROVED');
  },
  
  getPending() {
    return AppData.products.filter(p => p.status === 'PENDING');
  },
  
  add(product) {
    const newProduct = {
      id: Math.max(...AppData.products.map(p => p.id), 100) + 1,
      ...product,
      rating: 0,
      reviews: 0,
      status: 'PENDING'
    };
    AppData.products.push(newProduct);
    return newProduct;
  },
  
  update(id, updates) {
    const index = AppData.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      AppData.products[index] = { ...AppData.products[index], ...updates };
      return AppData.products[index];
    }
    return null;
  },
  
  delete(id) {
    const index = AppData.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      AppData.products.splice(index, 1);
      return true;
    }
    return false;
  },
  
  approve(id) {
    return this.update(id, { status: 'APPROVED' });
  },
  
  reject(id) {
    return this.update(id, { status: 'REJECTED' });
  },
  
  search(query) {
    const q = query.toLowerCase();
    return AppData.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }
};

// Tool Service
const ToolService = {
  getAll() {
    return AppData.tools;
  },
  
  getById(id) {
    return AppData.tools.find(t => t.id === parseInt(id));
  },
  
  getByFarmer(farmerId) {
    return AppData.tools.filter(t => t.farmerId === farmerId);
  },
  
  getApproved() {
    return AppData.tools.filter(t => t.status === 'APPROVED');
  },
  
  getPending() {
    return AppData.tools.filter(t => t.status === 'PENDING');
  },
  
  add(tool) {
    const newTool = {
      id: Math.max(...AppData.tools.map(t => t.id), 200) + 1,
      ...tool,
      rating: 0,
      reviews: 0,
      status: 'PENDING'
    };
    AppData.tools.push(newTool);
    return newTool;
  },
  
  update(id, updates) {
    const index = AppData.tools.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      AppData.tools[index] = { ...AppData.tools[index], ...updates };
      return AppData.tools[index];
    }
    return null;
  },
  
  delete(id) {
    const index = AppData.tools.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
      AppData.tools.splice(index, 1);
      return true;
    }
    return false;
  },
  
  approve(id) {
    return this.update(id, { status: 'APPROVED' });
  },
  
  reject(id) {
    return this.update(id, { status: 'REJECTED' });
  },
  
  search(query) {
    const q = query.toLowerCase();
    return AppData.tools.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }
};

// Cart Service
const CartService = {
  getCart() {
    if (!Session.currentUser) return [];
    return AppData.cart.filter(item => item.userId === Session.currentUser.id);
  },
  
  addItem(type, itemId, quantity = 1) {
    if (!Session.currentUser) return null;
    
    const item = type === 'product' ? ProductService.getById(itemId) : ToolService.getById(itemId);
    if (!item) return null;
    
    const existingIndex = AppData.cart.findIndex(
      c => c.userId === Session.currentUser.id && c.itemId === itemId && c.type === type
    );
    
    if (existingIndex !== -1) {
      AppData.cart[existingIndex].quantity += quantity;
    } else {
      AppData.cart.push({
        userId: Session.currentUser.id,
        type,
        itemId,
        name: item.name,
        price: item.price,
        emoji: item.emoji,
        quantity
      });
    }
    
    return this.getCart();
  },
  
  updateQuantity(type, itemId, quantity) {
    const index = AppData.cart.findIndex(
      c => c.userId === Session.currentUser.id && c.itemId === itemId && c.type === type
    );
    
    if (index !== -1) {
      if (quantity <= 0) {
        AppData.cart.splice(index, 1);
      } else {
        AppData.cart[index].quantity = quantity;
      }
    }
    
    return this.getCart();
  },
  
  removeItem(type, itemId) {
    const index = AppData.cart.findIndex(
      c => c.userId === Session.currentUser.id && c.itemId === itemId && c.type === type
    );
    
    if (index !== -1) {
      AppData.cart.splice(index, 1);
    }
    
    return this.getCart();
  },
  
  clear() {
    AppData.cart = AppData.cart.filter(item => item.userId !== Session.currentUser.id);
    return [];
  },
  
  getTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
};

// Order Service
const OrderService = {
  getAll() {
    return AppData.orders;
  },
  
  getById(id) {
    return AppData.orders.find(o => o.id === parseInt(id));
  },
  
  getByUser(userId) {
    return AppData.orders.filter(o => o.userId === userId);
  },
  
  create(orderData) {
    const newOrder = {
      id: Math.max(...AppData.orders.map(o => o.id), 1000) + 1,
      userId: Session.currentUser.id,
      ...orderData,
      status: 'PROCESSING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    AppData.orders.push(newOrder);
    CartService.clear();
    
    return newOrder;
  },
  
  updateStatus(id, status) {
    const order = this.getById(id);
    if (order) {
      order.status = status;
      if (status === 'SHIPPED') {
        order.shippedAt = new Date().toISOString().split('T')[0];
      } else if (status === 'DELIVERED') {
        order.deliveredAt = new Date().toISOString().split('T')[0];
      }
    }
    return order;
  }
};

// Review Service
const ReviewService = {
  getByProduct(productId) {
    return AppData.reviews.filter(r => r.productId === parseInt(productId));
  },
  
  add(review) {
    const newReview = {
      id: AppData.reviews.length + 1,
      userId: Session.currentUser.id,
      userName: Session.currentUser.name,
      ...review,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    AppData.reviews.push(newReview);
    return newReview;
  }
};
