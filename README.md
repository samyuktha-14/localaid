# 🏘️ LocalAid - Hyperlocal Community Support Platform

LocalAid is a web application that connects neighbors to request or offer help within their community. Think of it as a local, trust-based micro-community network for food sharing, tool lending, tutoring, and more.

![LocalAid](https://img.shields.io/badge/LocalAid-Community%20Support-red)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

## ✨ Features

### 🔐 Trust & Safety First
- **Address Verification**: OTP-based postal PIN verification
- **Profile Badges**: "Verified Neighbor," "Top Helper," "Community Elder," "Emergency Responder"
- **Reputation System**: Two-way rating system (like Uber)
- **Karma Points**: Earn points for helping neighbors

### 🗺️ Map-Based Community View
- Live map showing nearby help requests & offers
- Color-coded pins (🔴 requests, 🟢 offers)
- Filter by category (food, transport, tools, tutoring, etc.)
- Geolocation-based post creation

### 🎯 Gamified Helping
- Earn karma points for each verified help completed
- Weekly leaderboards ("Top 5 Helpers in Anna Nagar")
- Achievement badges for milestones
- Profile stats tracking

### 🚨 Emergency Mode
- One-tap emergency broadcast to verified neighbors
- Time-limited alerts (auto-expire in 2 hours)
- Real-time notifications via Socket.IO
- Emergency types: Medical, Safety, Lost Pet, Elderly Help

### 🎨 Beautiful UI/UX
- Warm & friendly pastel tones
- Rounded cards with smooth transitions
- Empathetic icons using Lucide React
- Local-first design - shows neighborhood name prominently
- Fully responsive design

## 🛠️ Tech Stack

**Frontend:**
- React 18.2
- React Router DOM 6
- Tailwind CSS 3
- Lucide React (icons)
- React Leaflet (maps)
- Axios
- Socket.IO Client

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO (real-time)
- bcryptjs (password hashing)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
cd LocalAid1
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your settings
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/localaid
# JWT_SECRET=your_secret_key_here
# NODE_ENV=development

# Start MongoDB (if running locally)
# mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_SOCKET_URL=http://localhost:5000

# Start the frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 🚀 Usage

### 1. Register an Account
- Visit `http://localhost:3000`
- Click "Sign Up"
- Fill in your details (name, email, password, neighborhood, address)
- Allow location access for better experience

### 2. Verify Your Address
- You'll receive a 6-digit OTP (check console in development mode)
- Enter the OTP to verify your account
- Get your "Verified Neighbor" badge!

### 3. Explore Features

**Create a Post:**
- Click the "+" icon in the navbar
- Choose "Request Help" or "Offer Help"
- Select category and fill details
- Submit with your current location

**Browse Community Feed:**
- View all posts in your neighborhood
- Filter by type (request/offer) and category
- Switch between feed view and map view
- Click on posts to see details and respond

**Help Someone:**
- Browse requests in your area
- Click "Respond" to offer help
- Wait for the post author to assign you
- Complete the task and earn karma!

**Emergency Alerts:**
- Click the bell icon for emergencies
- Create urgent alerts for immediate help
- Respond to neighbors' emergencies
- Earn bonus karma for emergency response

**Profile & Leaderboard:**
- View your karma, badges, and stats
- Check the weekly leaderboard
- See your post history and ratings
- Compete to be a top helper!

## 📱 Features in Detail

### Post Categories
- 🍽️ **Food Sharing** - Share meals or request food
- 🚗 **Transport** - Rides, deliveries, vehicle help
- 🔧 **Tool Lending** - Borrow/lend tools and equipment
- 📚 **Tutoring** - Educational help and mentoring
- 👶 **Childcare** - Babysitting and child support
- 🐾 **Pet Care** - Pet sitting, walking, vet trips
- 🏥 **Healthcare** - Medical assistance, pharmacy runs
- 💡 **Other** - Miscellaneous help

### Karma System
- **+10 karma** - Complete a help request
- **+20 karma** - Respond to emergency
- **+5 karma** - Receive 4+ star rating
- Unlock badges at milestones (10, 50 helps)

### Badges
- 🛡️ **Verified Neighbor** - Address verified
- 🏆 **Top Helper** - 10+ helps completed
- 👑 **Community Elder** - 50+ helps completed
- 🚨 **Emergency Responder** - Responded to emergencies
- ❤️ **Kind Heart** - Consistently high ratings

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- OTP verification for new users
- Location-based access control
- Rate limiting on sensitive endpoints
- Input validation and sanitization

## 🗂️ Project Structure

```
LocalAid1/
├── backend/
│   ├── models/          # MongoDB schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Emergency.js
│   │   └── Rating.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── posts.js
│   │   └── emergency.js
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── Navbar.js
    │   │   ├── PostCard.js
    │   │   ├── Badge.js
    │   │   └── MapView.js
    │   ├── pages/       # Page components
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── VerifyOTP.js
    │   │   ├── Home.js
    │   │   ├── CreatePost.js
    │   │   ├── PostDetail.js
    │   │   ├── Profile.js
    │   │   └── Emergency.js
    │   ├── context/     # React context
    │   │   └── AuthContext.js
    │   ├── utils/       # Utilities
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/me` - Get current user

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/neighborhood/:neighborhood` - Get posts by neighborhood
- `GET /api/posts/nearby` - Get nearby posts (geospatial)
- `GET /api/posts/:postId` - Get single post
- `POST /api/posts/:postId/respond` - Respond to post
- `POST /api/posts/:postId/assign/:helperId` - Assign helper
- `POST /api/posts/:postId/complete` - Mark as complete
- `POST /api/posts/:postId/rate` - Rate interaction

### Emergency
- `POST /api/emergency/alert` - Create emergency alert
- `GET /api/emergency/neighborhood/:neighborhood` - Get active emergencies
- `POST /api/emergency/:emergencyId/respond` - Respond to emergency
- `POST /api/emergency/:emergencyId/resolve` - Resolve emergency

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/leaderboard/:neighborhood` - Get leaderboard

## 🐛 Development Tips

### MongoDB Connection Issues
If MongoDB connection fails:
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or run mongod directly
mongod --dbpath="C:\data\db"
```

### CORS Issues
Make sure backend CORS is configured:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### OTP in Development
During development, OTP is logged to console:
```bash
📧 OTP for user@example.com: 123456
```

### Location Access
Grant location permission in browser for full functionality.

## 🚢 Deployment

### Backend (Render/Railway)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in environment variables
3. Set `NODE_ENV=production`
4. Deploy backend

### Frontend (Vercel/Netlify)
1. Update `REACT_APP_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `build` folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and building communities!

## 💡 Future Enhancements

- [ ] Real-time chat between users
- [ ] Push notifications (PWA)
- [ ] Image upload for posts
- [ ] Community events calendar
- [ ] Local business partnerships for karma rewards
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced search and filters
- [ ] Community guidelines and moderation

## 👥 Credits

Built with ❤️ for creating stronger, more connected communities.

**Developer:** Samyuktha Selvaraj  
**Project:** LocalAid - Hyperlocal Community Support Platform

---

**Remember:** Small acts of kindness can make a big difference in your community! 🌟
