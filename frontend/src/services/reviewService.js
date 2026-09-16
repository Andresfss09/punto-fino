import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },
  getBarberReviews: async (barberId) => {
    const response = await api.get(`/reviews/barber/${barberId}`);
    return response.data;
  }
};
