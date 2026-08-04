import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sprout, LogIn, Lock, Mail, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-4 py-16 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-outline-variant/40 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Sprout size={32} className="text-secondary" />
          </div>
          <h1 className="font-h1 text-2xl font-extrabold text-on-surface">Welcome Back</h1>
          <p className="text-xs text-on-surface-variant">Sign in to access your Krishi Kendra account</p>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 border border-error/30 text-error text-xs font-semibold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="farmer@krishikendra.com"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-10 pr-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-10 pr-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
