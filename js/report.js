/**
 * Monthly sales report: aggregate orders by month, table + simple bar chart.
 */
const Report = {
  init() {
    this.reportBody = document.getElementById('reportBody');
    this.chartBars = document.getElementById('chartBars');
    this.reportEmpty = document.getElementById('reportEmpty');
    this.monthSelect = document.getElementById('monthSelect');
    this.btnDownloadMonth = document.getElementById('btnDownloadMonth');
    this.detailsWrap = document.getElementById('reportDetails');
    this.dailyBody = document.getElementById('dailyBody');
    this.detailsTitle = document.getElementById('detailsTitle');
    this.detailsOverall = document.getElementById('detailsOverall');
    this.render();

    if (this.monthSelect) {
      const latestMonth = this.getLatestMonthKey();
      if (latestMonth) this.monthSelect.value = latestMonth;
      this.monthSelect.addEventListener('change', () => this.renderMonthDetails());
    }
    if (this.btnDownloadMonth) {
      this.btnDownloadMonth.addEventListener('click', () => this.downloadSelectedMonthCsv());
    }
    this.renderMonthDetails();
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
  ,

  getLatestMonthKey() {
    const byMonth = this.getOrdersByMonth();
    const keys = Object.keys(byMonth).sort();
    return keys.length ? keys[keys.length - 1] : '';
  },

  getOrdersForMonth(monthKey) {
    const orders = Storage.getOrders();
    return orders.filter(o => (o.date || '').slice(0, 7) === monthKey);
  },

  aggregateMonthByDay(monthKey) {
    const orders = this.getOrdersForMonth(monthKey);
    const days = {};
    let overallTotal = 0;
    let overallOrders = 0;

    orders.forEach(order => {
      const iso = order.date || '';
      const dayKey = iso ? iso.slice(0, 10) : 'unknown';
      if (!days[dayKey]) days[dayKey] = { total: 0, items: {} };
      const day = days[dayKey];
      overallOrders += 1;
      const orderTotal = order.total || 0;
      overallTotal += orderTotal;
      day.total += orderTotal;

      (order.items || []).forEach(it => {
        const key = it.name || it.menuId || 'Item';
        if (!day.items[key]) day.items[key] = { qty: 0, sales: 0 };
        day.items[key].qty += (it.qty || 0);
        day.items[key].sales += (it.qty || 0) * (it.price || 0);
      });
    });

    const dayKeys = Object.keys(days).sort().reverse();
    return { monthKey, overallTotal, overallOrders, dayKeys, days };
  },

  renderMonthDetails() {
    if (!this.detailsWrap || !this.dailyBody || !this.monthSelect) return;
    const monthKey = this.monthSelect.value;
    if (!monthKey) {
      this.detailsWrap.style.display = 'none';
      return;
    }
    const agg = this.aggregateMonthByDay(monthKey);
    if (!agg.dayKeys.length) {
      this.detailsWrap.style.display = 'none';
      return;
    }
    this.detailsWrap.style.display = 'block';
    if (this.detailsTitle) this.detailsTitle.textContent = `Month details — ${this.monthLabel(monthKey)}`;
    if (this.detailsOverall) this.detailsOverall.textContent = `Overall sales: Rs. ${agg.overallTotal} • Orders: ${agg.overallOrders}`;

    this.dailyBody.innerHTML = agg.dayKeys.map(dayKey => {
      const day = agg.days[dayKey];
      const itemsStr = Object.keys(day.items).sort().map(name => {
        const it = day.items[name];
        return `${name} (x${it.qty})`;
      }).join(', ');
      const dateLabel = (dayKey === 'unknown') ? 'Unknown date' : new Date(dayKey).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      return `
        <tr>
          <td data-label="Date">${dateLabel}</td>
          <td data-label="Items bought">${itemsStr || '-'}</td>
          <td data-label="Day sales (Rs.)">${day.total}</td>
        </tr>
      `;
    }).join('');
  },

  downloadSelectedMonthCsv() {
    if (!this.monthSelect) return;
    const monthKey = this.monthSelect.value;
    if (!monthKey) return;
    const agg = this.aggregateMonthByDay(monthKey);
    const lines = [];
    lines.push(['Month', monthKey].join(','));
    lines.push(['Overall sales (Rs.)', String(agg.overallTotal)].join(','));
    lines.push(['Orders', String(agg.overallOrders)].join(','));
    lines.push('');
    lines.push(['Date', 'Item', 'Qty', 'Item sales (Rs.)', 'Day sales (Rs.)'].join(','));

    agg.dayKeys.slice().sort().forEach(dayKey => {
      const day = agg.days[dayKey];
      const itemNames = Object.keys(day.items).sort();
      if (itemNames.length === 0) {
        lines.push([dayKey, '', '0', '0', String(day.total)].join(','));
        return;
      }
      itemNames.forEach((name, idx) => {
        const it = day.items[name];
        const row = [
          this.csvCell(dayKey),
          this.csvCell(name),
          String(it.qty),
          String(it.sales),
          (idx === 0) ? String(day.total) : ''
        ];
        lines.push(row.join(','));
      });
    });

    const csv = lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sales-${monthKey}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  },

  csvCell(value) {
    const s = String(value == null ? '' : value);
    if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }
};
