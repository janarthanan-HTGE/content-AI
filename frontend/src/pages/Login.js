import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl border-2 border-black p-8" style={{ boxShadow: '8px 8px 0px 0px #0A0A0A' }}>
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#FF5722] border-2 border-black rounded-md p-3" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
              <LogIn strokeWidth={2.5} className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-2" style={{ fontFamily: 'Outfit' }}>
            Welcome Back
          </h1>
          <p className="text-center text-[#52525B] mb-8" style={{ fontFamily: 'Manrope' }}>
            Log in to create amazing campaigns
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div data-testid="login-form">
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                Email
              </label>
              <div className="relative">
                <Mail strokeWidth={2.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <input
                  data-testid="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Manrope' }}>
                Password
              </label>
              <div className="relative">
                <Lock strokeWidth={2.5} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <input
                  data-testid="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-black rounded-md focus:outline-none focus:ring-4 focus:ring-[#FF5722]/30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              data-testid="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5722] text-white font-bold py-3 rounded-md border-2 border-black brutalist-btn"
              style={{ boxShadow: '4px 4px 0px 0px #0A0A0A', fontFamily: 'Outfit' }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ fontFamily: 'Manrope' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#FF5722] font-bold hover:underline" data-testid="signup-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
