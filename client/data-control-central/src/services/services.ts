// src/services/api/services.ts
import { apiClient } from "./api/client";
import { API_ENDPOINTS } from "./api/config";
import { Device, Order, ApiResponse, User } from "./api/types";

export const userService = {
  getAllUsers: () =>
    apiClient.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.GET_ALL),
  login: (loginData: Partial<User>) =>
    apiClient.post<ApiResponse<User>>(API_ENDPOINTS.AUTH.LOGIN, loginData),
  deleteUser: (userId: string) =>
    apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.USERS.DELETE(userId)),
  createUser: (userData: Partial<User>) =>
    apiClient.post<ApiResponse<User>>(API_ENDPOINTS.USERS.CREATE, userData),
  getUserById: (userId: string) =>
    apiClient.get<ApiResponse<User>>(API_ENDPOINTS.USERS.GET_ONE(userId)),
  updateUser: (userId: string, userData: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.USERS.UPDATE(userId),
      userData
    ),
};

export const deviceService = {
  getAllDevices: () =>
    apiClient.get<ApiResponse<Device[]>>(API_ENDPOINTS.DEVICES.GET_ALL),

  getDevice: (id: string) =>
    apiClient.get<ApiResponse<Device>>(API_ENDPOINTS.DEVICES.GET_ONE(id)),

  createDevice: (deviceData: Partial<Device>) =>
    apiClient.post<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES.CREATE,
      deviceData
    ),

  updateDevice: (id: string, deviceData: Partial<Device>) =>
    apiClient.put<ApiResponse<Device>>(
      API_ENDPOINTS.DEVICES.UPDATE(id),
      deviceData
    ),

  deleteDevice: (id: string) =>
    apiClient.delete<ApiResponse<void>>(API_ENDPOINTS.DEVICES.DELETE(id)),
};

export const orderService = {
  getAllOrders: () =>
    apiClient.get<ApiResponse<Order[]>>(API_ENDPOINTS.ORDERS.GET_ALL),

  getOrder: (id: string) =>
    apiClient.get<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.GET_ONE(id)),

  createOrder: (orderData: Partial<Order>) =>
    apiClient.post<ApiResponse<Order>>(API_ENDPOINTS.ORDERS.CREATE, orderData),

  updateOrderStatus: (
    id: string,
    statusData: { status: string; note?: string }
  ) =>
    apiClient.put<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(id),
      statusData
    ),
};
