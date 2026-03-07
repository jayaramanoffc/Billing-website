/**
 * Monthly sales report: aggregate orders by month, table + simple bar chart.
 */
const Report = {
  init() {
    this.reportBody = document.getElementById('reportBody');
    this.chartBars = document.getElementById('chartBars');
    this.reportEmpty = document.getElementById('reportEmpty');
    this.render();
  },

  getOrdersByMonth() {
    const orders = Storage.getOrders();
    const byMonth = {};
    orders.forEach(order => {
      const date = order.date || order.id;
      const monthKey = date.toString().slice(0, 7);
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = { count: 0, total: 0 };
      }
      byMonth[monthKey].count += 1;
      byMonth[monthKey].total += order.total || 0;
    });
    return byMonth;
  },

  monthLabel(monthKey) {
    const [y, m] = monthKey.split('-');
    const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  },

  render() {
    const byMonth = this.getOrdersByMonth();
    const keys = Object.keys(byMonth).sort().reverse();
    const maxTotal = keys.length ? Math.max(...keys.map(k => byMonth[k].total)) : 1;

    this.reportBody.innerHTML = keys.map(monthKey => {
      const { count, total } = byMonth[monthKey];
      const label = this.monthLabel(monthKey);
      return `
        <tr>
          <td data-label="Month">${label}</td>
          <td data-label="Orders">${count}</td>
          <td data-label="Total sales (Rs.)">${total}</td>
        </tr>
      `;
    }).join('');

    const barMaxHeight = 100;
    this.chartBars.innerHTML = keys.slice(0, 12).map(monthKey => {
      const { total } = byMonth[monthKey];
      const pct = maxTotal > 0 ? total / maxTotal : 0;
      const heightPx = pct > 0 ? Math.max(8, pct * barMaxHeight) : 0;
      return `
        <div class="chart-bar-wrap">
          <div class="chart-bar" style="height: ${heightPx}px;"></div>
          <span class="chart-bar-label">${this.monthLabel(monthKey).slice(0, 3)}</span>
        </div>
      `;
    }).join('');

    if (keys.length === 0) {
      this.reportEmpty.style.display = 'block';
      this.chartBars.style.display = 'none';
    } else {
      this.reportEmpty.style.display = 'none';
      this.chartBars.style.display = 'flex';
    }
  }
};
