/**
 * Billing page: menu grid, cart, Pay now (QR), Print, Clear cart.
 */
const Billing = {
  qrModal: null,
  qrContainer: null,
  qrInstance: null,

  init() {
    this.qrModal = document.getElementById('qrModal');
    this.qrContainer = document.getElementById('qrContainer');
    this.renderMenu();
    this.renderCart();
    document.getElementById('btnPay').addEventListener('click', () => this.showPayModal());
    document.getElementById('btnPrint').addEventListener('click', () => this.printBill());
    document.getElementById('btnClear').addEventListener('click', () => this.clearCart());
    document.getElementById('btnDone').addEventListener('click', () => this.closePayModal());
  },

  renderMenu() {
    const grid = document.getElementById('menuGrid');
    const menu = Storage.getMenu();
    grid.innerHTML = menu.map(item => {
      const fallback = (typeof window !== 'undefined' && window.dataUriSvg) ? window.dataUriSvg(item.name) : '';
      const url = item.imageUrl || '';
      const src = url || fallback;
      return `
      <div class="menu-card" data-id="${item.id}" role="button" tabindex="0">
        <div class="card-img-wrap">
          <img src="${src}" alt="${item.name}" data-fallback="${fallback}" onerror="this.onerror=null;this.src=this.dataset.fallback">
          <div class="card-overlay">
            <span class="card-name">${item.name}</span>
            <span class="card-price">Rs. ${item.price}</span>
          </div>
        </div>
      </div>
    `;
    }).join('');
    grid.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const item = menu.find(m => m.id === id);
        if (item) this.addToCart(item);
      });
    });
  },

  addToCart(menuItem) {
    const cart = Storage.getCart();
    const existing = cart.find(c => c.menuId === menuItem.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        menuId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        qty: 1
      });
    }
    Storage.setCart(cart);
    this.renderCart();
  },

  removeFromCart(menuId) {
    let cart = Storage.getCart().filter(c => c.menuId !== menuId);
    Storage.setCart(cart);
    this.renderCart();
  },

  renderCart() {
    const cart = Storage.getCart();
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const totalAmountEl = document.getElementById('totalAmount');
    const btnPay = document.getElementById('btnPay');

    if (cart.length === 0) {
      container.innerHTML = '<div class="cart-empty">Cart is empty. Click a menu item to add.</div>';
      totalEl.style.display = 'none';
      btnPay.disabled = true;
      return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      return `
        <div class="cart-item" data-id="${item.menuId}">
          <span class="name">${item.name}</span>
          <span class="qty">× ${item.qty}</span>
          <span class="line-total">Rs. ${lineTotal}</span>
          <button type="button" class="btn-remove" aria-label="Remove">×</button>
        </div>
      `;
    }).join('');
    totalAmountEl.textContent = total;
    totalEl.style.display = 'flex';
    btnPay.disabled = false;

    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.cart-item');
        if (item) this.removeFromCart(item.dataset.id);
      });
    });
  },

  getCartTotal() {
    return Storage.getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  showPayModal() {
    const cart = Storage.getCart();
    if (cart.length === 0) return;
    const total = this.getCartTotal();
    const text = `Pay Rs. ${total} - Restaurant`;
    document.getElementById('qrMessage').textContent = `Total: Rs. ${total}`;
    this.qrContainer.innerHTML = '';
    this.qrInstance = new QRCode(this.qrContainer, { text: text, width: 180, height: 180 });
    this.qrModal.style.display = 'flex';
    this.qrModal.setAttribute('aria-hidden', 'false');
  },

  closePayModal() {
    const cart = Storage.getCart();
    if (cart.length > 0) {
      const order = {
        id: 'ord_' + Date.now(),
        date: new Date().toISOString(),
        items: [...cart],
        total: this.getCartTotal()
      };
      Storage.addOrder(order);
      Storage.setCart([]);
      this.renderCart();
    }
    this.qrModal.style.display = 'none';
    this.qrModal.setAttribute('aria-hidden', 'true');
  },

  printBill() {
    const cart = Storage.getCart();
    if (cart.length === 0) return;
    const total = this.getCartTotal();
    const rows = cart.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price}</td>
        <td>${item.qty * item.price}</td>
      </tr>
    `).join('');
    document.getElementById('printReceipt').innerHTML = `
      <div class="print-receipt">
        <div class="receipt-title">Restaurant</div>
        <div class="receipt-date">${new Date().toLocaleString()}</div>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="receipt-total">Total: Rs. ${total}</div>
      </div>
    `;
    window.print();
  },

  clearCart() {
    Storage.setCart([]);
    this.renderCart();
  }
};
