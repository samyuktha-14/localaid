import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../components/Navbar';
import Badge from '../components/Badge';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../utils/api';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [showChat, setShowChat] = useState(false);

  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getById(postId);
      setPost(response.data.post);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await postAPI.respond(postId, responseMessage);
      setResponseMessage('');
      fetchPost(); // Refresh post data
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send response');
    }

    setSubmitting(false);
  };

  const handleAssignHelper = async (helperId) => {
    try {
      await postAPI.assign(postId, helperId);
      fetchPost();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to assign helper');
    }
  };

  const handleComplete = async () => {
    try {
      await postAPI.complete(postId);
      fetchPost();
      setShowRating(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to mark as complete');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await postAPI.rate(postId, rating, ratingComment);
      setShowRating(false);
      setRatingComment('');
      alert('Thank you for your feedback! 🌟');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit rating');
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = post.author._id === user.id;
  const isAssigned = post.assignedTo?._id === user.id;
  const canComplete = isAuthor || isAssigned;
  const canChat = (isAuthor || isAssigned) && post.assignedTo;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Feed</span>
        </button>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Post Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full cursor-pointer"
                onClick={() => navigate(`/profile/${post.author._id}`)}
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{post.author.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{post.author.ratings?.average?.toFixed(1) || '0.0'}</span>
                  <span>•</span>
                  <span>{post.author.karma} karma</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.author.badges?.map((badge, idx) => (
                    <Badge key={idx} badge={badge} size="sm" />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  post.type === 'request'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {post.type === 'request' ? '🙏 Need Help' : '🤝 Offering Help'}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  post.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : post.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {post.status === 'completed' ? '✓ Completed' : 
                 post.status === 'in-progress' ? '⏳ In Progress' : '🔵 Active'}
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <p className="text-gray-700 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
            {post.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{post.neighborhood}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                post.urgency === 'high' ? 'bg-red-100 text-red-700' :
                post.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {post.urgency} urgency
              </span>
            </div>
          </div>

          {/* Assigned Helper */}
          {post.assignedTo && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900 mb-2">Assigned Helper:</p>
              <div className="flex items-center gap-3">
                <img
                  src={post.assignedTo.avatar}
                  alt={post.assignedTo.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{post.assignedTo.name}</p>
                  <p className="text-sm text-gray-600">{post.assignedTo.karma} karma</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {canChat && (
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Chat with {isAuthor ? 'Helper' : 'Help Seeker'}
              </button>
            )}
            {post.status !== 'completed' && canComplete && (
              <button
                onClick={handleComplete}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* Rating Form - Only for Post Author */}
        {showRating && post.status === 'completed' && isAuthor && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Helper</h3>
            <p className="text-sm text-gray-600 mb-4">How was your experience with {post.assignedTo?.name}?</p>
            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="text-3xl"
                    >
                      {value <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600"
              >
                Submit Rating
              </button>
            </form>
          </div>
        )}

        {/* Responses */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Responses ({post.responses?.length || 0})
          </h3>

          {/* Response Form */}
          {post.status === 'active' && !isAuthor && (
            <form onSubmit={handleRespond} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Offer your help or ask a question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send
                </button>
              </div>
            </form>
          )}

          {/* Response List */}
          <div className="space-y-4">
            {post.responses?.length > 0 ? (
              post.responses.map((response, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={response.user.avatar}
                    alt={response.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{response.user.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {isAuthor && post.status === 'active' && !post.assignedTo && (
                        <button
                          onClick={() => handleAssignHelper(response.user._id)}
                          className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{response.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No responses yet. Be the first to help!
              </p>
            )}
          </div>
        </div>

        {/* Chat Box */}
        <ChatBox 
          postId={postId} 
          isOpen={showChat} 
          onClose={() => setShowChat(false)} 
        />
      </div>
    </div>
  );
};

export default PostDetail;
