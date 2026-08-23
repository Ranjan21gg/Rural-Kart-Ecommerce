import api from './api';

export const fetchCart = () => api.get('/orders/cart/');

export const addCartItem = (productId, quantity = 1) =>
  api.post('/orders/cart/items/', { product_id: productId, quantity });

export const updateCartItem = (itemId, quantity) =>
  api.patch(`/orders/cart/items/${itemId}/`, { quantity });

export const removeCartItem = (itemId) =>
  api.delete(`/orders/cart/items/${itemId}/`);