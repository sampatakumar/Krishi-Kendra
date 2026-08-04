import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sprout, UserPlus, Lock, Mail, User, ShieldCheck, Tag } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl border border-outline-variant/40 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-primary-container text-on-primary rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Sprout size={32} className="text-secondary" />
          </div>
          <h1 className="font-h1 text-2xl font-extrabold text-on-surface">Create an Account</h1>
          <p className="text-xs text-on-surface-variant">Join Krishi Kendra Agricultural Community</p>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 border border-error/30 text-error text-xs font-semibold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="Rajesh Kumar"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-10 pr-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Username *</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="rajesh_farmer"
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="rajesh@krishikendra.com"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-10 pr-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg pl-10 pr-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md"
                required 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">I want to register as *</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-outline-variant/60 rounded-lg px-3 py-2.5 text-xs text-on-surface outline-none focus:border-primary font-body-md cursor-pointer"
            >
              <option value="farmer">Farmer (Buy Seeds, Fertilizers & Machinery)</option>
              <option value="seller">Seller / Supplier (List Products & Accept Orders)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 px-4 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <UserPlus size={16} />
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
