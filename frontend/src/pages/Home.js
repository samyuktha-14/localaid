import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, MapIcon, List, Trophy, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import MapView from '../components/MapView';
import { useAuth } from '../context/AuthContext';
import { postAPI, emergencyAPI, userAPI } from '../utils/api';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('feed'); // 'feed' or 'map'
  const [filter, setFilter] = useState({
    type: 'all',
    category: 'all',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.neighborhood) {
      fetchData();
    }
  }, [user?.neighborhood, filter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch posts
      const postsParams = {};
      if (filter.type !== 'all') postsParams.type = filter.type;
      if (filter.category !== 'all') postsParams.category = filter.category;

      console.log('🔍 Fetching posts for:', user.neighborhood, 'with params:', postsParams);
      
      const postsResponse = await postAPI.getByNeighborhood(
        user.neighborhood,
        postsParams
      );
      
      console.log('📦 Received posts:', postsResponse.data.posts.length);
      console.log('📋 Posts data:', postsResponse.data.posts);
      
      setPosts(postsResponse.data.posts);

      // Fetch active emergencies
      const emergenciesResponse = await emergencyAPI.getByNeighborhood(
        user.neighborhood
      );
      setEmergencies(emergenciesResponse.data.emergencies);

      // Fetch leaderboard
      const leaderboardResponse = await userAPI.getLeaderboard(user.neighborhood, 5);
      setLeaderboard(leaderboardResponse.data.leaders);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const getMapCenter = () => {
    if (user?.address?.coordinates) {
      return [user.address.coordinates.lat, user.address.coordinates.lng];
    }
    return [13.0827, 80.2707]; // Default to Chennai
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Community Feed
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {posts.filter(post => post.author._id !== user.id).length} {filter.type === 'request' ? 'requests' : filter.type === 'offer' ? 'offers' : 'posts'} in {user?.neighborhood}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchData()}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('feed')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'feed'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MapIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-4">
                <Filter className="h-5 w-5 text-gray-400" />
                
                <select
                  value={filter.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="request">Requests</option>
                  <option value="offer">Offers</option>
                </select>

                <select
                  value={filter.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="food">🍽️ Food</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="tools">🔧 Tools</option>
                  <option value="tutoring">📚 Tutoring</option>
                  <option value="childcare">👶 Childcare</option>
                  <option value="petcare">🐾 Pet Care</option>
                  <option value="healthcare">🏥 Healthcare</option>
                  <option value="other">💡 Other</option>
                </select>

                <div className="ml-auto text-sm text-gray-500">
                  🔴 Requests | 🟢 Offers
                </div>
              </div>
            </div>

            {/* Emergency Alert Banner */}
            {emergencies.filter(e => e.user._id !== user.id).length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-red-900 flex items-center gap-2">
                      🚨 {emergencies.filter(e => e.user._id !== user.id).length} Active Emergency Alert{emergencies.filter(e => e.user._id !== user.id).length > 1 ? 's' : ''}
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Your neighbors need immediate help!
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/emergency')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  >
                    Respond
                  </button>
                </div>
              </div>
            )}

            {/* Content View */}
            {viewMode === 'feed' ? (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                ) : posts.filter(post => post.author._id !== user.id).length > 0 ? (
                  posts
                    .filter(post => post.author._id !== user.id)
                    .map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-gray-500">No posts found. Be the first to help!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px]">
                <MapView
                  posts={posts.filter(post => post.author._id !== user.id)}
                  emergencies={emergencies.filter(e => e.user._id !== user.id)}
                  center={getMapCenter()}
                  onMarkerClick={(post) => navigate(`/post/${post._id}`)}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Top Helpers
                </h2>
              </div>

              <div className="space-y-3">
                {leaderboard.map((leader, index) => (
                  <div
                    key={leader._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/profile/${leader._id}`)}
                  >
                    <div className="flex-shrink-0">
                      <span className="text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                    </div>
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {leader.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {leader.karma} karma • {leader.helpedCount} helps
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-primary-100">Total Karma</p>
                  <p className="text-3xl font-bold">{user?.karma || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-100">People Helped</p>
                  <p className="text-3xl font-bold">{user?.helpedCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-100">Badges Earned</p>
                  <p className="text-3xl font-bold">{user?.badges?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
