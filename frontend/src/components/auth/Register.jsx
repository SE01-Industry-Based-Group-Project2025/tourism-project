// src/components/auth/Register.jsx

import React, { useState } from 'react';
import { useAuth }           from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button }            from '../ui/Button';
import { Input }             from '../ui/Input';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'ROLE_USER',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  // 1) Handle inputs
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(errs => ({ ...errs, [name]: '' }));
  };

  // 2) Validate
  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim())  errs.lastName  = 'Last name is required';
    if (!formData.email)            errs.email     = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Invalid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 8)
      errs.password = 'Must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      errs.password = 'Must include uppercase, lowercase & number';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords must match';
    if (!formData.phone) errs.phone = 'Phone is required';
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone))
      errs.phone = 'Invalid phone format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 3) Submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { success, error } = await register({
      firstName: formData.firstName.trim(),
      lastName:  formData.lastName.trim(),
      email:     formData.email.toLowerCase(),
      password:  formData.password,
      phone:     formData.phone,
      role:      formData.role,
    });

    if (success) {
      // 4) Redirect back to login with flash
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in.' }
      });
    } else {
      setErrors({ general: error });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-12 px-4 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-slate-100/30 to-blue-100/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-md w-full mx-4">
        {/* Main registration card */}
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 p-8 space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                  {/* Modern user plus icon */}
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 font-medium">Join SLTourPal and start exploring</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-red-100 rounded-lg">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-700 font-medium">{errors.general}</p>
              </div>
            </div>
          )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.firstName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${
                  errors.lastName 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.phone 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
            />
            {errors.phone && (
              <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.confirmPassword 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors`}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  );
}
