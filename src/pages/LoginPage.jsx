import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // LAYER 1 SECURITY: ONLY TAHA CAN LOG IN
    if (email.toLowerCase() !== 'taha@gmail.com') {
      setError('System Restricted: ONLY the administrator is permitted to access this hub.');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md card backdrop-blur-md shadow-2xl relative z-10 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-linear-to-br from-brand-primary to-brand-secondary rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-brand-primary/30 mb-2">
            <span className="text-2xl font-black text-white">F</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-brand-text-muted text-sm">Log in to manage your sales and finance dashboard.</p>
        </div>

        {error && (
          <div className="p-3 bg-brand-error/10 border border-brand-error/20 rounded-xl flex items-center gap-3 text-brand-error text-sm animate-shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1 font-mono">Email Address</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-12 bg-black/20 border border-brand-border/40 rounded-xl pl-11 pr-4 text-brand-text-primary placeholder:text-brand-text-muted focus:border-brand-primary outline-none transition-all focus:ring-4 focus:ring-brand-primary/5"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-text-muted uppercase tracking-wider pl-1 font-mono">Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-text-muted group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your secure password"
                className="w-full h-12 bg-black/20 border border-brand-border/40 rounded-xl pl-11 pr-4 text-brand-text-primary placeholder:text-brand-text-muted focus:border-brand-primary outline-none transition-all focus:ring-4 focus:ring-brand-primary/5"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 btn-primary flex items-center justify-center gap-3 text-base shadow-lg hover:translate-y-[-2px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Log In Now</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-brand-border/20">
          <p className="text-xs text-brand-text-muted">
            Professional Sales & Operations Internal Tool
          </p>
        </div>
      </div>
    </div>
  );
};
