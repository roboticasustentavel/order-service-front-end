import axios from 'axios';
import { ServiceOrder, CreateServiceOrderData, UpdateServiceOrderData } from '@/types/serviceOrder';

// Simulação de API com dados mockados
class ServiceOrderAPI {
  private orders: ServiceOrder[] = [
    {
      id: '1',
      title: 'Manutenção de Ar Condicionado',
      description: 'Limpeza e verificação do sistema de refrigeração',
      client: 'Empresa XYZ Ltda',
      priority: 'high',
      status: 'in_progress',
      category: 'Manutenção',
      technician: 'João Silva',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      dueDate: '2024-01-20T18:00:00Z',
      estimatedHours: 4,
      notes: 'Cliente relatou ruído anormal no equipamento'
    },
    {
      id: '2',
      title: 'Instalação de Sistema de Segurança',
      description: 'Instalação completa de câmeras e sistema de alarme',
      client: 'Residencial ABC',
      priority: 'medium',
      status: 'pending',
      category: 'Instalação',
      createdAt: '2024-01-16T08:00:00Z',
      updatedAt: '2024-01-16T08:00:00Z',
      dueDate: '2024-01-25T17:00:00Z',
      estimatedHours: 8,
      notes: 'Aguardando chegada dos equipamentos'
    },
    {
      id: '3',
      title: 'Reparo de Rede Elétrica',
      description: 'Substituição de fiação danificada no segundo andar',
      client: 'Condomínio Solar',
      priority: 'high',
      status: 'completed',
      category: 'Reparo',
      technician: 'Maria Santos',
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-14T16:00:00Z',
      dueDate: '2024-01-15T12:00:00Z',
      estimatedHours: 6,
      notes: 'Serviço concluído com sucesso'
    }
  ];

  // Simular delay de rede
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllOrders(): Promise<ServiceOrder[]> {
    await this.delay(500);
    return [...this.orders];
  }

  async getOrderById(id: string): Promise<ServiceOrder | null> {
    await this.delay(300);
    return this.orders.find(order => order.id === id) || null;
  }

  async createOrder(data: CreateServiceOrderData): Promise<ServiceOrder> {
    await this.delay(700);
    
    const newOrder: ServiceOrder = {
      id: (this.orders.length + 1).toString(),
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  async updateOrder(id: string, data: UpdateServiceOrderData): Promise<ServiceOrder | null> {
    await this.delay(500);
    
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return this.orders[orderIndex];
  }

  async deleteOrder(id: string): Promise<boolean> {
    await this.delay(400);
    
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return false;

    this.orders.splice(orderIndex, 1);
    return true;
  }

  async getOrdersByStatus(status: ServiceOrder['status']): Promise<ServiceOrder[]> {
    await this.delay(400);
    return this.orders.filter(order => order.status === status);
  }

  async searchOrders(query: string): Promise<ServiceOrder[]> {
    await this.delay(600);
    const lowerQuery = query.toLowerCase();
    return this.orders.filter(order => 
      order.title.toLowerCase().includes(lowerQuery) ||
      order.client.toLowerCase().includes(lowerQuery) ||
      order.description.toLowerCase().includes(lowerQuery)
    );
  }
}

export const serviceOrderAPI = new ServiceOrderAPI();

// Configuração do axios para API local
export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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