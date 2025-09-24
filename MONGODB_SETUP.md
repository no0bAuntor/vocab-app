# 🚀 MongoDB Atlas Setup Guide

Follow these steps to set up your free MongoDB Atlas database for the Vocabulary Master app.

## Step 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for a free account
3. **Verify your email** address

## Step 2: Create a New Cluster

1. **Click "Create Cluster"**
2. **Select "Shared" (Free tier)**
3. **Choose cloud provider**: AWS, Google Cloud, or Azure (AWS recommended)
4. **Select region**: Choose closest to your location
5. **Cluster name**: Leave default or name it `vocabulary-master`
6. **Click "Create Cluster"** (takes 1-3 minutes)

## Step 3: Create Database User

1. **Go to "Database Access"** (left sidebar)
2. **Click "Add New Database User"**
3. **Authentication Method**: Password
4. **Username**: Choose a username (e.g., `vocab-admin`)
5. **Password**: Generate secure password (save this!)
6. **Database User Privileges**: Select "Read and write to any database"
7. **Click "Add User"**

## Step 4: Configure Network Access

1. **Go to "Network Access"** (left sidebar)
2. **Click "Add IP Address"**
3. **For development**: Click "Allow access from anywhere" (0.0.0.0/0)
4. **For production**: Add your specific IP address
5. **Click "Confirm"**

## Step 5: Get Connection String

1. **Go to "Clusters"** (left sidebar)
2. **Click "Connect"** on your cluster
3. **Choose "Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. **Copy the connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

## Step 6: Update Backend Environment

1. **Navigate to server folder**:
   ```bash
   cd server
   ```

2. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file** with your details:
   ```env
   # Replace with your actual connection string
   MONGODB_URI=mongodb+srv://vocab-admin:your-password@cluster0.xxxxx.mongodb.net/vocabulary-master?retryWrites=true&w=majority
   
   # Generate a secure JWT secret (32+ characters)
   JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
   
   # Server configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Generate secure JWT secret**:
   ```bash
   # Run this in terminal to generate secure key
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 7: Install and Start Backend

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Test backend**: Open http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"Vocabulary Master API is running"}`

## Step 8: Start Frontend

1. **In new terminal, go to root folder**:
   ```bash
   cd ..
   ```

2. **Start React app**:
   ```bash
   npm start
   ```

3. **Test the app**: Open http://localhost:3000
   - Try creating a new account
   - Login/logout functionality
   - Quiz progress should sync to MongoDB

## ✅ Verification Steps

### Backend Health Check
- Visit: http://localhost:5000/api/health
- Should return success JSON

### Database Connection
- Check terminal logs for: "✅ Connected to MongoDB Atlas"
- No connection errors

### Frontend Integration  
- Create test account
- Complete quiz
- Check MongoDB Atlas "Collections" tab to see data

## 🎯 Production Deployment

### Backend Deployment (Railway/Heroku)
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically

### Frontend Deployment (Vercel/Netlify)
1. Update `REACT_APP_API_URL` to production backend URL
2. Deploy React app

## 📊 MongoDB Atlas Monitoring

- **Metrics**: View database usage, connections, operations
- **Performance**: Monitor query performance
- **Alerts**: Set up email alerts for issues

## 🔒 Security Best Practices

1. **Strong passwords**: Use complex database user passwords
2. **Network access**: Restrict IP addresses in production
3. **JWT secrets**: Use crypto-generated random strings
4. **Environment variables**: Never commit secrets to version control

## 📞 Support

If you encounter issues:
1. Check MongoDB Atlas status page
2. Review connection string format
3. Verify network access settings
4. Check backend terminal logs for errors

**Success! Your vocabulary app now has universal MongoDB backend! 🌍📚**