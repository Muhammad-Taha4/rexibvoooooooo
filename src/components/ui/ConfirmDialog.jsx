import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm Delete", isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-brand-card border border-brand-border/40 rounded-3xl shadow-2xl relative overflow-hidden animate-zoom-in">
        <div className="p-6 text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${isDanger ? 'bg-brand-error/10 text-brand-error' : 'bg-brand-primary/10 text-brand-primary'}`}>
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="text-sm text-brand-text-muted leading-relaxed">{message}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              onClick={onCancel}
              className="h-12 bg-white/5 hover:bg-white/10 border border-brand-border/40 rounded-2xl text-xs font-bold text-white uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`h-12 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                isDanger 
                ? 'bg-brand-error hover:bg-brand-error/80 text-white shadow-brand-error/20' 
                : 'bg-brand-primary hover:bg-brand-primary/80 text-white shadow-brand-primary/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-brand-text-muted hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
