import { X, Download, Share2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useState } from 'react';

export const ScreenshotViewer = ({ url, onClose }) => {
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `proof_${Date.now()}.png`;
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-2xl opacity-0 hover:opacity-100 transition-opacity z-10">
        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.min(p + 0.2, 3)); }} className="p-2 hover:bg-white/10 rounded-full transition-all text-white"><ZoomIn size={20} /></button>
        <button onClick={(e) => { e.stopPropagation(); setZoom(p => Math.max(p - 0.2, 0.5)); }} className="p-2 hover:bg-white/10 rounded-full transition-all text-white"><ZoomOut size={20} /></button>
        <div className="h-6 w-[1px] bg-white/20 mx-2"></div>
        <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} className="p-2 hover:bg-white/10 rounded-full transition-all text-white"><Download size={20} /></button>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-white/10 rounded-full transition-all text-brand-error"><X size={20} /></button>
      </div>

      <div 
        className="w-full max-w-5xl h-full flex items-center justify-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={url} 
          alt="Payment Proof" 
          className="max-w-full max-h-[90vh] object-contain transition-transform duration-300 rounded-lg shadow-2xl shadow-brand-primary/20"
          style={{ transform: `scale(${zoom})` }}
        />
      </div>

      <div className="absolute bottom-6 flex flex-col items-center gap-2">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Transaction Verification Proof</p>
        <div className="text-white/20"><Maximize size={24} /></div>
      </div>
    </div>
  );
};
