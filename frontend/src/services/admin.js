import api from './api';

export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.patch(`/products/${id}/`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}/`);

export const fetchAllOrders = (params = {}) => api.get('/orders/admin/', { params });
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/orders/admin/${orderId}/status/`, { status });

export const fetchAllPayments = (params = {}) => api.get('/payments/admin/', { params });