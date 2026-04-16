import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);

// Prediction
export const predict = (data) => api.post('/api/predict', data);
export const analyzeImage = (formData) => api.post('/api/analyze-image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Unified Assessment
export const unifiedAssessment = (formData) => api.post('/api/unified-assessment', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Assessment History
export const getAssessments = () => api.get('/api/assessments');
export const getChildAssessments = (childId) => api.get(`/api/assessments/child/${childId}`);
export const getAssessmentDetails = (recordId) => api.get(`/api/assessments/${recordId}`);

// Dashboard
export const getDashboardData = () => api.get('/api/dashboard-data');
export const getStats = () => api.get('/api/stats');
export const getRecords = () => api.get('/api/records');

// Interventions
export const createIntervention = (data) => api.post('/api/interventions', data);
export const getInterventions = (childRecordId) => api.get(`/api/interventions/${childRecordId}`);
export const createFollowUp = (data) => api.post('/api/follow-ups', data);
export const getFollowUps = (childRecordId) => api.get(`/api/follow-ups/${childRecordId}`);

export default api;
