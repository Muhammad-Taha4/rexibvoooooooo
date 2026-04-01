import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useEffect } from 'react';

const TOAST_TYPES = {
  success: { bg: 'bg-brand-success', icon: CheckCircle, shadow: 'shadow-brand-success/20' },
  error: { bg: 'bg-brand-error', icon: AlertCircle, shadow: 'shadow-brand-error/20' },
  info: { bg: 'bg-brand-primary', icon: Info, shadow: 'shadow-brand-primary/20' },
};

export const Toast = ({ message, type = 'success', onClose }) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.success;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold text-sm shadow-2xl ${config.bg} ${config.shadow} animate-slide-left`}>
      <Icon size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 p-1 hover:bg-white/20 rounded-full transition-all">
        <X size={16} />
      </button>
    </div>
  );
};
