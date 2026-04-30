import axios from 'axios';
import { API_BASE_URL } from './types';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const collegeAPI = {
  getColleges: (params?: any) => api.get('/colleges', { params }),
  getCollegeById: (id: string) => api.get(`/colleges/${id}`),
  addReview: (collegeId: string, data: any) => api.post(`/colleges/${collegeId}/reviews`, data),
};

export const comparisonAPI = {
  create: (data: any) => api.post('/comparisons', data),
  get: (id: string) => api.get(`/comparisons/${id}`),
  delete: (id: string) => api.delete(`/comparisons/${id}`),
};

export const predictorAPI = {
  predict: (data: any) => api.post('/predictor/predict', data),
};
