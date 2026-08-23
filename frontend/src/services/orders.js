import api from './api';

// Checkout fetch
export const checkout = (shippingAddress) =>
  api.post('/orders/checkout/', { shipping_address: shippingAddress });

// Buy now fetch
export const buyNow = (productId, quantity, shippingAddress) =>
  api.post('/orders/checkout/', {
    product_id: productId,
    quantity,
    shipping_address: shippingAddress,
  });

// Fetch payments
export const fetchPaymentStatus = (orderId) =>
  api.get(`/payments/status/${orderId}/`);

// Fetch orders
export const fetchOrders = () => api.get('/orders/');

// Fetch order items
export const fetchOrder = (orderId) => api.get(`/orders/${orderId}/`);