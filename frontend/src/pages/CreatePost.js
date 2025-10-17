import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../utils/api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    type: 'request',
    category: 'food',
    title: '',
    description: '',
    urgency: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');

  const { user } = useAuth();
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
    setLocationStatus('Getting your location...');

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const postData = {
              ...formData,
              location: {
                coordinates: [longitude, latitude], // MongoDB expects [lng, lat]
              },
            };

            await postAPI.create(postData);
            setLocationStatus('Post created successfully!');
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } catch (error) {
            setError(error.response?.data?.error || 'Failed to create post');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Please enable location access to create a post');
          setLocationStatus('');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationStatus('');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Feed</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create a Post</h1>
          <p className="text-gray-600 mt-2">
            Request help or offer assistance to your neighbors
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {locationStatus && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">{locationStatus}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What would you like to do?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'request' })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === 'request'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🙏</div>
                  <div className="font-semibold text-gray-900">Request Help</div>
                  <div className="text-sm text-gray-500">I need assistance</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'offer' })}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === 'offer'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="font-semibold text-gray-900">Offer Help</div>
                  <div className="text-sm text-gray-500">I can assist others</div>
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="food">🍽️ Food Sharing</option>
                <option value="transport">🚗 Transport</option>
                <option value="tools">🔧 Tool Lending</option>
                <option value="tutoring">📚 Tutoring</option>
                <option value="childcare">👶 Childcare</option>
                <option value="petcare">🐾 Pet Care</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="other">💡 Other</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Brief, clear title (e.g., 'Need help moving furniture')"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                placeholder="Provide more details about what you need or what you're offering..."
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'low' })}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    formData.urgency === 'low'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Low</div>
                  <div className="text-xs">Can wait</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'medium' })}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    formData.urgency === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Medium</div>
                  <div className="text-xs">Soon</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'high' })}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    formData.urgency === 'high'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">High</div>
                  <div className="text-xs">Urgent</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Tip:</strong> Be specific and clear in your description. The more details you provide, 
            the easier it is for neighbors to help! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
