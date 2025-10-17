import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different post types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const requestIcon = createCustomIcon('#ef4444'); // Red for requests
const offerIcon = createCustomIcon('#10b981'); // Green for offers
const emergencyIcon = createCustomIcon('#dc2626'); // Dark red for emergencies

const MapView = ({ posts = [], emergencies = [], center = [13.0827, 80.2707], onMarkerClick }) => {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Post markers */}
        {posts.map((post) => {
          if (!post.location?.coordinates) return null;
          
          const [lng, lat] = post.location.coordinates;
          return (
            <Marker
              key={post._id}
              position={[lat, lng]}
              icon={post.type === 'request' ? requestIcon : offerIcon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(post),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{post.description.slice(0, 100)}...</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      post.type === 'request'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {post.type === 'request' ? 'Need Help' : 'Offering Help'}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Emergency markers */}
        {emergencies.map((emergency) => {
          if (!emergency.location?.coordinates) return null;
          
          const [lng, lat] = emergency.location.coordinates;
          return (
            <Marker
              key={emergency._id}
              position={[lat, lng]}
              icon={emergencyIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-500 font-bold">🚨 EMERGENCY</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{emergency.message}</p>
                  <p className="text-xs text-gray-500">
                    {emergency.responders?.length || 0} responders
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
