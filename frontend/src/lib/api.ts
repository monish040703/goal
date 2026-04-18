import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

API.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('goalflow_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('goalflow_token');
      localStorage.removeItem('goalflow_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    API.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  updateTheme: (theme: string) => API.put(`/auth/theme?theme=${theme}`),
};

// Tasks
export const tasksAPI = {
  getAll: () => API.get('/tasks/'),
  create: (data: any) => API.post('/tasks/', data),
  get: (id: number) => API.get(`/tasks/${id}`),
  update: (id: number, data: any) => API.put(`/tasks/${id}`, data),
  delete: (id: number) => API.delete(`/tasks/${id}`),
  addSubtask: (taskId: number, data: { title: string }) =>
    API.post(`/tasks/${taskId}/subtasks`, data),
  updateSubtask: (taskId: number, subtaskId: number, data: any) =>
    API.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data),
  deleteSubtask: (taskId: number, subtaskId: number) =>
    API.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),
};

// Business
export const businessAPI = {
  getAll: () => API.get('/business/'),
  create: (data: any) => API.post('/business/', data),
  get: (id: number) => API.get(`/business/${id}`),
  update: (id: number, data: any) => API.put(`/business/${id}`, data),
  delete: (id: number) => API.delete(`/business/${id}`),
  addGoal: (bizId: number, data: { title: string; description?: string }) =>
    API.post(`/business/${bizId}/goals`, data),
  updateGoal: (bizId: number, goalId: number, data: any) =>
    API.put(`/business/${bizId}/goals/${goalId}`, data),
  deleteGoal: (bizId: number, goalId: number) =>
    API.delete(`/business/${bizId}/goals/${goalId}`),
};

// AI
export const aiAPI = {
  weeklySummary: () => API.post('/ai/weekly-summary'),
  changeTheme: (preference: string) => API.post('/ai/theme', { preference }),
  getThemes: () => API.get('/ai/themes'),
};

export default API;
