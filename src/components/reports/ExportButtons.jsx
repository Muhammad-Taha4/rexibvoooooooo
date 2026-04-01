import { Download, FileText, Printer, Share2 } from 'lucide-react';

export const ExportButtons = ({ data, onExportCSV, onExportMonthly }) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 animate-fade-in shadow-2xl p-1">
      <button 
        onClick={onExportCSV}
        className="h-11 px-6 bg-brand-card/40 border border-brand-border/40 hover:border-brand-primary/40 hover:bg-brand-primary/5 rounded-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-brand-text-muted hover:text-brand-primary transition-all active:scale-95"
      >
        <Download size={18} />
        <span>Download CSV</span>
      </button>
      
      <button 
        onClick={onExportMonthly}
        className="h-11 px-6 bg-linear-to-br from-brand-primary to-brand-secondary hover:shadow-lg hover:shadow-brand-primary/20 rounded-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95"
      >
        <FileText size={18} />
        <span>Full Monthly Report</span>
      </button>

      <button 
        onClick={() => window.print()}
        className="h-11 w-11 bg-brand-card/40 border border-brand-border/40 hover:border-brand-text-primary rounded-2xl flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-all active:scale-95 shadow-lg"
      >
        <Printer size={18} />
      </button>

      <button 
        className="h-11 w-11 bg-brand-card/40 border border-brand-border/40 hover:border-brand-text-primary rounded-2xl flex items-center justify-center text-brand-text-muted hover:text-brand-text-primary transition-all active:scale-95 shadow-lg"
      >
        <Share2 size={18} />
      </button>
    </div>
  );
};
