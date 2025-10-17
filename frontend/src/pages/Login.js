import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary-500 fill-current" />
              <span className="text-xl font-semibold text-gray-900">LocalAid</span>
            </div>
            <Link 
              to="/register" 
              className="text-sm text-gray-600 hover:text-primary-500 transition-colors"
            >
              Don't have an account? <span className="font-semibold">Sign Up</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Form */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-3xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to continue helping your community</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-sm tracking-wide uppercase hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-6"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="lg:pt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Community Support & <br />Local Assistance Platform
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
                <p className="text-gray-700">Connect with Neighbors</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
                <p className="text-gray-700">Request & Offer Help</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
                <p className="text-gray-700">Build Strong Communities</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
                <p className="text-gray-700">Real-time Location Services</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700 italic mb-4">
                "LocalAid has been flexible and open to new ideas to which they respond very quickly. A main key differentiator for me is that unlike other community platforms, LocalAid understands the realities of the neighborhood."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-500 fill-current" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Community Member</p>
                  <p className="text-sm text-gray-600">Active User, LocalAid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
