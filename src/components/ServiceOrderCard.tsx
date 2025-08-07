import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceOrder } from '@/types/serviceOrder';
import { Calendar, Clock, User, Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceOrderCardProps {
  order: ServiceOrder;
  onView: (order: ServiceOrder) => void;
  onEdit: (order: ServiceOrder) => void;
  onDelete: (order: ServiceOrder) => void;
}

const getPriorityColor = (priority: ServiceOrder['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    case 'medium':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'low':
      return 'bg-success/20 text-success border-success/30';
    default:
      return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

const getStatusColor = (status: ServiceOrder['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-success/20 text-success border-success/30';
    case 'in_progress':
      return 'bg-accent/20 text-accent border-accent/30';
    case 'pending':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'cancelled':
      return 'bg-destructive/20 text-destructive border-destructive/30';
    default:
      return 'bg-muted/20 text-muted-foreground border-muted/30';
  }
};

const getStatusText = (status: ServiceOrder['status']) => {
  switch (status) {
    case 'completed':
      return 'Concluída';
    case 'in_progress':
      return 'Em Andamento';
    case 'pending':
      return 'Pendente';
    case 'cancelled':
      return 'Cancelada';
    default:
      return status;
  }
};

const getPriorityText = (priority: ServiceOrder['priority']) => {
  switch (priority) {
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Média';
    case 'low':
      return 'Baixa';
    default:
      return priority;
  }
};

export function ServiceOrderCard({ order, onView, onEdit, onDelete }: ServiceOrderCardProps) {
  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-300 group animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
            {order.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getPriorityColor(order.priority)}>
              {getPriorityText(order.priority)}
            </Badge>
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-2">
          {order.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{order.client}</span>
          </div>
          
          {order.technician && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{order.technician}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>

          {order.dueDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(order.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(order)}
            className="btn-glass flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(order)}
            className="btn-glass flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(order)}
            className="btn-glass hover:bg-destructive/20 hover:border-destructive/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}