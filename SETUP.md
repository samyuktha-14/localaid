# 🚀 LocalAid - Quick Setup Guide

## Step-by-Step Installation

### 1. Install MongoDB

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

**Alternative:** Use MongoDB Atlas (cloud):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

### 2. Backend Setup

Open Command Prompt in the project folder:

```cmd
cd backend

rem Install dependencies
npm install

rem Create .env file
copy .env.example .env

rem Open .env in notepad and configure:
notepad .env
```

**Configure .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localaid
JWT_SECRET=localaid_secret_key_change_this_in_production
NODE_ENV=development
```

**Start backend:**
```cmd
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### 3. Frontend Setup

Open a NEW Command Prompt:

```cmd
cd frontend

rem Install dependencies
npm install

rem Create .env file
copy .env.example .env

rem Open .env in notepad and configure:
notepad .env
```

**Configure .env file:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Start frontend:**
```cmd
npm start
```

Browser will automatically open at `http://localhost:3000`

### 4. Test the Application

1. **Register an account:**
   - Click "Sign Up"
   - Fill in your details
   - Use neighborhood: "Anna Nagar" (or any name)
   - Allow location access when prompted

2. **Verify with OTP:**
   - Check the backend console for the OTP
   - Look for: `📧 OTP for your@email.com: 123456`
   - Enter the 6-digit code

3. **Create your first post:**
   - Click the "+" icon
   - Choose "Request Help" or "Offer Help"
   - Fill in the details
   - Submit!

4. **Explore features:**
   - Browse the community feed
   - Switch to map view
   - Check the leaderboard
   - Visit your profile

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error
```

**Solution:**
1. Make sure MongoDB is running:
   ```cmd
   net start MongoDB
   ```
2. Or start manually:
   ```cmd
   mongod --dbpath="C:\data\db"
   ```
3. Check if `MONGODB_URI` in `.env` is correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
1. Kill the process using the port:
   ```cmd
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```
2. Or change the port in backend `.env`

### CORS Error in Browser
```
Access to XMLHttpRequest at 'http://localhost:5000' blocked by CORS policy
```

**Solution:**
1. Make sure backend is running
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Restart both servers

### Location Access Denied
**Solution:**
1. Click the location icon in browser address bar
2. Allow location access
3. Refresh the page

### npm install fails
**Solution:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. If still fails, try:
   ```cmd
   npm cache clean --force
   npm install
   ```

## 📱 Using the App

### Create Posts Efficiently
- Be specific in titles
- Add detailed descriptions
- Set appropriate urgency level
- Allow location access for better matching

### Earn Karma Fast
1. Respond to requests quickly
2. Complete assigned tasks
3. Get good ratings (4-5 stars)
4. Help in emergencies (+20 karma!)

### Emergency Alerts
- Only for genuine emergencies
- Call 911/108 for life-threatening situations
- Use for: medical help, safety issues, lost pets, elderly assistance

### Rate Interactions
- Always rate after completing a task
- Be fair and honest
- Leave helpful comments
- Good ratings help build trust

## 🎯 Development Mode

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes reflect immediately
- Backend: Using nodemon, auto-restarts on file changes

### Development OTP
In development, OTP is displayed in the backend console:
```
📧 OTP for samyuktha@example.com: 123456
```

### MongoDB Compass
Install MongoDB Compass to view your database:
https://www.mongodb.com/products/compass

Connect to: `mongodb://localhost:27017`

## 🎨 Customization

### Change Theme Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    // ...
  }
}
```

### Add New Categories
1. Update `backend/models/Post.js`:
   ```javascript
   category: {
     type: String,
     enum: ['food', 'transport', 'your-category']
   }
   ```

2. Update frontend components with category info

### Modify Karma Points
Edit `backend/routes/posts.js`:
```javascript
helper.karma += 20; // Change the value
```

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Look at error messages in console
3. Verify all environment variables
4. Ensure MongoDB is running
5. Check that both servers are started

## 🌟 Next Steps

Once everything is working:
1. Create multiple test accounts
2. Post different types of requests/offers
3. Test the rating system
4. Try emergency alerts
5. Check the leaderboard
6. Explore the map view

Happy helping! 🏘️❤️
