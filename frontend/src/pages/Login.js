import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Chrome } from 'lucide-react';
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
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl float-animation" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block p-4 glass rounded-2xl mb-4"
            >
              <LogIn className="w-12 h-12 text-white" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl font-bold text-white text-glow mb-2" style={{ fontFamily: 'Poppins' }}>
              Welcome Back
            </h1>
            <p className="text-white/70" style={{ fontFamily: 'Inter' }}>
              Sign in to continue creating amazing campaigns
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
            {/* Email Input */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2" style={{ fontFamily: 'Inter' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" strokeWidth={1.5} />
                <input
                  data-testid="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-white placeholder-white/50"
                  placeholder="you@example.com"
                  required
                  style={{ fontFamily: 'Inter' }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2" style={{ fontFamily: 'Inter' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" strokeWidth={1.5} />
                <input
                  data-testid="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 glass-input rounded-xl text-white placeholder-white/50"
                  placeholder="••••••••"
                  required
                  style={{ fontFamily: 'Inter' }}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              data-testid="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-button rounded-xl text-white font-semibold flex items-center justify-center gap-2"
              style={{ fontFamily: 'Poppins' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-white/60 glass-button py-1 rounded-full" style={{ fontFamily: 'Inter' }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            data-testid="google-login-btn"
            onClick={handleGoogleLogin}
            className="w-full py-3.5 glass-button rounded-xl text-white font-semibold flex items-center justify-center gap-3 hover:scale-105 transition-transform"
            style={{ fontFamily: 'Poppins' }}
          >
            <Chrome className="w-5 h-5" strokeWidth={1.5} />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="text-white font-semibold hover:underline" data-testid="signup-link">
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
