/**
 * Central localStorage helpers for menu, cart, and orders.
 */
const Storage = {
  keys: {
    menu: 'restaurant_menu',
    cart: 'restaurant_cart',
    orders: 'restaurant_orders'
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
  }
};
