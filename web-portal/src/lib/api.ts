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
  role: 'SUPERADMIN' | 'ADMIN';
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
  userRoleMaps?: Array<{
    role: {
      roleName: string;
    };
  }>;
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

  register: async (userData: any): Promise<any> => {
    const response = await apiClient.post('/user/register', userData);
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

// QC API
export const qcApi = {
  createQC: async (data: any): Promise<any> => {
    const response = await apiClient.post('/qc/create', data);
    return response.data;
  },

  updateQC: async (qcRecordId: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/qc/${qcRecordId}`, data);
    return response.data;
  },

  getPendingSurveys: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/qc/pending', { params });
    return response.data;
  },

  getQCStats: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/qc/stats', { params });
    return response.data;
  },

  bulkApprove: async (data: any): Promise<any> => {
    const response = await apiClient.post('/qc/bulk-approve', data);
    return response.data;
  },

  bulkReject: async (data: any): Promise<any> => {
    const response = await apiClient.post('/qc/bulk-reject', data);
    return response.data;
  },

  getQCBySurvey: async (surveyUniqueCode: string): Promise<any> => {
    const response = await apiClient.get(`/qc/survey/${surveyUniqueCode}`);
    return response.data;
  },

  getQCByUser: async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/qc/user/${userId}`);
    return response.data;
  },
};

// Survey API
export const surveyApi = {
  getAllSurveys: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/surveys', { params });
    return response.data;
  },

  getSurveyById: async (surveyUniqueCode: string): Promise<any> => {
    const response = await apiClient.get(`/surveys/${surveyUniqueCode}`);
    return response.data;
  },

  syncSurvey: async (surveyUniqueCode: string): Promise<any> => {
    const response = await apiClient.post(`/surveys/${surveyUniqueCode}/sync`);
    return response.data;
  },

  bulkSync: async (data: any): Promise<any> => {
    const response = await apiClient.post('/surveys/bulk-sync', data);
    return response.data;
  },

  getSurveyStats: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/surveys/stats', { params });
    return response.data;
  },

  getSurveysByWard: async (wardId: string): Promise<any> => {
    const response = await apiClient.get(`/surveys/ward/${wardId}`);
    return response.data;
  },

  getSurveysByUser: async (userId: string): Promise<any> => {
    const response = await apiClient.get(`/surveys/user/${userId}`);
    return response.data;
  },

  getSurveysByStatus: async (status: string): Promise<any> => {
    const response = await apiClient.get(`/surveys/status/${status}`);
    return response.data;
  },

  searchSurveys: async (params: any): Promise<any> => {
    const response = await apiClient.get('/surveys/search', { params });
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  getDashboardStats: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/reports/dashboard', { params });
    return response.data;
  },

  getSurveyAnalytics: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/reports/survey-analytics', { params });
    return response.data;
  },

  getUserAnalytics: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/reports/user-analytics', { params });
    return response.data;
  },

  getWardAnalytics: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/reports/ward-analytics', { params });
    return response.data;
  },

  getQCAnalytics: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/reports/qc-analytics', { params });
    return response.data;
  },

  exportReport: async (format: string, params?: any): Promise<any> => {
    const response = await apiClient.get(`/reports/export/${format}`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  getSystemHealth: async (): Promise<any> => {
    const response = await apiClient.get('/reports/system-health');
    return response.data;
  },
};

// Master Data API
export const masterDataApi = {
  // ULB Master Data
  getAllUlbs: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/ulbs');
    return response.data;
  },

  getUlbById: async (ulbId: string): Promise<any> => {
    const response = await apiClient.get(`/master-data/ulbs/${ulbId}`);
    return response.data;
  },

  // Zone Master Data
  getAllZones: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/zones');
    return response.data;
  },

  getZonesByUlb: async (ulbId: string): Promise<any> => {
    const response = await apiClient.get(`/master-data/ulbs/${ulbId}/zones`);
    return response.data;
  },

  // Ward Master Data
  getAllWards: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/wards');
    return response.data;
  },

  getAllWardsWithStatus: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/wards/with-status');
    return response.data;
  },

  getWardsByZone: async (zoneId: string): Promise<any> => {
    const response = await apiClient.get(`/master-data/zones/${zoneId}/wards`);
    return response.data;
  },

  updateWardStatus: async (wardId: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/master-data/wards/${wardId}/status`, data);
    return response.data;
  },

  // Mohalla Master Data
  getAllMohallas: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/mohallas');
    return response.data;
  },

  getMohallasByWard: async (wardId: string): Promise<any> => {
    const response = await apiClient.get(`/master-data/wards/${wardId}/mohallas`);
    return response.data;
  },

  // Ward Status Master Data
  getAllWardStatuses: async (): Promise<any> => {
    const response = await apiClient.get('/master-data/ward-statuses');
    return response.data;
  },
};

export default apiClient; 