import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceOrder, CreateServiceOrderData, UpdateServiceOrderData } from '@/types/serviceOrder';
import { serviceOrderAPI } from '@/services/api';
import { ServiceOrderCard } from '@/components/ServiceOrderCard';
import { ServiceOrderForm } from '@/components/ServiceOrderForm';
import { ServiceOrderDetails } from '@/components/ServiceOrderDetails';
import { UserProfile } from '@/components/UserProfile';
import { Dashboard } from '@/components/Dashboard';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, BarChart3, FileText } from 'lucide-react';

type ViewMode = 'dashboard' | 'list' | 'form' | 'details';

const Index = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await serviceOrderAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as ordens de serviço',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (data: CreateServiceOrderData) => {
    try {
      setIsSubmitting(true);
      const newOrder = await serviceOrderAPI.createOrder(data);
      setOrders(prev => [newOrder, ...prev]);
      setViewMode('list');
      toast({
        title: 'Sucesso',
        description: 'Ordem de serviço criada com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a ordem de serviço',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOrder = async (data: UpdateServiceOrderData) => {
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      const updatedOrder = await serviceOrderAPI.updateOrder(selectedOrder.id, data);
      if (updatedOrder) {
        setOrders(prev => prev.map(order => 
          order.id === selectedOrder.id ? updatedOrder : order
        ));
        setSelectedOrder(updatedOrder);
        setViewMode('details');
        toast({
          title: 'Sucesso',
          description: 'Ordem de serviço atualizada com sucesso',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a ordem de serviço',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async (order: ServiceOrder) => {
    if (!confirm('Tem certeza que deseja excluir esta ordem de serviço?')) return;

    try {
      await serviceOrderAPI.deleteOrder(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
      toast({
        title: 'Sucesso',
        description: 'Ordem de serviço excluída com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a ordem de serviço',
        variant: 'destructive',
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (viewMode) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      
      case 'form':
        return (
          <ServiceOrderForm
            order={selectedOrder || undefined}
            onSubmit={selectedOrder ? handleUpdateOrder : handleCreateOrder}
            onCancel={() => {
              setViewMode('list');
              setSelectedOrder(null);
            }}
            isLoading={isSubmitting}
          />
        );
      
      case 'details':
        return selectedOrder ? (
          <ServiceOrderDetails
            order={selectedOrder}
            onEdit={() => setViewMode('form')}
            onClose={() => {
              setViewMode('list');
              setSelectedOrder(null);
            }}
          />
        ) : null;
      
      default:
        return (
          <div className="space-y-6">
            {/* Cabeçalho e Filtros */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h1 className="text-3xl font-bold gradient-text">Ordens de Serviço</h1>
                <Button 
                  onClick={() => {
                    setSelectedOrder(null);
                    setViewMode('form');
                  }}
                  className="glow-hover"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Ordem
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ordens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] glass">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Ordens */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Nenhuma ordem encontrada' 
                    : 'Nenhuma ordem cadastrada'
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira ordem de serviço'
                  }
                </p>
                {(!searchQuery && statusFilter === 'all') && (
                  <Button 
                    onClick={() => {
                      setSelectedOrder(null);
                      setViewMode('form');
                    }}
                    className="glow-hover"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Ordem
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <ServiceOrderCard
                    key={order.id}
                    order={order}
                    onView={(order) => {
                      setSelectedOrder(order);
                      setViewMode('details');
                    }}
                    onEdit={(order) => {
                      setSelectedOrder(order);
                      setViewMode('form');
                    }}
                    onDelete={handleDeleteOrder}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header de Navegação */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">ServiceFlow</h1>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
              <Button
                variant={viewMode === 'dashboard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('dashboard')}
                className={viewMode === 'dashboard' ? 'glow-hover' : 'btn-glass'}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'glow-hover' : 'btn-glass'}
              >
                <FileText className="h-4 w-4 mr-2" />
                Ordens
              </Button>
              </div>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
