# 🎯 QUICK FIX - Login Issue on Render

## Problem
Login works on `localhost` but times out on `https://vocab-app-1.onrender.com`

## Root Cause
Frontend can't reach the backend API because environment variable is missing.

---

## ✅ Solution (2 Simple Steps)

### Step 1: Set Frontend Environment Variable

1. Go to: https://dashboard.render.com/
2. Click on **"vocab-app-1"** (your frontend service)
3. Click **"Environment"** in left sidebar
4. Click **"Add Environment Variable"**
5. Enter:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://vocab-app-ujb5.onrender.com/api`
6. Click **"Save Changes"**
7. Service will auto-redeploy (wait ~3-5 min)

### Step 2: Set Backend Environment Variable

1. Click on **"vocab-app-ujb5"** (your backend service)
2. Click **"Environment"** in left sidebar
3. Make sure you have these variables (add if missing):
   - **Key**: `FRONTEND_URL` → **Value**: `https://vocab-app-1.onrender.com`
   - **Key**: `NODE_ENV` → **Value**: `production`
   - **Key**: `MONGODB_URI` → **Value**: (your MongoDB connection string)
   - **Key**: `JWT_SECRET` → **Value**: (your secret key)
4. Click **"Save Changes"** if you added any
5. Service will auto-redeploy if needed

---

## 🚀 Deploy Code Changes

After setting environment variables, push the updated code:

```powershell
git add .
git commit -m "Fix CORS for separate frontend/backend deployments"
git push origin main
```

Both services will redeploy automatically.

---

## 🧪 Test It

1. Wait for both deployments to finish (check Render dashboard)
2. Visit: `https://vocab-app-1.onrender.com`
3. Try logging in
4. **First login might take 30-60 seconds** (free tier wakeup - this is normal!)
5. Should work! ✅

---

## ⏰ Free Tier Sleep Behavior

**What happens**: Render free tier sleeps after 15 min of no activity

**Symptom**: Login hangs/buffers for 30-60 seconds on first try

**Fix**: Just wait - it's waking up. After first request, it's fast!

---

## 🐛 If Still Not Working

### Check these:

1. **Frontend has env var**:
   - Render → vocab-app-1 → Environment
   - Should see: `REACT_APP_API_URL=https://vocab-app-ujb5.onrender.com/api`

2. **Backend has env var**:
   - Render → vocab-app-ujb5 → Environment
   - Should see: `FRONTEND_URL=https://vocab-app-1.onrender.com`

3. **Backend is running**:
   - Visit: `https://vocab-app-ujb5.onrender.com/api/health`
   - Should return: `{"status":"OK",...}`

4. **Check browser console** (F12):
   - Network tab → Look for `/api/auth/login` request
   - Should go to `vocab-app-ujb5.onrender.com`
   - If it goes to `localhost` → Frontend didn't rebuild with env var
   - If CORS error → Backend needs to redeploy

---

That's it! 🎉
