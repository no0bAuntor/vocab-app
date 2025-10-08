# Render Deployment Instructions (Separate Frontend & Backend)

## 🚀 Quick Fix for Login Issue

You have two separate Render services:
- **Frontend**: `https://vocab-app-1.onrender.com` (Static Site)
- **Backend**: `https://vocab-app-ujb5.onrender.com` (Web Service)

### Step 1: Configure Backend Service (`vocab-app-ujb5`)

Go to your backend service on Render:

1. **Environment Variables** (Environment tab):
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your-mongodb-connection-string`
   - `JWT_SECRET` = `your-secret-key`
   - `FRONTEND_URL` = `https://vocab-app-1.onrender.com`
   
2. Click **"Save Changes"**

### Step 2: Configure Frontend Service (`vocab-app-1`)

Go to your frontend service on Render:

1. **Environment Variables** (Environment tab):
   - `REACT_APP_API_URL` = `https://vocab-app-ujb5.onrender.com/api`
   
2. Click **"Save Changes"**

### Step 3: Deploy

1. **Push these changes to GitHub**:
   ```bash
   git add .
   git commit -m "Fix CORS and API URL for separate Render deployments"
   git push origin main
   ```

2. **Both services will auto-redeploy**, or manually trigger:
   - Backend: Redeploy from Render dashboard
   - Frontend: Redeploy from Render dashboard

### Step 4: Test

Once both deployed:
1. Visit: `https://vocab-app-1.onrender.com`
2. Try logging in - it should work now!

---

## 🔧 What Was Changed

1. **Backend (`server/server.js`)**:
   - Added both frontend URLs to CORS whitelist:
     - `https://vocab-app-1.onrender.com` (your frontend)
     - `https://vocab-app-ujb5.onrender.com` (backend itself)

2. **Frontend (`src/services/api.js`)**:
   - Already configured to use `REACT_APP_API_URL` environment variable
   - Will point to backend when you set the env var on Render

3. **Environment Files** (created):
   - `.env.production` - Frontend environment variable reference
   - `server/.env.production.example` - Backend environment variable reference

---

## 🐛 Troubleshooting

### If login still doesn't work after deployment:

1. **Verify Frontend Environment Variable**:
   - Go to Render → `vocab-app-1` → Environment
   - Make sure `REACT_APP_API_URL=https://vocab-app-ujb5.onrender.com/api`
   - Redeploy frontend after adding

2. **Verify Backend Environment Variable**:
   - Go to Render → `vocab-app-ujb5` → Environment  
   - Make sure `FRONTEND_URL=https://vocab-app-1.onrender.com`
   - Redeploy backend after adding

3. **Check Backend Logs**:
   - Go to Render dashboard → `vocab-app-ujb5` → Logs
   - Look for CORS errors or connection issues

4. **Check Browser Console** (F12):
   - Network tab: Is the request going to `https://vocab-app-ujb5.onrender.com/api/auth/login`?
   - Console tab: Any CORS errors?
   - If you see CORS error: Backend needs to redeploy with new CORS config

5. **Test Backend Directly**:
   - Visit: `https://vocab-app-ujb5.onrender.com/api/health`
   - Should return: `{"status":"OK",...}`

---

## ⚡ Free Tier Notes

**Important**: Render free tier services sleep after 15 minutes of inactivity.

- **First request after sleep**: Takes 30-60 seconds to wake up
- **Symptom**: Login appears to hang/buffer for a long time
- **Solution**: Wait patiently for the first request, then it's fast

This is normal behavior for free tier, not a bug!

---

## � Quick Reference

### Frontend Service (vocab-app-1)
- **Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variable**: 
  ```
  REACT_APP_API_URL=https://vocab-app-ujb5.onrender.com/api
  ```

### Backend Service (vocab-app-ujb5)
- **Type**: Web Service
- **Build Command**: `npm install`
- **Start Command**: `node server/server.js`
- **Environment Variables**:
  ```
  NODE_ENV=production
  MONGODB_URI=<your-mongodb-uri>
  JWT_SECRET=<your-secret>
  FRONTEND_URL=https://vocab-app-1.onrender.com
  ```

---

Need help? Let me know which step isn't working!
