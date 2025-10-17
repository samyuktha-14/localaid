import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Star, Award, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../utils/api';

const Profile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'ratings'

  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const targetUserId = userId || currentUser.id;
  const isOwnProfile = targetUserId === currentUser.id;

  useEffect(() => {
    fetchProfileData();
  }, [targetUserId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch user profile
      const profileResponse = await userAPI.getProfile(targetUserId);
      setProfileUser(profileResponse.data.user);

      // Fetch user's posts
      const postsResponse = await postAPI.getUserPosts(targetUserId);
      setPosts(postsResponse.data.posts);

      // Fetch ratings
      const ratingsResponse = await userAPI.getRatings(targetUserId);
      setRatings(ratingsResponse.data.ratings);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Feed</span>
        </button>

        {/* Profile Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <img
              src={profileUser.avatar}
              alt={profileUser.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
            />

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profileUser.name}</h1>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {profileUser.badges?.map((badge, idx) => (
                  <Badge key={idx} badge={badge} size="md" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-5 w-5" />
                  <span>{profileUser.neighborhood}</span>
                </div>
                {isOwnProfile && (
                  <>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail className="h-5 w-5" />
                      <span>{profileUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Phone className="h-5 w-5" />
                      <span>{profileUser.phone}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Star className="h-5 w-5 fill-white" />
                <span className="text-lg font-semibold">
                  {profileUser.ratings?.average?.toFixed(1) || '0.0'} / 5.0
                </span>
                <span className="text-sm opacity-90">
                  ({profileUser.ratings?.count || 0} ratings)
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{profileUser.karma || 0}</div>
                <div className="text-sm opacity-90">Karma</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{profileUser.helpedCount || 0}</div>
                <div className="text-sm opacity-90">Helped</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{profileUser.badges?.length || 0}</div>
                <div className="text-sm opacity-90">Badges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Karma Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Total Karma</h3>
                <p className="text-2xl font-bold text-yellow-600">{profileUser.karma || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Earned through helping neighbors and positive ratings
            </p>
          </div>

          {/* Helps Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">People Helped</h3>
                <p className="text-2xl font-bold text-green-600">{profileUser.helpedCount || 0}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Completed help requests in the community
            </p>
          </div>

          {/* Rating Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Average Rating</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {profileUser.ratings?.average?.toFixed(1) || '0.0'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Based on {profileUser.ratings?.count || 0} community reviews
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'posts'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'ratings'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ratings ({ratings.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'posts' ? (
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => <PostCard key={post._id} post={post} />)
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.length > 0 ? (
                  ratings.map((rating, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={rating.ratedBy.avatar}
                            alt={rating.ratedBy.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{rating.ratedBy.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-700 text-sm mt-2">{rating.comment}</p>
                      )}
                      {rating.post && (
                        <p className="text-xs text-gray-500 mt-2">
                          For: {rating.post.title}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No ratings yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
