import React from 'react';
import { Shield, Trophy, Crown, AlertCircle, Heart } from 'lucide-react';

const badgeConfig = {
  'Verified Neighbor': {
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600',
  },
  'Top Helper': {
    icon: Trophy,
    color: 'bg-yellow-100 text-yellow-700',
    iconColor: 'text-yellow-600',
  },
  'Community Elder': {
    icon: Crown,
    color: 'bg-purple-100 text-purple-700',
    iconColor: 'text-purple-600',
  },
  'Emergency Responder': {
    icon: AlertCircle,
    color: 'bg-red-100 text-red-700',
    iconColor: 'text-red-600',
  },
  'Kind Heart': {
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    iconColor: 'text-pink-600',
  },
};

const Badge = ({ badge, size = 'sm' }) => {
  const config = badgeConfig[badge] || badgeConfig['Verified Neighbor'];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      <span>{badge}</span>
    </span>
  );
};

export default Badge;
