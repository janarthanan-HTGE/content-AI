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
  const { login, loginWithGoogle } = useAuth();
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

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success && result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Google login failed');
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E4E4E7]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#52525B]" style={{ fontFamily: 'Manrope' }}>Or continue with</span>
            </div>
          </div>

          <button
            data-testid="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black font-bold py-3 rounded-md border-2 border-black brutalist-btn flex items-center justify-center gap-2"
            style={{ boxShadow: '4px 4px 0px 0px #0A0A0A', fontFamily: 'Outfit' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

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
