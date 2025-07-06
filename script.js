// 商品数据
const products = [
    {
        id: 1,
        name: "专业哑铃套装",
        description: "可调节重量，适合家庭健身使用",
        price: 299,
        originalPrice: 399,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "fitness",
        badge: "热销"
    },
    {
        id: 2,
        name: "智能跑步机",
        description: "静音设计，多种运动模式",
        price: 2999,
        originalPrice: 3999,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        category: "cardio",
        badge: "新品"
    },
    {
        id: 3,
        name: "瑜伽垫套装",
        description: "环保材质，防滑设计",
        price: 89,
        originalPrice: 129,
        image: "https://images.unsplash.com/photo-1506629905607-d9c8e5f2c7b8?w=400&h=300&fit=crop",
        category: "yoga",
        badge: "特价"
    },
    {
        id: 4,
        name: "健身手套",
        description: "透气防滑，保护双手",
        price: 59,
        originalPrice: 89,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "accessories",
        badge: "推荐"
    },
    {
        id: 5,
        name: "动感单车",
        description: "静音飞轮，多档位调节",
        price: 1299,
        originalPrice: 1699,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "cardio",
        badge: "热销"
    },
    {
        id: 6,
        name: "拉力器套装",
        description: "多功能训练，便携设计",
        price: 199,
        originalPrice: 299,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "fitness",
        badge: "特价"
    },
    {
        id: 7,
        name: "瑜伽球",
        description: "加厚防爆，多种尺寸",
        price: 79,
        originalPrice: 119,
        image: "https://images.unsplash.com/photo-1506629905607-d9c8e5f2c7b8?w=400&h=300&fit=crop",
        category: "yoga",
        badge: "新品"
    },
    {
        id: 8,
        name: "运动水杯",
        description: "保温设计，大容量",
        price: 39,
        originalPrice: 59,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        category: "accessories",
        badge: "推荐"
    }
];

// 购物车数据
let cart = [];

// 当前用户
let currentUser = null;

// 轮播图当前索引
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    loadProducts();
    startSlideshow();
    setupScrollEffects();
    setupFormHandlers();
    loadCartFromStorage();
    updateCartDisplay();
}

// 加载商品
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' ? products : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// 创建商品卡片
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-badge">${product.badge}</div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">¥${product.price}</span>
                <span class="original-price">¥${product.originalPrice}</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> 加入购物车
                </button>
                <button class="quick-view" onclick="quickView(${product.id})">
                    <i class="fas fa-eye"></i> 快速查看
                </button>
            </div>
        </div>
    `;
    return card;
}

// 商品筛选
function filterProducts(category) {
    // 更新筛选按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 加载筛选后的商品
    loadProducts(category);
    
    // 添加动画效果
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.style.opacity = '0';
    setTimeout(() => {
        productsGrid.style.opacity = '1';
    }, 100);
}

// 添加到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showMessage('商品已添加到购物车', 'success');
    
    // 添加动画效果
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

// 更新购物车显示
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // 更新购物车数量
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // 更新购物车内容
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>购物车是空的</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 10px; color: #ff4757;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 更新总价
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        saveCartToStorage();
    }
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
    showMessage('商品已从购物车移除', 'success');
}

// 切换购物车显示
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

// 结算
function checkout() {
    if (cart.length === 0) {
        showMessage('购物车是空的', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('请先登录', 'error');
        showLogin();
        return;
    }
    
    // 模拟结算过程
    showMessage('正在处理订单...', 'success');
    
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        toggleCart();
        showMessage('订单提交成功！', 'success');
    }, 2000);
}

// 轮播图功能
function startSlideshow() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(direction) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// 显示登录模态框
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

// 关闭登录模态框
function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

// 显示注册模态框
function showRegister() {
    closeLogin();
    document.getElementById('registerModal').style.display = 'block';
}

// 关闭注册模态框
function closeRegister() {
    document.getElementById('registerModal').style.display = 'none';
}

// 设置表单处理器
function setupFormHandlers() {
    // 登录表单
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 模拟登录验证
        if (username && password) {
            currentUser = { username: username };
            closeLogin();
            updateLoginStatus();
            showMessage('登录成功！', 'success');
        } else {
            showMessage('请填写完整信息', 'error');
        }
    });
    
    // 注册表单
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            showMessage('密码不匹配', 'error');
            return;
        }
        
        if (username && email && password) {
            currentUser = { username: username, email: email };
            closeRegister();
            updateLoginStatus();
            showMessage('注册成功！', 'success');
        } else {
            showMessage('请填写完整信息', 'error');
        }
    });
    
    // 联系表单
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showMessage('消息已发送，我们会尽快回复您！', 'success');
        this.reset();
    });
}

// 更新登录状态
function updateLoginStatus() {
    const loginBtn = document.querySelector('.login-btn');
    if (currentUser) {
        loginBtn.textContent = currentUser.username;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = '登录';
        loginBtn.onclick = showLogin;
    }
}

// 退出登录
function logout() {
    currentUser = null;
    updateLoginStatus();
    showMessage('已退出登录', 'success');
}

// 快速查看商品
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // 创建快速查看模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <div style="display: flex; gap: 2rem; align-items: center;">
                <img src="${product.image}" alt="${product.name}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 10px;">
                <div>
                    <h2>${product.name}</h2>
                    <p style="color: #666; margin: 1rem 0;">${product.description}</p>
                    <div style="display: flex; align-items: center; gap: 1rem; margin: 1rem 0;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: #ff4757;">¥${product.price}</span>
                        <span style="text-decoration: line-through; color: #999;">¥${product.originalPrice}</span>
                    </div>
                    <button onclick="addToCart(${product.id}); this.parentElement.parentElement.parentElement.parentElement.remove();" 
                            style="background: #667eea; color: white; border: none; padding: 1rem 2rem; border-radius: 8px; cursor: pointer; font-weight: bold;">
                        加入购物车
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// 显示消息
function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 滚动效果
function setupScrollEffects() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
}

// 回到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 保存购物车到本地存储
function saveCartToStorage() {
    localStorage.setItem('sportsMallCart', JSON.stringify(cart));
}

// 从本地存储加载购物车
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('sportsMallCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// 平滑滚动到指定元素
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 搜索功能
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1/-1;">未找到相关商品</p>';
    } else {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
}

// 添加搜索事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.addEventListener('click', function() {
        const query = prompt('请输入搜索关键词:');
        if (query) {
            searchProducts(query);
            // 滚动到商品区域
            smoothScrollTo('products');
        }
    });
});

// 点击模态框外部关闭
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === registerModal) {
        closeRegister();
    }
});

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    // ESC键关闭模态框和购物车
    if (event.key === 'Escape') {
        closeLogin();
        closeRegister();
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
    
    // 左右箭头键控制轮播图
    if (event.key === 'ArrowLeft') {
        changeSlide(-1);
    }
    if (event.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// 图片懒加载
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// 页面性能优化
function optimizePerformance() {
    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // 优化滚动事件
    const optimizedScroll = throttle(setupScrollEffects, 100);
    window.addEventListener('scroll', optimizedScroll);
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
    optimizePerformance();
});

// 导出函数供全局使用
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.changeSlide = changeSlide;
window.showLogin = showLogin;
window.closeLogin = closeLogin;
window.showRegister = showRegister;
window.closeRegister = closeRegister;
window.quickView = quickView;
window.scrollToTop = scrollToTop;

/* 
来源: Claude AI助手
提示词: 为运动器材商城创建JavaScript交互功能，包括商品管理、购物车、用户登录、轮播图等
范围: script.js 全文件
*/