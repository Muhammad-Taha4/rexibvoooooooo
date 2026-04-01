import { Clock, CheckCircle } from 'lucide-react';

export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'text-brand-warning', bg: 'bg-brand-warning/10', border: 'border-brand-warning/20', icon: Clock },
  received: { label: 'Received', color: 'text-brand-primary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20', icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-brand-success', bg: 'bg-brand-success/10', border: 'border-brand-success/20', icon: CheckCircle }
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${config.bg} ${config.color} ${config.border} uppercase tracking-wider`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
};
