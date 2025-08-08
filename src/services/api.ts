import axios from 'axios';
import { ServiceOrder, CreateServiceOrderData, UpdateServiceOrderData } from '@/types/serviceOrder';

// API para ordens de serviço
class ServiceOrderAPI {
  async getAllOrders(): Promise<ServiceOrder[]> {
    const response = await api.get('/service-orders');
    return response.data;
  }

  async getOrderById(id: string): Promise<ServiceOrder | null> {
    try {
      const response = await api.get(`/service-orders/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createOrder(data: CreateServiceOrderData): Promise<ServiceOrder> {
    const response = await api.post('/service-orders', data);
    return response.data;
  }

  async updateOrder(id: string, data: UpdateServiceOrderData): Promise<ServiceOrder | null> {
    try {
      const response = await api.put(`/service-orders/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      await api.delete(`/service-orders/${id}`);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async getOrdersByStatus(status: ServiceOrder['status']): Promise<ServiceOrder[]> {
    const response = await api.get(`/service-orders?status=${status}`);
    return response.data;
  }

  async searchOrders(query: string): Promise<ServiceOrder[]> {
    const response = await api.get(`/service-orders/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const serviceOrderAPI = new ServiceOrderAPI();

// Configuração do axios para API local
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Adicionar token de auth quando necessário
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de erros
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);