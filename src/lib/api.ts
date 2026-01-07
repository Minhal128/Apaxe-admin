import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      // Only redirect if not already on connection-test or signin
      if (!window.location.pathname.includes('/connection-test') &&
        !window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTHENTICATION ============

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  logout: () =>
    api.post('/auth/logout'),

  getProfile: () =>
    api.get('/auth/profile'),
};

// ============ DASHBOARD & MARKET DATA ============

export const dashboardApi = {
  healthCheck: () =>
    api.get('/health'),

  getDashboard: () =>
    api.get('/superadmin/dashboard'),

  getMarketData: (params?: {
    segment?: string;
    search?: string;
    limit?: number;
    page?: number;
  }) =>
    api.get('/superadmin/market-watch/NSE', { params }),

  // Get real-time market data from Redis
  getMarketWatch: (segment: string, params?: {
    search?: string;
    limit?: number;
    page?: number;
  }) =>
    api.get(`/superadmin/market-watch/${segment}`, { params }),

  // Get trading summary
  getTradingSummary: (params?: {
    segment?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    api.get('/superadmin/summary', { params }),

  // Get exposure summary
  getExposureSummary: (params?: {
    segment?: string;
    userId?: string;
  }) =>
    api.get('/superadmin/exposure', { params }),
};

// ============ USER MANAGEMENT ============

export const userApi = {
  getUsers: (params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/users', { params }),

  createUser: (userData: {
    username: string;
    email: string;
    password: string;
    role: string;
    balance?: number;
  }) =>
    api.post('/superadmin/users', userData),

  updateUser: (id: string, updateData: {
    username?: string;
    email?: string;
    status?: string;
    role?: string;
  }) =>
    api.put(`/superadmin/users/${id}`, updateData),

  adjustBalance: (id: string, data: {
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    reason: string;
  }) =>
    api.post(`/superadmin/users/${id}/balance`, data),
};

// ============ INSTRUMENT MANAGEMENT ============

export const instrumentApi = {
  getOHLC: (id: string, params?: { period?: string; from?: string; to?: string }) =>
    api.get(`/instruments/${id}/ohlc`, { params }),

  updateInstrument: (id: string, data: any) =>
    api.put(`/instruments/${id}`, data),
};

// ============ SEGMENT MANAGEMENT ============

export const segmentApi = {
  getSegments: () =>
    api.get('/segments'),

  getSegment: (id: string) =>
    api.get(`/segments/${id}`),

  createSegment: (data: any) =>
    api.post('/segments', data),

  updateSegment: (id: string, data: any) =>
    api.put(`/segments/${id}`, data),

  deleteSegment: (id: string) =>
    api.delete(`/segments/${id}`),

  getMarketStatus: (id: string) =>
    api.get(`/segments/${id}/status`),
};

// ============ TRADING MANAGEMENT ============

export const tradingApi = {
  getTrades: (params?: {
    userId?: string;
    segmentId?: string;
    instrumentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/trades', { params }),

  getPositions: (params?: {
    userId?: string;
    segmentId?: string;
    instrumentId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/positions', { params }),

  executeManualTrade: (data: {
    userId: string;
    instrumentId: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price?: number;
    orderType?: string;
    reason: string;
  }) =>
    api.post('/superadmin/trades/manual', data),

  closePosition: (id: string, data: {
    quantity?: number;
    price?: number;
    reason: string;
  }) =>
    api.post(`/superadmin/positions/${id}/close`, data),
};

// ============ REPORTS & ANALYTICS ============

export const reportsApi = {
  generateTradeReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/reports/trades', { params }),

  generatePnLReport: (params?: {
    userId?: string;
    segmentId?: string;
    startDate?: string;
    endDate?: string;
    format?: 'json' | 'excel' | 'pdf';
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/reports/pnl', { params }),

  getLedgerEntries: (params?: {
    userId?: string;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/reports/ledger', { params }),
};

// ============ COMMISSION MANAGEMENT ============

export const commissionApi = {
  getCommissionHistory: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) =>
    api.get('/superadmin/logs/user-edits', { params }), // Using user-edits as proxy for commission changes

  setCommission: (data: {
    adminCommission: number;
    subAdminCommission: number;
    clientCommission: number;
  }) =>
    api.post('/superadmin/commission-settings', data),
};

// ============ LOGS & NOTIFICATIONS ============

export const logsApi = {
  getTradeLogs: (params?: {
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api.get('/superadmin/logs/trades', { params }),
};

// ============ SYSTEM SETTINGS ============

export const settingsApi = {
  getSettings: () =>
    api.get('/superadmin/settings'),

  updateSettings: (settings: any, category?: string) =>
    api.put('/superadmin/settings', { settings, category }),
};

export default api;