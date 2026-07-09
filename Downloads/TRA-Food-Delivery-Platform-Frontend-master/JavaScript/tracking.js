let pollTimer = null;

function startTracking(orderId) {
  pollTimer = setInterval(async () => {
    try {
      const order = await api(`/orders/${orderId}`);
      renderTimeline(order.status);
      if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
        clearInterval(pollTimer);
      }
    } catch (e) {
      renderError(e.message);
    }
  }, 5000);
}