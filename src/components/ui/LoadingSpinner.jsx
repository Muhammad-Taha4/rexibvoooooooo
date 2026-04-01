export const LoadingSpinner = ({ size = 'md', color = 'brand-primary' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-fade-in">
      <div className={`${sizes[size]} border-white/10 border-t-${color} rounded-full animate-spin transition-all`}></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-text-muted animate-pulse">Synchronizing Data</p>
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="fixed inset-0 z-[1000] bg-brand-bg flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);
