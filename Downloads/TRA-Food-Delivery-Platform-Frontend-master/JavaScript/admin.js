document.addEventListener("DOMContentLoaded", () => {
  loadDailySummary();
  loadCancellationRate();
  loadBusiestHours();
  loadTopLoyalty();
  loadDriverLeaderboard();
});

function showPanelError(panelEl, message) {
  panelEl.innerHTML = `<div class="error-banner">${message}</div>`;
}

async function loadDailySummary() {
  const ordersEl = document.querySelector(".metric-card--orders .metric-number");
  const revenueEl = document.querySelector(".metric-card--revenue .metric-number");
  const avgEl = document.querySelector(".metric-card--avg .metric-number");
  try {
    const summary = await getData("/reports/platform/daily-summary");
    const orders = summary.totalDeliveredOrders || 0;
    const fees = summary.totalDeliveryFeesCollected || 0;
    ordersEl.textContent = orders;
    revenueEl.textContent = fees.toFixed(1); 
    avgEl.textContent = orders > 0 ? (fees / orders).toFixed(2) : "—";
  } catch (e) {
    ordersEl.textContent = "—";
    revenueEl.textContent = "—";
    avgEl.textContent = "—";
  }
}

async function loadCancellationRate() {
  const cancelEl = document.querySelector(".metric-card--cancel .metric-number");
  try {
    const data = await getData("/reports/orders/cancellation-rate");
    cancelEl.textContent = (data.cancellationRate * 100).toFixed(1) + "%";
  } catch (e) {
    cancelEl.textContent = "—";
  }
}

function formatHour(hour) {
  const h = Number(hour);
  const period = h >= 12 ? "p" : "a";
  const display = h % 12 === 0 ? 12 : h % 12;
  return display + period;
}

async function loadBusiestHours() {
  const container = document.querySelector(".bar-chart-container");
  try {
    const rows = await getData("/reports/platform/busiest-hours");
    if (!rows.length) {
      container.innerHTML = `<div class="empty-state">No order data yet</div>`;
      return;
    }
    const max = Math.max(...rows.map((r) => r.orderCount));
    container.innerHTML = "";
    rows.forEach((row) => {
      const col = document.createElement("div");
      col.className = "bar-column";
      const heightPct = max > 0 ? (row.orderCount / max) * 100 : 0;
      col.innerHTML = `
        <div class="bar-fill" style="height:${heightPct}%;"></div>
        <span class="bar-label">${formatHour(row.hour)}</span>`;
      container.appendChild(col);
    });
  } catch (e) {
    showPanelError(container.closest(".admin-panel"), "Couldn't load busiest hours.");
  }
}

async function loadTopLoyalty() {
  const list = document.querySelector(".loyalty-list");
  try {
    const customers = await getData("/reports/customers/top-loyalty?limit=5");
    if (!customers.length) {
      list.innerHTML = `<div class="empty-state">No customers yet</div>`;
      return;
    }
    list.innerHTML = "";
    customers.forEach((c, i) => {
      const li = document.createElement("li");
      li.className = "loyalty-row";
      li.innerHTML = `
        <div class="customer-info">
          <span class="rank-badge">${i + 1}</span>
          <span class="customer-name">${c.firstName} ${c.lastName}</span>
        </div>
        <span class="loyalty-points">${c.loyaltyPoints} <span class="pts-lbl">pts</span></span>`;
      list.appendChild(li);
    });
  } catch (e) {
    showPanelError(list.closest(".admin-panel"), "Couldn't load top customers.");
  }
}

async function loadDriverLeaderboard() {
  const tbody = document.querySelector(".leaderboard-table tbody");
  try {
    const drivers = await getData("/reports/drivers/leaderboard?limit=5");
    if (!drivers.length) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-state">No drivers yet</td></tr>`;
      return;
    }
    tbody.innerHTML = "";
    drivers.forEach((d) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="driver-name-cell">${d.firstName} ${d.lastName}</td>
        <td>${d.completedDeliveries ?? "—"}</td>
        <td class="rating-cell">${d.averageRating ? "★ " + d.averageRating : "—"}</td>`;
      tbody.appendChild(tr);
    });
  } catch (e) {
    showPanelError(tbody.closest(".admin-panel"), "Couldn't load driver leaderboard.");
  }
}