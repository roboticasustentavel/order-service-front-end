import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceOrder } from '@/types/serviceOrder';
import { CheckCircle, Clock, AlertCircle, XCircle, FileText, TrendingUp } from 'lucide-react';

interface DashboardProps {
  orders: ServiceOrder[];
}

export function Dashboard({ orders }: DashboardProps) {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const completionRate = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : '0';

  const statsCards = [
    {
      title: 'Total de Ordens',
      value: stats.total,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
    {
      title: 'Em Andamento',
      value: stats.inProgress,
      icon: AlertCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      title: 'Concluídas',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Título do Dashboard */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas ordens de serviço</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className="glass-card glow-hover" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {stat.title}
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Métricas Adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-success">{completionRate}%</div>
              <div className="w-full bg-muted/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-success to-success-glow h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.completed} de {stats.total} ordens concluídas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Distribuição por Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pendentes</span>
                <span className="text-warning font-medium">{stats.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Em Andamento</span>
                <span className="text-accent font-medium">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Concluídas</span>
                <span className="text-success font-medium">{stats.completed}</span>
              </div>
              {stats.cancelled > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Canceladas</span>
                  <span className="text-destructive font-medium">{stats.cancelled}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ordens Recentes */}
      {orders.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Ordens Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{order.title}</p>
                    <p className="text-sm text-muted-foreground">{order.client}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      order.status === 'completed' ? 'text-success' :
                      order.status === 'in_progress' ? 'text-accent' :
                      order.status === 'pending' ? 'text-warning' :
                      'text-destructive'
                    }`}>
                      {order.status === 'completed' ? 'Concluída' :
                       order.status === 'in_progress' ? 'Em Andamento' :
                       order.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}