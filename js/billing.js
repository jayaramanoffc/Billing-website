/**
 * Billing page: menu grid, cart, Pay now (QR), Print, Clear cart.
 */
const Billing = {
  qrModal: null,
  qrContainer: null,
  qrInstance: null,
  reviewModal: null,
  confirmModal: null,
  confirmQty: 1,
  pendingItem: null,
  menuCache: [],

  init() {
    this.qrModal = document.getElementById('qrModal');
    this.qrContainer = document.getElementById('qrContainer');
    this.reviewModal = document.getElementById('reviewModal');
    this.confirmModal = document.getElementById('addConfirmModal');
    this.renderMenu();
    this.renderCart();
    document.getElementById('btnPay').addEventListener('click', () => this.showPayModal());
    document.getElementById('btnPrint').addEventListener('click', () => this.printBill());
    document.getElementById('btnClear').addEventListener('click', () => this.clearCart());
    document.getElementById('btnDone').addEventListener('click', () => this.closePayModal());
    const btnReviewSkip = document.getElementById('btnReviewSkip');
    const btnReviewSubmit = document.getElementById('btnReviewSubmit');
    if (btnReviewSkip) btnReviewSkip.addEventListener('click', () => this.closeReviewModal());
    if (btnReviewSubmit) btnReviewSubmit.addEventListener('click', () => this.submitReview());

    const btnCancel = document.getElementById('btnConfirmCancel');
    const btnAdd = document.getElementById('btnConfirmAdd');
    const btnMinus = document.getElementById('btnQtyMinus');
    const btnPlus = document.getElementById('btnQtyPlus');
    if (btnCancel) btnCancel.addEventListener('click', () => this.closeConfirmModal());
    if (btnAdd) btnAdd.addEventListener('click', () => this.confirmAddToCart());
    if (btnMinus) btnMinus.addEventListener('click', () => this.changeConfirmQty(-1));
    if (btnPlus) btnPlus.addEventListener('click', () => this.changeConfirmQty(1));
    if (this.confirmModal) {
      this.confirmModal.addEventListener('click', (e) => {
        if (e.target === this.confirmModal) this.closeConfirmModal();
      });
    }
  },

  renderMenu() {
    const grid = document.getElementById('menuGrid');
    const menu = Storage.getMenu();
    const avgRatings = Storage.getAverageRatings();
    this.menuCache = menu;
    grid.innerHTML = menu.map(item => {
      const fallback = (typeof window !== 'undefined' && window.dataUriSvg) ? window.dataUriSvg(item.name) : '';
      const url = item.imageUrl || '';
      const src = url || fallback;
      const rating = avgRatings[item.id] || 0;
      const rounded = rating ? Math.round(rating * 10) / 10 : 0;
      const stars = rating ? '★'.repeat(Math.round(rating)) : '';
      const ratingLabel = rating ? `${rounded} / 5` : 'No ratings yet';
      return `
      <div class="menu-card" data-id="${item.id}" role="button" tabindex="0">
        <div class="card-img-wrap">
          <img src="${src}" alt="${item.name}" data-fallback="${fallback}" onerror="this.onerror=null;this.src=this.dataset.fallback">
          <div class="card-overlay">
            <span class="card-name">${item.name}</span>
            <span class="card-price">Rs. ${item.price}</span>
            <span class="card-rating">${stars}<span class="card-rating-text">${ratingLabel}</span></span>
          </div>
        </div>
      </div>
    `;
    }).join('');
    grid.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const item = menu.find(m => m.id === id);
        if (item) this.openConfirmModal(item);
      });
    });
  },

  openConfirmModal(menuItem) {
    if (!this.confirmModal) {
      this.addToCart(menuItem);
      return;
    }
    const fallback = (typeof window !== 'undefined' && window.dataUriSvg) ? window.dataUriSvg(menuItem.name) : '';
    const src = menuItem.imageUrl || fallback;
    this.pendingItem = menuItem;
    this.confirmQty = 1;
    const nameEl = document.getElementById('confirmName');
    const priceEl = document.getElementById('confirmPrice');
    const qtyEl = document.getElementById('confirmQty');
    const imgEl = document.getElementById('confirmImg');
    if (nameEl) nameEl.textContent = menuItem.name;
    if (priceEl) priceEl.textContent = `Rs. ${menuItem.price}`;
    if (qtyEl) qtyEl.textContent = String(this.confirmQty);
    if (imgEl) {
      imgEl.src = src;
      imgEl.alt = menuItem.name;
      imgEl.onerror = () => { imgEl.onerror = null; imgEl.src = fallback; };
    }
    this.confirmModal.style.display = 'flex';
    this.confirmModal.setAttribute('aria-hidden', 'false');
  },

  closeConfirmModal() {
    if (!this.confirmModal) return;
    this.pendingItem = null;
    this.confirmQty = 1;
    this.confirmModal.style.display = 'none';
    this.confirmModal.setAttribute('aria-hidden', 'true');
  },

  changeConfirmQty(delta) {
    this.confirmQty = Math.max(1, Math.min(50, (this.confirmQty || 1) + delta));
    const qtyEl = document.getElementById('confirmQty');
    if (qtyEl) qtyEl.textContent = String(this.confirmQty);
  },

  confirmAddToCart() {
    if (!this.pendingItem) return;
    this.addToCart(this.pendingItem, this.confirmQty || 1);
    this.closeConfirmModal();
  },

  addToCart(menuItem, qty = 1) {
    const cart = Storage.getCart();
    const existing = cart.find(c => c.menuId === menuItem.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        menuId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        qty: qty
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
      this.openReviewModal(order);
    }
    this.qrModal.style.display = 'none';
    this.qrModal.setAttribute('aria-hidden', 'true');
  },

  openReviewModal(order) {
    if (!this.reviewModal) return;
    const wrap = document.getElementById('reviewItems');
    if (!wrap) return;
    const uniqueItems = {};
    (order.items || []).forEach(it => {
      if (!it.menuId) return;
      if (!uniqueItems[it.menuId]) uniqueItems[it.menuId] = { name: it.name, qty: 0 };
      uniqueItems[it.menuId].qty += it.qty || 0;
    });
    const ids = Object.keys(uniqueItems);
    if (!ids.length) return;
    wrap.innerHTML = ids.map(id => {
      const it = uniqueItems[id];
      return `
        <div class="review-row" data-id="${id}">
          <span class="review-label">${it.name} (x${it.qty})</span>
          <div class="review-stars" data-value="0">
            <span class="review-star" data-star="1">★</span>
            <span class="review-star" data-star="2">★</span>
            <span class="review-star" data-star="3">★</span>
            <span class="review-star" data-star="4">★</span>
            <span class="review-star" data-star="5">★</span>
          </div>
        </div>
      `;
    }).join('');
    wrap.querySelectorAll('.review-stars').forEach(group => {
      group.querySelectorAll('.review-star').forEach(star => {
        star.addEventListener('click', () => {
          const value = parseInt(star.dataset.star, 10) || 0;
          group.dataset.value = String(value);
          group.querySelectorAll('.review-star').forEach(s => {
            const v = parseInt(s.dataset.star, 10) || 0;
            if (v <= value) {
              s.classList.add('active');
            } else {
              s.classList.remove('active');
            }
          });
        });
      });
    });
    this.reviewModal.style.display = 'flex';
    this.reviewModal.setAttribute('aria-hidden', 'false');
  },

  closeReviewModal() {
    if (!this.reviewModal) return;
    this.reviewModal.style.display = 'none';
    this.reviewModal.setAttribute('aria-hidden', 'true');
  },

  submitReview() {
    const wrap = document.getElementById('reviewItems');
    if (!wrap) {
      this.closeReviewModal();
      return;
    }
    const rows = wrap.querySelectorAll('.review-row');
    const items = [];
    rows.forEach(row => {
      const id = row.dataset.id;
      const stars = row.querySelector('.review-stars');
      if (!id || !stars) return;
      const rating = parseInt(stars.dataset.value || '0', 10) || 0;
      if (rating > 0) {
        items.push({ menuId: id, rating });
      }
    });
    if (items.length) {
      Storage.addReview({
        id: 'rev_' + Date.now(),
        date: new Date().toISOString(),
        items: items
      });
    }
    this.closeReviewModal();
    this.renderMenu();
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
