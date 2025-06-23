import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface LoginRequest {
  username: string;
  password: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'SUPERVISOR' | 'SURVEYOR';
}

export interface LoginResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    role: string;
  };
}

export interface User {
  userId: string;
  username: string;
  name: string | null;
  mobileNumber?: string;
  isActive: boolean;
  role?: string; // Direct role field from backend
  createdAt?: string; // isCreatedAt from backend
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: any): Promise<any> => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user/profile');
    return response.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  changePassword: async (data: any): Promise<any> => {
    const response = await apiClient.put('/user/change-password', data);
    return response.data;
  },

  getUsers: async (params?: any): Promise<{ users: User[]; pagination: any }> => {
    const response = await apiClient.get('/user', { params });
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<User>(`/user/${userId}`);
    return response.data;
  },

  updateUserStatus: async (data: any): Promise<any> => {
    const response = await apiClient.put('/user/status', data);
    return response.data;
  },

  deleteUser: async (data: any): Promise<any> => {
    const response = await apiClient.delete('/user', { data });
    return response.data;
  },

  assignRole: async (data: any): Promise<any> => {
    const response = await apiClient.post('/user/assign-role', data);
    return response.data;
  },

  removeRole: async (data: any): Promise<any> => {
    const response = await apiClient.delete('/user/remove-role', { data });
    return response.data;
  },

  searchUsers: async (params: any): Promise<{ users: User[] }> => {
    const response = await apiClient.get('/user/search', { params });
    return response.data;
  },

  getUserStats: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/user/stats', { params });
    return response.data;
  },

  getRoles: async (): Promise<any> => {
    const response = await apiClient.get('/user/roles');
    return response.data;
  },

  getUsersByRole: async (role: string): Promise<{ users: User[] }> => {
    const response = await apiClient.get(`/user/by-role/${role}`);
    return response.data;
  },

  getActiveUsersCount: async (): Promise<any> => {
    const response = await apiClient.get('/user/count/active');
    return response.data;
  },
};

// Ward API
export const wardApi = {
  assignSurveyor: async (data: any): Promise<any> => {
    const response = await apiClient.post('/ward/assign-surveyor', data);
    return response.data;
  },

  assignSupervisor: async (data: any): Promise<any> => {
    const response = await apiClient.post('/ward/assign-supervisor', data);
    return response.data;
  },

  bulkAssign: async (data: any): Promise<any> => {
    const response = await apiClient.post('/ward/bulk-assign', data);
    return response.data;
  },

  updateAssignment: async (data: any): Promise<any> => {
    const response = await apiClient.put('/ward/update-assignment', data);
    return response.data;
  },

  toggleAccess: async (data: any): Promise<any> => {
    const response = await apiClient.put('/ward/toggle-access', data);
    return response.data;
  },

  assignSupervisorToWard: async (data: any): Promise<any> => {
    const response = await apiClient.post('/ward/assign-supervisor-to-ward', data);
    return response.data;
  },

  removeSupervisorFromWard: async (data: any): Promise<any> => {
    const response = await apiClient.delete('/ward/remove-supervisor-from-ward', { data });
    return response.data;
  },

  updateWardStatus: async (data: any): Promise<any> => {
    const response = await apiClient.put('/ward/update-status', data);
    return response.data;
  },

  getAssignments: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/ward/assignments', { params });
    return response.data;
  },

  getAvailableWards: async (): Promise<any> => {
    const response = await apiClient.get('/ward/available-wards');
    return response.data;
  },

  getAvailableMohallas: async (): Promise<any> => {
    const response = await apiClient.get('/ward/available-mohallas');
    return response.data;
  },

  getWardMohallaMappings: async (): Promise<any> => {
    const response = await apiClient.get('/ward/ward-mohalla-mappings');
    return response.data;
  },

  getSurveyorsByWard: async (wardId: string): Promise<any> => {
    const response = await apiClient.get(`/ward/surveyors/${wardId}`);
    return response.data;
  },

  getSupervisorsByWard: async (wardId: string): Promise<any> => {
    const response = await apiClient.get(`/ward/supervisors/${wardId}`);
    return response.data;
  },
};

// Surveyor API
export const surveyorApi = {
  assignWard: async (data: any): Promise<any> => {
    const response = await apiClient.post('/surveyor/assign-ward', data);
    return response.data;
  },

  toggleLogin: async (data: any): Promise<any> => {
    const response = await apiClient.post('/surveyor/toggle-login', data);
    return response.data;
  },

  getAssignments: async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/surveyor/assignments/${userId}`);
    return response.data;
  },

  removeAssignment: async (data: any): Promise<any> => {
    const response = await apiClient.delete('/surveyor/remove-assignment', { data });
    return response.data;
  },

  getProfile: async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/surveyor/profile/${userId}`);
    return response.data;
  },
};

export default apiClient; 