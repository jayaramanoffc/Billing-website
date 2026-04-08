/**
 * Central localStorage helpers for menu, cart, and orders.
 */
const Storage = {
  keys: {
    menu: 'restaurant_menu',
    cart: 'restaurant_cart',
    orders: 'restaurant_orders',
    reviews: 'restaurant_reviews'
  },

  getMenu() {
    try {
      const data = localStorage.getItem(this.keys.menu);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setMenu(menu) {
    localStorage.setItem(this.keys.menu, JSON.stringify(menu));
  },

  getCart() {
    try {
      const data = localStorage.getItem(this.keys.cart);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(cart) {
    localStorage.setItem(this.keys.cart, JSON.stringify(cart));
  },

  getOrders() {
    try {
      const data = localStorage.getItem(this.keys.orders);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addOrder(order) {
    const orders = this.getOrders();
    orders.push(order);
    localStorage.setItem(this.keys.orders, JSON.stringify(orders));
  },

  getReviews() {
    try {
      const data = localStorage.getItem(this.keys.reviews);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addReview(review) {
    const reviews = this.getReviews();
    reviews.push(review);
    localStorage.setItem(this.keys.reviews, JSON.stringify(reviews));
  },

  getAverageRatings() {
    const reviews = this.getReviews();
    const sums = {};
    reviews.forEach(r => {
      const list = r.items || [];
      list.forEach(it => {
        if (!it.menuId || typeof it.rating !== 'number') return;
        if (!sums[it.menuId]) sums[it.menuId] = { sum: 0, count: 0 };
        sums[it.menuId].sum += it.rating;
        sums[it.menuId].count += 1;
      });
    });
    const averages = {};
    Object.keys(sums).forEach(id => {
      const s = sums[id];
      averages[id] = s.count ? (s.sum / s.count) : 0;
    });
    return averages;
  }
};
