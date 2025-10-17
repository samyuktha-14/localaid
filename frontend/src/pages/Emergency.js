import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, MapPin, Clock, Users, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';
import { emergencyAPI } from '../utils/api';

const Emergency = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'medical',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmergencies();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchEmergencies, 30000);
    return () => clearInterval(interval);
  }, [user?.neighborhood]);

  const fetchEmergencies = async () => {
    try {
      const response = await emergencyAPI.getByNeighborhood(user.neighborhood);
      setEmergencies(response.data.emergencies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const alertData = {
              ...formData,
              location: {
                coordinates: [longitude, latitude],
              },
            };

            await emergencyAPI.createAlert(alertData);
            setShowCreateForm(false);
            setFormData({ type: 'medical', message: '' });
            fetchEmergencies();
          } catch (error) {
            setError(error.response?.data?.error || 'Failed to create emergency alert');
          }

          setSubmitting(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Please enable location access for emergency alerts');
          setSubmitting(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setSubmitting(false);
    }
  };

  const handleRespond = async (emergencyId) => {
    try {
      await emergencyAPI.respond(emergencyId);
      fetchEmergencies();
      alert('Your response has been recorded! The person in need can see your contact info now. 🚨');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to respond');
    }
  };

  const handleResolve = async (emergencyId) => {
    try {
      await emergencyAPI.resolve(emergencyId);
      fetchEmergencies();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resolve emergency');
    }
  };

  const emergencyTypes = {
    medical: { emoji: '🏥', label: 'Medical Emergency', color: 'bg-red-100 text-red-700' },
    safety: { emoji: '🚨', label: 'Safety Issue', color: 'bg-orange-100 text-orange-700' },
    'lost-pet': { emoji: '🐾', label: 'Lost Pet', color: 'bg-yellow-100 text-yellow-700' },
    'elderly-help': { emoji: '👴', label: 'Elderly Help', color: 'bg-purple-100 text-purple-700' },
    other: { emoji: '⚠️', label: 'Other Emergency', color: 'bg-gray-100 text-gray-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Feed</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell className="h-8 w-8 text-red-500" />
                Emergency Alerts
              </h1>
              <p className="text-gray-600 mt-2">
                Help your neighbors in urgent situations
              </p>
            </div>

            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <AlertCircle className="h-5 w-5" />
                Create Emergency Alert
              </button>
            )}
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Emergency Use Only</p>
              <p className="text-sm text-yellow-800 mt-1">
                Please use this feature only for genuine emergencies. For life-threatening situations, 
                always call emergency services first (911, 108, etc.).
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Create Emergency Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Emergency Alert</h2>

            <form onSubmit={handleCreateAlert} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Emergency Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(emergencyTypes).map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: key })}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.type === key
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{value.emoji}</div>
                      <div className="text-sm font-medium text-gray-900">{value.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the Emergency
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  placeholder="Be specific about what help you need..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ type: 'medical', message: '' });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending Alert...' : 'Send Emergency Alert 🚨'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Emergency Alerts */}
        {emergencies.filter(e => e.user._id === user.id).length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Emergency Alert</h2>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
              {emergencies
                .filter((emergency) => emergency.user._id === user.id)
                .map((emergency) => {
                  const typeInfo = emergencyTypes[emergency.type];
                  return (
                    <div key={emergency._id}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{typeInfo.emoji}</span>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{typeInfo.label}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatDistanceToNow(new Date(emergency.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${typeInfo.color}`}>
                          ACTIVE
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 font-medium">{emergency.message}</p>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-green-600" />
                          <span className="font-bold text-gray-900">
                            {emergency.responders?.length || 0} People Are Coming to Help!
                          </span>
                        </div>
                        {emergency.responders?.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {emergency.responders.map((responder, idx) => (
                              <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                                <img
                                  src={responder.user.avatar}
                                  alt={responder.user.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">{responder.user.name}</p>
                                  <p className="text-xs text-gray-600">
                                    {responder.user.phone && `📞 ${responder.user.phone}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleResolve(emergency._id)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
                      >
                        ✓ Mark as Resolved
                      </button>

                      <p className="text-xs text-gray-600 text-center mt-3">
                        Expires {formatDistanceToNow(new Date(emergency.expiresAt), { addSuffix: true })}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Active Emergencies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Emergency List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Emergencies Near You ({emergencies.filter(e => e.user._id !== user.id).length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : emergencies.filter(e => e.user._id !== user.id).length > 0 ? (
              emergencies
                .filter((emergency) => emergency.user._id !== user.id)
                .map((emergency) => {
                  const typeInfo = emergencyTypes[emergency.type];
                  const hasResponded = emergency.responders?.some(
                    (r) => r.user._id === user.id
                  );

                  return (
                  <div
                    key={emergency._id}
                    className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emergency.user.avatar}
                          alt={emergency.user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{emergency.user.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>
                              {formatDistanceToNow(new Date(emergency.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                        {typeInfo.emoji} {typeInfo.label}
                      </span>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 mb-4">{emergency.message}</p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{emergency.neighborhood}</span>
                    </div>

                    {/* Responders */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {emergency.responders?.length || 0} responder(s)
                      </span>
                    </div>

                    {/* Actions */}
                    {hasResponded ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-green-700 font-medium">
                          ✓ You've responded to this emergency
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRespond(emergency._id)}
                        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        I Can Help! 🚨
                      </button>
                    )}

                    {/* Expiration Notice */}
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Expires {formatDistanceToNow(new Date(emergency.expiresAt), { addSuffix: true })}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-gray-500">No active emergencies in your neighborhood</p>
                <p className="text-sm text-gray-400 mt-2">That's a good sign!</p>
              </div>
            )}
          </div>

          {/* Map View */}
          <div className="lg:sticky lg:top-24 h-[600px]">
            <MapView
              posts={[]}
              emergencies={emergencies}
              center={
                user?.address?.coordinates
                  ? [user.address.coordinates.lat, user.address.coordinates.lng]
                  : [13.0827, 80.2707]
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
