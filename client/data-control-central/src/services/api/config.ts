// src/services/api/config.ts
export const API_BASE_URL = "http://localhost:4000/api";

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  // Device endpoints
  DEVICES: {
    GET_ALL: `${API_BASE_URL}/medical_devices`,
    GET_ONE: (id: string) => `${API_BASE_URL}/medical_devices/${id}`,
    CREATE: `${API_BASE_URL}/medical_devices`,
    UPDATE: (id: string) => `${API_BASE_URL}/medical_devices/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/medical_devices/${id}`,
  },
  // Supplier endpoints
  SUPPLIERS: {
    GET_ALL: `${API_BASE_URL}/supplier/all`,
    GET_PRODUCTS: `${API_BASE_URL}/supplier/products`,
  },
  // User endpoints
  USERS: {
    GET_ALL: `${API_BASE_URL}/auth`,
    GET_ONE: (id: string) => `${API_BASE_URL}/auth/${id}`,
    CREATE: `${API_BASE_URL}/auth/register`,
    UPDATE: (id: string) => `${API_BASE_URL}/auth/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/auth/${id}`,
  },
  // Order endpoints
  ORDERS: {
    GET_ALL: `${API_BASE_URL}/orders`,
    GET_ONE: (id: string) => `${API_BASE_URL}/orders/${id}`,
    CREATE: `${API_BASE_URL}/orders`,
    UPDATE: (id: string) => `${API_BASE_URL}/orders/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/orders/${id}`,
  },
  // Stats endpoints
  STATS: {
    GET_DASHBOARD: `${API_BASE_URL}/stats/dashboard`,
    GET_DEVICES: `${API_BASE_URL}/stats/devices`,
    GET_ORDERS: `${API_BASE_URL}/stats/orders`,
  },
};
