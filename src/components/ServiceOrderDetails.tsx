import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ServiceOrder } from '@/types/serviceOrder';
import { Calendar, Clock, User, FileText, Tag, Edit, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ServiceOrderDetailsProps {
  order: ServiceOrder;
  onEdit: () => void;
  onClose: () => void;
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

export function ServiceOrderDetails({ order, onEdit, onClose }: ServiceOrderDetailsProps) {
  return (
    <Card className="glass-card max-w-3xl mx-auto animate-slide-up">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl gradient-text mb-2">
              {order.title}
            </CardTitle>
            <p className="text-muted-foreground">OS #{order.id}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="btn-glass"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="btn-glass"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status e Prioridade */}
        <div className="flex gap-4">
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
          <Badge className={getPriorityColor(order.priority)}>
            Prioridade {getPriorityText(order.priority)}
          </Badge>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">Cliente</p>
                <p className="text-muted-foreground">{order.client}</p>
              </div>
            </div>

            {order.technician && (
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground">Técnico Responsável</p>
                  <p className="text-muted-foreground">{order.technician}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-success mt-1" />
              <div>
                <p className="font-medium text-foreground">Categoria</p>
                <p className="text-muted-foreground">{order.category}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium text-foreground">Data de Criação</p>
                <p className="text-muted-foreground">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>

            {order.dueDate && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-warning mt-1" />
                <div>
                  <p className="font-medium text-foreground">Data de Vencimento</p>
                  <p className="text-muted-foreground">
                    {format(new Date(order.dueDate), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {order.estimatedHours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent mt-1" />
                <div>
                  <p className="font-medium text-foreground">Horas Estimadas</p>
                  <p className="text-muted-foreground">{order.estimatedHours}h</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <p className="font-medium text-foreground">Descrição</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-muted-foreground leading-relaxed">{order.description}</p>
          </div>
        </div>

        {/* Observações */}
        {order.notes && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              <p className="font-medium text-foreground">Observações</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <p className="text-muted-foreground leading-relaxed">{order.notes}</p>
            </div>
          </div>
        )}

        {/* Informações de Atualização */}
        <div className="text-sm text-muted-foreground pt-4 border-t border-white/10">
          Última atualização: {format(new Date(order.updatedAt), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}
        </div>
      </CardContent>
    </Card>
  );
}