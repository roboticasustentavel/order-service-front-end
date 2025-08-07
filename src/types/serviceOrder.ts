export interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  client: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  technician?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  estimatedHours?: number;
  notes?: string;
}

export interface CreateServiceOrderData {
  title: string;
  description: string;
  client: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  technician?: string;
  dueDate?: string;
  estimatedHours?: number;
  notes?: string;
}

export interface UpdateServiceOrderData extends Partial<CreateServiceOrderData> {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}