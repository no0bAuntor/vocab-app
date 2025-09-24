# MongoDB Backend Setup Guide

## 🚀 Quick Start

### 1. MongoDB Atlas Setup (Free)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create new cluster (choose free tier M0)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like): 
     ```
     mongodb+srv://username:password@cluster0.mongodb.net/vocabulary-master?retryWrites=true&w=majority
     ```

3. **Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Create username/password
   - Grant "Read and write to any database" permission

4. **Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow access from anywhere" (for development)

### 2. Backend Installation

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env file with your details:
   MONGODB_URI=your-mongodb-connection-string-here
   JWT_SECRET=your-super-secure-random-string-32-plus-characters
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

3. **Generate JWT Secret**
   ```bash
   # Use Node.js to generate secure key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Start Backend Server**
   ```bash
   # Development mode (auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test Backend**
   - Open browser: `http://localhost:5000/api/health`
   - Should see: `{"status":"OK","message":"Vocabulary Master API is running"}`

### 3. Frontend Update

The React app needs to be updated to use the backend API instead of localStorage.

**Key Changes:**
- AuthContext will make API calls to `/api/auth/login`, `/api/auth/register`
- Progress tracking will sync with `/api/progress/update-quiz`
- JWT tokens stored in localStorage for authentication

### 4. API Endpoints

#### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### Progress
- `POST /api/progress/update-quiz` - Update quiz score
- `GET /api/progress/me` - Get user progress
- `GET /api/progress/leaderboard` - Get leaderboard
- `POST /api/progress/achievement` - Add achievement

#### User Management
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/settings` - Update user settings
- `PATCH /api/user/profile` - Update user profile

### 5. Deployment Options

#### Option A: Railway (Recommended - Free Tier)
1. Connect GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

#### Option B: Heroku
1. Create Heroku app
2. Add MongoDB Atlas add-on or use connection string
3. Deploy via Git

#### Option C: Vercel Serverless Functions
1. Convert Express routes to Vercel API functions
2. Deploy frontend + backend together

### 6. Security Features ✅

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: Prevent brute force attacks
- **CORS Protection**: Only allow requests from your frontend
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protected

### 7. Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed),
  email: String (optional),
  profile: {
    totalXP: Number,
    level: Number,
    achievements: Array
  },
  progress: {
    unlockedPhases: Array,
    phaseScores: Object,
    currentPhase: Number
  },
  settings: {
    darkMode: Boolean,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

## ✨ Features

- **Universal Access**: Login from any device
- **Progress Sync**: Quiz scores sync across devices  
- **Leaderboard**: Compare progress with other users
- **Achievements**: Earn badges for milestones
- **Secure**: Password hashing, JWT tokens, rate limiting
- **Scalable**: MongoDB handles thousands of users

## 🔧 Development

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies  
cd .. && npm install

# Start backend (in server folder)
npm run dev

# Start frontend (in root folder)
npm start
```

Backend runs on: `http://localhost:5000`
Frontend runs on: `http://localhost:3000`

## 📊 Monitoring

- Check `/api/health` for server status
- Monitor MongoDB Atlas dashboard for database metrics
- Use browser dev tools to inspect API calls

Ready to make vocabulary learning universal! 🌍📚