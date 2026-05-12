// ============================================================
//  app.js — Frontend Application (uses fetch() to call backend)
// ============================================================

const API = 'http://localhost:3000/api';

/* ── State ─────────────────────────────────────────────────── */
const state = {
  cart:       [],
  categoryId: 0,
  search:     '',
  vegOnly:    false,
  allItems:   [],    // cached from API
};

/* ── DOM References ─────────────────────────────────────────── */
const menuGrid       = document.getElementById('menuGrid');
const cartDrawer     = document.getElementById('cartDrawer');
const cartOverlay    = document.getElementById('cartOverlay');
const cartItemsList  = document.getElementById('cartItemsList');
const cartEmpty      = document.getElementById('cartEmpty');
const drawerFooter   = document.getElementById('drawerFooter');
const cartCountEl    = document.getElementById('cartCount');
const searchInput    = document.getElementById('searchInput');
const vegToggle      = document.getElementById('vegToggle');
const categoryList   = document.getElementById('categoryList');
const resultCount    = document.getElementById('resultCount');
const sectionTitle   = document.getElementById('sectionTitle');
const toastContainer = document.getElementById('toastContainer');
const modalOverlay   = document.getElementById('modalOverlay');
const orderIdBadge   = document.getElementById('orderIdBadge');

/* ── Utilities ──────────────────────────────────────────────── */
const fmt = n => `$${Number(n).toFixed(2)}`;

function showToast(msg, type = 'default', icon = '🍽️') {
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 2200);
}

function setLoading(isLoading) {
  if (isLoading) {
    menuGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="animation:spin 1s linear infinite">⏳</div>
        <h3>Loading menu…</h3>
      </div>`;
  }
}

/* ── API Calls (fetch → Express → SQLite) ───────────────────── */

// Fetch all categories from GET /api/categories
async function fetchCategories() {
  try {
    const res  = await fetch(`${API}/categories`);
    const json = await res.json();
    return json.data || [];
  } catch {
    showToast('Could not load categories', 'error', '❌');
    return [];
  }
}

// Fetch menu items from GET /api/menu with filters
async function fetchMenu({ search = '', category_id = 0, veg = false } = {}) {
  try {
    const params = new URLSearchParams();
    if (search)       params.set('search',      search);
    if (category_id)  params.set('category_id', category_id);
    if (veg)          params.set('veg',          '1');

    const res  = await fetch(`${API}/menu?${params}`);
    const json = await res.json();
    return json.data || [];
  } catch {
    showToast('Could not load menu', 'error', '❌');
    return [];
  }
}

// Place order via POST /api/orders
async function postOrder(customer_name, table_number, items) {
  const res  = await fetch(`${API}/orders`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ customer_name, table_number, items }),
  });
  return res.json();
}

// Fetch the most recently placed order with its items
async function fetchRecentOrder() {
  try {
    // 1. Get the list of all orders (sorted latest first)
    const listRes = await fetch(`${API}/orders`);
    const listJson = await listRes.json();
    
    if (listJson.success && listJson.data.length > 0) {
      const recentId = listJson.data[0].order_id;
      // 2. Fetch the full details of the latest order
      const orderRes = await fetch(`${API}/orders/${recentId}`);
      const orderJson = await orderRes.json();
      return orderJson.data; // This includes the order and its items
    }
    return null;
  } catch (err) {
    console.error('Error fetching recent order:', err);
    return null;
  }
}

/* ── Category Sidebar ───────────────────────────────────────── */
async function renderCategories() {
  const cats = await fetchCategories();

  categoryList.innerHTML = `
    <button class="cat-btn active" id="cat-btn-0" onclick="selectCategory(0, 'All Items')">
      <span class="cat-icon">🍽️</span> All Items
      <span class="cat-count">${state.allItems.length}</span>
    </button>`;

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.id = `cat-btn-${cat.category_id}`;
    btn.innerHTML = `
      <span class="cat-icon">${cat.icon}</span> ${cat.name}
      <span class="cat-count">${cat.item_count}</span>`;
    btn.onclick = () => selectCategory(cat.category_id, cat.name);
    categoryList.appendChild(btn);
  });
}

async function selectCategory(id, label = 'All Items') {
  state.categoryId = id;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`cat-btn-${id}`)?.classList.add('active');
  sectionTitle.innerHTML = `<span>${label}</span>`;
  await renderMenu();
}

/* ── Menu Rendering ─────────────────────────────────────────── */
async function renderMenu() {
  setLoading(true);

  const items = await fetchMenu({
    search:      state.search,
    category_id: state.categoryId,
    veg:         state.vegOnly,
  });

  resultCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

  if (items.length === 0) {
    menuGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No items found</h3>
        <p>Try a different search or category</p>
      </div>`;
    return;
  }

  menuGrid.innerHTML = items.map(createCardHTML).join('');
}

function createCardHTML(item) {
  const cartItem = state.cart.find(c => c.item.item_id === item.item_id);
  const qty      = cartItem ? cartItem.qty : 0;
  const stars    = '★'.repeat(Math.round(item.rating)) + '☆'.repeat(5 - Math.round(item.rating));
  const vegClass = item.is_veg ? 'veg' : 'nonveg';

  const actionHTML = qty > 0
    ? `<div class="qty-controls">
         <button class="qty-btn" onclick="changeQty(${item.item_id}, -1)">−</button>
         <span class="qty-num">${qty}</span>
         <button class="qty-btn" onclick="changeQty(${item.item_id}, 1)">+</button>
       </div>`
    : `<button class="add-btn" onclick="addToCart(${item.item_id})">+ Add</button>`;

  return `
    <div class="menu-card" id="card-${item.item_id}">
      <div class="card-emoji-wrap">
        <span>${item.emoji}</span>
        <div class="veg-badge ${vegClass}" title="${item.is_veg ? 'Vegetarian' : 'Non-Veg'}"></div>
      </div>
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-desc">${item.description}</div>
        <div class="card-rating">${stars} <span>${item.rating} / 5</span></div>
      </div>
      <div class="card-footer">
        <div class="card-price">${fmt(item.price)} <small>/ serving</small></div>
        ${actionHTML}
      </div>
    </div>`;
}

/* ── Cart Logic ─────────────────────────────────────────────── */
async function addToCart(itemId) {
  // Fetch item details from API  (GET /api/menu/:id)
  try {
    const res  = await fetch(`${API}/menu/${itemId}`);
    const json = await res.json();
    if (!json.success) return;

    const item     = json.data;
    const existing = state.cart.find(c => c.item.item_id === itemId);
    if (existing) existing.qty++;
    else          state.cart.push({ item, qty: 1 });

    showToast(`${item.name} added!`, 'success', item.emoji);
    renderCartDrawer();
    renderMenu();        // re-render to show qty controls
  } catch {
    showToast('Failed to add item', 'error', '❌');
  }
}

function changeQty(itemId, delta) {
  const idx = state.cart.findIndex(c => c.item.item_id === itemId);
  if (idx === -1) return;

  state.cart[idx].qty += delta;
  if (state.cart[idx].qty <= 0) {
    showToast(`${state.cart[idx].item.name} removed`, 'error', '🗑️');
    state.cart.splice(idx, 1);
  }
  renderCartDrawer();
  renderMenu();
}

function removeFromCart(itemId) {
  const idx = state.cart.findIndex(c => c.item.item_id === itemId);
  if (idx !== -1) {
    showToast(`${state.cart[idx].item.name} removed`, 'error', '🗑️');
    state.cart.splice(idx, 1);
    renderCartDrawer();
    renderMenu();
  }
}

function clearCart() {
  if (!state.cart.length) return;
  state.cart = [];
  showToast('Cart cleared', 'error', '🗑️');
  renderCartDrawer();
  renderMenu();
}

/* ── Cart Drawer ─────────────────────────────────────────────── */
function renderCartDrawer() {
  const subtotal  = state.cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const tax       = subtotal * 0.05;
  const delivery  = subtotal > 0 ? 2.0 : 0;
  const grand     = subtotal + tax + delivery;
  const count     = state.cart.reduce((s, c) => s + c.qty, 0);

  cartCountEl.textContent = count;

  if (!state.cart.length) {
    cartItemsList.innerHTML  = '';
    cartEmpty.style.display  = 'flex';
    drawerFooter.style.display = 'none';
    return;
  }

  cartEmpty.style.display    = 'none';
  drawerFooter.style.display = 'flex';

  cartItemsList.innerHTML = state.cart.map(({ item, qty }) => `
    <div class="cart-item">
      <span class="ci-emoji">${item.emoji}</span>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price)} × ${qty} = ${fmt(item.price * qty)}</div>
      </div>
      <div class="ci-qty">
        <button class="qty-btn" onclick="changeQty(${item.item_id}, -1)">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.item_id},  1)">+</button>
      </div>
      <button class="ci-remove" onclick="removeFromCart(${item.item_id})">✕</button>
    </div>`).join('');

  document.getElementById('billSubtotal').textContent = fmt(subtotal);
  document.getElementById('billTax').textContent      = fmt(tax);
  document.getElementById('billDelivery').textContent = fmt(delivery);
  document.getElementById('billTotal').textContent    = fmt(grand);
}

function openCart()  { cartDrawer.classList.add('open'); cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeCart() { cartDrawer.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }

/* ── Place Order (calls POST /api/orders) ───────────────────── */
async function placeOrder() {
  if (!state.cart.length) return;

  const customerName  = prompt('Enter your name for the order:')?.trim();
  if (!customerName) return;

  const tableNumber   = parseInt(prompt('Enter your table number:', '1')) || 1;

  const orderBtn = document.getElementById('orderBtn');
  orderBtn.disabled    = true;
  orderBtn.textContent = '⏳ Placing order…';

  try {
    const result = await postOrder(
      customerName,
      tableNumber,
      state.cart.map(c => ({ item_id: c.item.item_id, quantity: c.qty }))
    );

    if (result.success) {
      orderIdBadge.textContent = `Order ID: #${result.data.order_id} — ${customerName}`;
      state.cart = [];
      closeCart();
      renderCartDrawer();
      renderMenu();
      modalOverlay.classList.add('open');
    } else {
      showToast(result.error || 'Order failed', 'error', '❌');
    }
  } catch (err) {
    showToast('Server error — is the backend running?', 'error', '❌');
  } finally {
    orderBtn.disabled    = false;
    orderBtn.textContent = '✅ Place Order';
  }
}

function closeModal() { modalOverlay.classList.remove('open'); }

/* ── Search & Filter Events ─────────────────────────────────── */
let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.search = searchInput.value.trim();
    renderMenu();
  }, 300);   // 300ms debounce — avoids hitting API on every keystroke
});

vegToggle.addEventListener('change', () => {
  state.vegOnly = vegToggle.checked;
  renderMenu();
});

/* ── Init ────────────────────────────────────────────────────── */
async function init() {
  // Load all items once to get total count for sidebar
  state.allItems = await fetchMenu();
  await renderCategories();
  await renderMenu();
  renderCartDrawer();
}

document.addEventListener('DOMContentLoaded', init);
