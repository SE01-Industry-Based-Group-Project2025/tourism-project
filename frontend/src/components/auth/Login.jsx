import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { login, user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();  // Handle navigation after successful login
  useEffect(() => {
    if (loginSuccess && isAuthenticated && user) {
      if (isAdmin) {
        console.log('Detected admin, navigating to /admin/dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Detected regular user, navigating to /dashboard');
        navigate('/dashboard');
      }
      setLoginSuccess(false); // Reset flag
      setLoading(false); // Stop loading spinner
    }
  }, [loginSuccess, isAuthenticated, user, isAdmin, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors(e => ({ ...e, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';

    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    const result = await login(formData.email, formData.password);

    if (result.success) {
      setLoginSuccess(true); // Trigger navigation via useEffect
      
      // Fallback: If auth state doesn't update within 3 seconds, stop loading
      setTimeout(() => {
        if (loading) {
          setLoading(false);
          setErrors({ general: 'Login succeeded but navigation failed. Please refresh the page.' });
        }
      }, 3000);
    } else {
      setErrors({ general: result.error || 'Login failed' });
      setLoading(false);
    }
  };  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-md w-full mx-4">
        {/* Main login card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  {/* Modern lock icon */}
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 
                             00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7
                             a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300 font-medium">Sign in to your SLTOURPAL admin account</p>
          </div>          {errors.general && (
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-500/30 rounded-lg backdrop-blur-sm">
                  <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-200 font-medium">{errors.general}</p>
              </div>
            </div>
          )}          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400 ${
                      errors.email ? 'border-red-400 focus:ring-red-400' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-red-300">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-blue-400 focus:border-blue-400 ${
                      errors.password ? 'border-red-400 focus:ring-red-400' : ''
                    }`}
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-300">{errors.password}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-white/30 rounded bg-white/10 backdrop-blur-sm"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="relative w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Signing in...
                </span>
              ) : (
                <span className="relative z-10">Sign In</span>
              )}
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 to-purple-400/50 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Button>

            <p className="text-center text-sm text-gray-300">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
