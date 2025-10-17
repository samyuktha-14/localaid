import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Home, PlusCircle, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary-500 fill-current" />
            <span className="text-2xl font-bold text-gray-900">LocalAid</span>
          </Link>

          {/* Welcome Message */}
          {user && (
            <div className="hidden md:block text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{user.name}</span> from{' '}
              <span className="font-semibold text-primary-600">{user.neighborhood}</span> 👋
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Home"
            >
              <Home className="h-6 w-6" />
            </Link>

            <Link
              to="/create-post"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/create-post')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Create Post"
            >
              <PlusCircle className="h-6 w-6" />
            </Link>

            <Link
              to="/emergency"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/emergency')
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Emergency"
            >
              <Bell className="h-6 w-6" />
            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className={`p-2 rounded-lg transition-colors ${
                location.pathname.includes('/profile')
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Profile"
            >
              <User className="h-6 w-6" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
