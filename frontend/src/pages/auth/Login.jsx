import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  UserCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'manager') {
        navigate('/manager');
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setErrorMessage('');

    try {
      const loggedInUser = await login(demoEmail, 'password123');
      if (loggedInUser.role === 'manager') {
        navigate('/manager');
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to authenticate demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 flex-1">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-teal-600/20 mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome to Hotel<span className="text-teal-600">Pro</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your reservations, guest services, or property management suite
          </p>
        </div>

        {/* Quick Demo Login Cards */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-3xl border border-teal-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-teal-900 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>1-Click Instant Demo Logins</span>
          </div>
          <p className="text-[11px] text-teal-700 leading-tight">
            Select any persona below to auto-login and inspect the interface:
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('guest@hotelpro.com', 'guest')}
              className="p-2.5 bg-white hover:bg-teal-600 hover:text-white rounded-2xl border border-teal-200 text-slate-800 text-center transition-all shadow-sm group cursor-pointer"
            >
              <UserCheck className="w-4 h-4 mx-auto mb-1 text-teal-600 group-hover:text-white" />
              <p className="text-[11px] font-bold">Guest</p>
              <span className="text-[9px] text-slate-400 group-hover:text-teal-100 block">Sarah (VIP)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('manager@hotelpro.com', 'manager')}
              className="p-2.5 bg-white hover:bg-teal-600 hover:text-white rounded-2xl border border-teal-200 text-slate-800 text-center transition-all shadow-sm group cursor-pointer"
            >
              <Building2 className="w-4 h-4 mx-auto mb-1 text-teal-600 group-hover:text-white" />
              <p className="text-[11px] font-bold">Manager</p>
              <span className="text-[9px] text-slate-400 group-hover:text-teal-100 block">Elena (PMS)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@hotelpro.com', 'admin')}
              className="p-2.5 bg-white hover:bg-purple-600 hover:text-white rounded-2xl border border-teal-200 text-slate-800 text-center transition-all shadow-sm group cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-purple-600 group-hover:text-white" />
              <p className="text-[11px] font-bold">Admin</p>
              <span className="text-[9px] text-slate-400 group-hover:text-purple-100 block">Alexander</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
