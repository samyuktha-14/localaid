# ⚡ LocalAid - Quick Start (5 Minutes)

## Prerequisites
- Node.js installed
- MongoDB installed or MongoDB Atlas account

## 🚀 Fast Setup

### Terminal 1 - Backend
```cmd
cd backend
npm install
copy .env.example .env
notepad .env
```

**Edit .env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localaid
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Start MongoDB (if local):**
```cmd
net start MongoDB
```

**Run backend:**
```cmd
npm run dev
```

### Terminal 2 - Frontend
```cmd
cd frontend
npm install
copy .env.example .env
notepad .env
```

**Edit .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Run frontend:**
```cmd
npm start
```

## ✅ Test It

1. Open http://localhost:3000
2. Click "Sign Up"
3. Register with:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Phone: +91 1234567890
   - Neighborhood: Anna Nagar
   - Fill address details
4. Check backend console for OTP (6-digit code)
5. Enter OTP to verify
6. Create a post and explore!

## 🎯 Key URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 📱 Default Test Data

Use these for testing:

**User 1:**
- Email: samyuktha@localaid.com
- Password: test123
- Neighborhood: Anna Nagar

**User 2:**
- Email: helper@localaid.com  
- Password: test123
- Neighborhood: Anna Nagar

Create both accounts to test the helping workflow!

## 🐛 Common Issues

**Can't connect to MongoDB?**
```cmd
net start MongoDB
```

**Port already in use?**
Change PORT in backend `.env` to 5001

**OTP not visible?**
Check the backend terminal console for: `📧 OTP for ...`

## 📖 Next Steps

- Read `README.md` for full documentation
- Check `FEATURES.md` for complete feature list
- See `SETUP.md` for detailed troubleshooting

---

Happy helping! 🏘️❤️
