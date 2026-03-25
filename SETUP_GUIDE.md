# 🚀 CampaignAI - Complete Local Setup Guide

> Run CampaignAI locally without Emergent platform

## 📋 Stack Overview

- **Backend**: Node.js + Express
- **Frontend**: React (JSX)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Gemini 3 Flash (via Emergent API)

---

## ✅ Prerequisites

Install these before starting:

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should show v16.x.x or higher
   ```

2. **Yarn** (package manager)
   ```bash
   npm install -g yarn
   yarn --version
   ```

3. **Git** (for cloning)
   ```bash
   git --version
   ```

4. **Supabase Account** (free)
   - Sign up at: https://supabase.com

---

## 📦 Step 1: Clone & Install

### Clone Repository
```bash
git clone <your-repo-url>
cd campaign-ai
```

### Install Backend Dependencies
```bash
cd backend
yarn install
```

You should see:
```
✅ express
✅ cors
✅ dotenv
✅ @supabase/supabase-js
✅ jsonwebtoken
✅ axios
✅ multer
✅ uuid
```

### Install Frontend Dependencies
```bash
cd ../frontend
yarn install
```

---

## 🔥 Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to: https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: `CampaignAI`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for setup

### 2.2 Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these 3 values:

   - **Project URL**:
     ```
     https://xxxxx.supabase.co
     ```
   
   - **anon public** key (under Project API keys):
     ```
     eyJhbG...very-long-string
     ```
   
   - **JWT Secret** (under JWT Settings):
     ```
     your-jwt-secret-here
     ```

### 2.3 Create Database Tables

1. In Supabase Dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy the **entire content** from:
   ```
   /app/backend/setup_supabase_db.sql
   ```
4. Paste into SQL editor
5. Click **"Run"** (or Ctrl/Cmd + Enter)
6. You should see: ✅ **"Success. No rows returned"**

This creates:
- ✅ `campaigns` table
- ✅ Row Level Security policies
- ✅ `reference-images` storage bucket
- ✅ Indexes for performance

### 2.4 Verify Setup

1. Click **"Table Editor"** (left sidebar)
2. You should see `campaigns` table with columns:
   - id, user_id, campaign_type, category, subcategory, etc.

3. Click **"Storage"** (left sidebar)
4. You should see `reference-images` bucket

---

## 🔐 Step 3: Google OAuth Setup (Optional)

### 3.1 Create Google Cloud Project

1. Go to: https://console.cloud.google.com
2. Click **"Create Project"**
3. Name: `CampaignAI`
4. Click **"Create"**

### 3.2 Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search: **"Google+ API"**
3. Click **"Enable"**

### 3.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. If first time, configure consent screen:
   - User Type: **External**
   - App name: **CampaignAI**
   - Your email for support and developer contact
   - Click **"Save and Continue"**
   - No need to add scopes, just click **"Save and Continue"**
   - Click **"Back to Dashboard"**

4. Now create credentials:
   - Application type: **Web application**
   - Name: **CampaignAI Web Client**
   - **Authorized redirect URIs**: Add this (replace with your Supabase URL):
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     Example: `https://octjrbrjgjjafwjfgjaa.supabase.co/auth/v1/callback`
   
5. Click **"Create"**
6. **Copy** Client ID and Client Secret

### 3.4 Configure in Supabase

1. Go to Supabase → **Authentication** → **Providers**
2. Find **"Google"** and toggle **Enable**
3. Paste:
   - **Client ID**: (from Google Cloud)
   - **Client Secret**: (from Google Cloud)
4. **Site URL**: `http://localhost:3000`
5. **Redirect URLs**: `http://localhost:3000/dashboard`
6. Click **"Save"**

---

## ⚙️ Step 4: Configure Environment Variables

### Backend Configuration

Edit `/app/backend/.env`:

```bash
# Server
PORT=8001
NODE_ENV=development

# CORS (allow frontend)
CORS_ORIGINS=http://localhost:3000

# Supabase (REPLACE WITH YOUR VALUES)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbG...your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret-here

# AI Integration
EMERGENT_LLM_KEY=sk-emergent-your-key-here
```

**How to get `EMERGENT_LLM_KEY`:**
- Sign up at: https://emergent.sh
- Or use OpenAI API key and modify the code to call OpenAI directly

### Frontend Configuration

Edit `/app/frontend/.env`:

```bash
# Backend URL (local)
REACT_APP_BACKEND_URL=http://localhost:8001

# Supabase (SAME AS BACKEND)
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbG...your-anon-key
```

---

## 🚀 Step 5: Run the Application

### Terminal 1: Start Backend

```bash
cd backend
yarn dev
```

You should see:
```
✅ CampaignAI Backend running on port 8001
📡 API: http://localhost:8001/api
🔗 Supabase: https://xxxxx.supabase.co
```

**Test backend:**
```bash
curl http://localhost:8001/api
# Should return: {"message":"CampaignAI API v2.0 (Node.js)"}
```

### Terminal 2: Start Frontend

```bash
cd frontend
yarn start
```

You should see:
```
Compiled successfully!
Local:            http://localhost:3000
```

**Browser will auto-open at: http://localhost:3000**

---

## ✅ Step 6: Test the Application

### 1. Sign Up

1. Go to: http://localhost:3000
2. Click **"Sign up"**
3. Enter:
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
4. Click **"Sign Up"**
5. You should be redirected to Dashboard

**OR use Google OAuth:**
1. Click **"Sign up with Google"**
2. Choose your Google account
3. Auto-redirected to Dashboard

### 2. Generate a Campaign

1. Click **"Generate"** in sidebar
2. Fill in:
   - **Product Description**: "Premium wireless headphones with noise cancellation"
   - **Category**: Electronics
   - **Subcategory**: Accessories
   - **Campaign Type**: Social Media Post
   - **Tone**: Professional
3. **(Optional)** Upload a product image
4. Click **"Generate My Content"**
5. Wait 5-10 seconds
6. See generated content + export buttons

### 3. Export Campaign

1. After generation, you'll see 3 buttons:
   - **Export PDF** - Downloads formatted report
   - **Export JSON** - Downloads JSON file
   - **Export CSV** - Downloads CSV file
2. Click any button to test

### 4. View Library

1. Click **"Library"** in sidebar
2. See all your generated campaigns
3. Click **"View"** to see details
4. Click export buttons (PDF/JSON/CSV) on any campaign
5. Use **"Export All JSON"** or **"Export All CSV"** for bulk export

---

## 🔧 Troubleshooting

### Backend Won't Start

**Error: "Port 8001 already in use"**
```bash
# Find and kill process on port 8001
lsof -ti:8001 | xargs kill -9

# Or use different port
# Edit backend/.env: PORT=8002
```

**Error: "Cannot find module 'express'"**
```bash
cd backend
rm -rf node_modules package-lock.json yarn.lock
yarn install
```

**Error: "Invalid Supabase URL"**
- Check `SUPABASE_URL` in `backend/.env`
- Should start with `https://` and end with `.supabase.co`
- No trailing slashes

### Frontend Won't Start

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules package-lock.json yarn.lock
yarn install
yarn start
```

**Error: "Network Error" when calling API**
- Check backend is running on port 8001
- Check `REACT_APP_BACKEND_URL=http://localhost:8001` in `frontend/.env`
- Check browser console for CORS errors

### Campaigns Won't Save

**Error: "relation 'campaigns' does not exist"**
- Run the SQL script in Supabase SQL Editor
- File: `/app/backend/setup_supabase_db.sql`
- Copy ALL content and run in Supabase

**Error: "Row Level Security"**
- The SQL script creates RLS policies
- Make sure you're logged in
- Check Supabase Table Editor → campaigns → Policies tab

### AI Generation Fails

**Error: "AI content generation failed"**
- Check `EMERGENT_LLM_KEY` in `backend/.env`
- Sign up for Emergent key at: https://emergent.sh
- Or replace with OpenAI API call in `server.js`

### Google OAuth Not Working

**Error: "redirect_uri_mismatch"**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://YOUR_PROJECT.supabase.co/auth/v1/callback
   http://localhost:3000/dashboard
   ```
4. Save and retry

---

## 📁 Project Structure

```
campaign-ai/
├── backend/
│   ├── server.js           # Main Express server
│   ├── package.json        # Node.js dependencies
│   ├── .env               # Backend environment variables
│   └── setup_supabase_db.sql  # Database schema
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # React pages
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── config/        # Supabase client
│   │   └── utils/         # Export utilities
│   ├── package.json       # React dependencies
│   ├── .env              # Frontend environment variables
│   └── tailwind.config.js
│
└── SETUP_GUIDE.md         # This file
```

---

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Deploy Backend to Railway:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up
```

**Deploy Frontend to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Update Environment Variables:**
- In Railway: Add all backend `.env` variables
- In Vercel: Add all frontend `.env` variables
- Update `REACT_APP_BACKEND_URL` to Railway URL
- Update `CORS_ORIGINS` in Railway to Vercel URL

### Option 2: Render (Full Stack)

1. Connect GitHub repo to Render
2. Create Web Service for backend:
   - Root: `backend`
   - Build: `yarn install`
   - Start: `node server.js`
   - Add env variables
3. Create Static Site for frontend:
   - Root: `frontend`
   - Build: `yarn build`
   - Publish: `build`
   - Add env variables

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Detect 2 components (backend + frontend)
3. Configure environment variables
4. Deploy both together

---

## 🔑 Environment Variables Reference

### Backend Required:
- `PORT` - Server port (default: 8001)
- `CORS_ORIGINS` - Allowed frontend URLs
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Supabase anon public key
- `SUPABASE_JWT_SECRET` - Supabase JWT secret
- `EMERGENT_LLM_KEY` - AI API key

### Frontend Required:
- `REACT_APP_BACKEND_URL` - Backend API URL
- `REACT_APP_SUPABASE_URL` - Same as backend
- `REACT_APP_SUPABASE_KEY` - Same as backend

---

## 📊 API Endpoints

```
GET    /api                    - Health check
POST   /api/storage/upload     - Upload image
POST   /api/campaigns/generate - Generate campaign
GET    /api/campaigns          - Get all campaigns
GET    /api/campaigns/:id      - Get single campaign
DELETE /api/campaigns/:id      - Delete campaign
GET    /api/dashboard/stats    - Get statistics
```

---

## 🎯 Quick Start Checklist

- [ ] Node.js and Yarn installed
- [ ] Cloned repository
- [ ] Backend dependencies installed (`yarn install`)
- [ ] Frontend dependencies installed (`yarn install`)
- [ ] Supabase project created
- [ ] SQL script executed in Supabase
- [ ] Backend `.env` configured with Supabase credentials
- [ ] Frontend `.env` configured
- [ ] (Optional) Google OAuth setup
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can sign up / login
- [ ] Can generate campaign
- [ ] Can export (PDF/JSON/CSV)

---

## 🆘 Need Help?

**Common Issues:**
1. Port conflicts → Change PORT in `.env`
2. Module errors → Delete `node_modules` and reinstall
3. Database errors → Re-run SQL script
4. CORS errors → Check `CORS_ORIGINS` matches frontend URL
5. AI errors → Check `EMERGENT_LLM_KEY` is valid

**Resources:**
- Supabase Docs: https://supabase.com/docs
- Express.js Guide: https://expressjs.com/
- React Docs: https://react.dev/

---

## ✅ Success Indicators

You should see:
- ✅ Backend console: "CampaignAI Backend running on port 8001"
- ✅ Frontend opens at http://localhost:3000
- ✅ Can create account / login
- ✅ Dashboard shows stats
- ✅ Can generate campaigns
- ✅ Content appears in ~5-10 seconds
- ✅ Export buttons work (PDF/JSON/CSV)
- ✅ Library shows all campaigns

**You're all set! 🎉**

---

**Made with ❤️ - Powered by Node.js + React + Supabase**
