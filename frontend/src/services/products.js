import api from './api';

export const fetchProducts = (params = {}) => api.get('/products/', { params });
export const fetchProduct = (slug) => api.get(`/products/${slug}/`);
export const fetchCategories = () => api.get('/categories/');

export const searchProductSuggestions = (query) => {
  return api.get('/products/', {
    params: {
      search: query,
    },
  });
};