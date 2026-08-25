import api from './api';

// export const createProduct = (data) => api.post('/products/', data);

export const createProduct = (data) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('stock_quantity', data.stock_quantity);
  formData.append('category_id', data.category_id);
  formData.append('description', data.description);
  formData.append('is_active', data.is_active);

  if (data.image) {
    formData.append('image', data.image);
  }
  return api.post('/products/', formData);
};

// export const updateProduct = (id, data) => api.patch(`/products/${id}/`, data);

export const updateProduct = (slug, data) => {
  const formData = new FormData();

  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('stock_quantity', data.stock_quantity);
  formData.append('category_id', data.category_id);
  formData.append('description', data.description);
  formData.append('is_active', data.is_active);

  if (data.image) {
    formData.append('image', data.image);
  }
  return api.patch(`/products/${slug}/`, formData);
};

export const deleteProduct = (id) => api.delete(`/products/${id}/`);

export const fetchAllOrders = (params = {}) => api.get('/orders/admin/', { params });
export const updateOrderStatus = (orderId, status) =>
  api.patch(`/orders/admin/${orderId}/status/`, { status });

export const fetchAllPayments = (params = {}) => api.get('/payments/admin/', { params });