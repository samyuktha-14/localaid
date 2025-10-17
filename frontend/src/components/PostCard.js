import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Badge from './Badge';

const categoryColors = {
  food: 'bg-pastel-orange',
  transport: 'bg-pastel-blue',
  tools: 'bg-pastel-yellow',
  tutoring: 'bg-pastel-purple',
  childcare: 'bg-pastel-pink',
  petcare: 'bg-pastel-green',
  healthcare: 'bg-red-50',
  other: 'bg-gray-100',
};

const categoryEmojis = {
  food: '🍽️',
  transport: '🚗',
  tools: '🔧',
  tutoring: '📚',
  childcare: '👶',
  petcare: '🐾',
  healthcare: '🏥',
  other: '💡',
};

const typeColors = {
  request: 'border-l-4 border-primary-500',
  offer: 'border-l-4 border-green-500',
};

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post._id}`}>
      <div
        className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 ${
          typeColors[post.type]
        } hover:scale-[1.02]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={post.author?.avatar}
              alt={post.author?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                {post.author?.verified && (
                  <span className="text-xs">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{post.author?.ratings?.average?.toFixed(1) || '0.0'}</span>
                <span>•</span>
                <span>{post.author?.karma || 0} karma</span>
              </div>
            </div>
          </div>

          {/* Category Badge */}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
              categoryColors[post.category]
            }`}
          >
            <span>{categoryEmojis[post.category]}</span>
            <span className="capitalize">{post.category}</span>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{post.neighborhood}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.type === 'request'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {post.type === 'request' ? 'Need Help' : 'Offering Help'}
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Badges */}
        {post.author?.badges && post.author.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.author.badges.slice(0, 2).map((badge, idx) => (
              <Badge key={idx} badge={badge} size="sm" />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PostCard;
