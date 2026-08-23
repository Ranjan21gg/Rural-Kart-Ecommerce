import api from './api';

export const verifyPayment = (data) => {
    return api.post('/payments/verify/', data);
};

export const retryPayment = (orderId) => {
  return api.post(`/payments/retry/${orderId}/`);
};