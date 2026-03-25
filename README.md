# 🚀 CampaignAI - AI Marketing Content Generator

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-brightgreen.svg)](https://supabase.com/)

> Generate professional marketing campaigns in seconds using AI. Create social media posts, email campaigns, and Meta ads with just a product description.

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

CampaignAI is a full-stack web application that uses AI to generate marketing content. Simply describe your product, choose a campaign type, and get professionally crafted content in seconds.

**Live Features:**
- 📱 Social Media Posts (Instagram & Facebook)
- 📧 Email Campaigns
- 🎯 Meta Ads (Facebook/Instagram Ads)
- 🖼️ Poster Design Elements
- 💾 Export as PDF, JSON, or CSV
- 🔐 Google OAuth & Email Authentication

---

## 🛠 Tech Stack

### Backend
- **Node.js** v16+
- **Express.js** - Web framework
- **Supabase JS Client** - Database & Authentication
- **JWT** - Token verification
- **Multer** - File uploads
- **Axios** - HTTP client for AI API

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **jsPDF** - PDF generation
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

### Database & Services
- **Supabase PostgreSQL** - Main database
- **Supabase Storage** - Image storage
- **Supabase Auth** - User authentication
- **Gemini 3 Flash** - AI content generation

---

## ✨ Features

### Core Features
✅ AI-powered content generation
✅ 3 campaign types (Social, Email, Ads)
✅ Reference image upload
✅ Smart poster design generation
✅ Multiple tone options (Professional, Casual, Sales-focused)
✅ Campaign history & search
✅ Export capabilities (PDF, JSON, CSV)
✅ Bulk export for all campaigns

### Authentication
✅ Email/Password signup & login
✅ Google OAuth integration
✅ Secure JWT token management
✅ Protected routes

### Dashboard
✅ Campaign statistics
✅ Content usage charts
✅ Growth tracking
✅ Recent activity feed

---

## 📦 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16.x.x or higher
   ```

2. **Yarn** package manager
   ```bash
   npm install -g yarn
   yarn --version
   ```

3. **Supabase Account** (Free tier available)
   - Sign up at: https://supabase.com

4. **AI API Key** (Choose one):
   - Option A: Emergent LLM Key (supports Gemini)
   - Option B: OpenAI API Key (requires code modification)

---

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd campaignai
```

### 2. Install Dependencies
```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

### 3. Setup Supabase Database
1. Go to https://app.supabase.com
2. Create new project
3. Go to SQL Editor
4. Run the SQL script from `/backend/setup_supabase_db.sql`

### 4. Configure Environment Variables

**Backend** (`/backend/.env`):
```env
PORT=8001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

EMERGENT_LLM_KEY=your-ai-api-key
```

**Frontend** (`/frontend/.env`):
```env
REACT_APP_BACKEND_URL=http://localhost:8001
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_KEY=your-anon-key
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
yarn dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

**Open**: http://localhost:3000

---

## 📖 Detailed Setup

### Step 1: Supabase Configuration

#### 1.1 Create Supabase Project

1. Visit https://app.supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: CampaignAI
   - **Database Password**: (save this!)
   - **Region**: Closest to you
4. Wait ~2 minutes for setup

#### 1.2 Get Credentials

Go to **Settings** → **API** and copy:

1. **Project URL**:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

2. **anon public key** (under Project API keys):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **JWT Secret** (under JWT Settings):
   ```
   your-secret-key-here
   ```

#### 1.3 Create Database Tables

1. In Supabase Dashboard, click **"SQL Editor"**
2. Click **"New query"**
3. Open file: `/backend/setup_supabase_db.sql`
4. Copy **entire content**
5. Paste in SQL Editor
6. Click **"Run"** (Ctrl/Cmd + Enter)
7. Should see: ✅ **"Success. No rows returned"**

This creates:
- `campaigns` table with all columns
- Row Level Security (RLS) policies
- `reference-images` storage bucket
- Performance indexes

#### 1.4 Verify Setup

1. Click **"Table Editor"** → Should see `campaigns` table
2. Click **"Storage"** → Should see `reference-images` bucket

---

### Step 2: Google OAuth Setup (Optional)

#### 2.1 Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"Create Project"**
3. Name: `CampaignAI`

#### 2.2 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. If first time, configure consent screen:
   - User Type: **External**
   - App name: **CampaignAI**
   - Your email for support
4. Create credentials:
   - Application type: **Web application**
   - Name: **CampaignAI**
   - **Authorized redirect URIs**:
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     http://localhost:3000/dashboard
     ```
5. Copy **Client ID** and **Client Secret**

#### 2.3 Configure in Supabase

1. Supabase → **Authentication** → **Providers**
2. Find **"Google"** → Enable
3. Paste Client ID and Client Secret
4. Site URL: `http://localhost:3000`
5. Redirect URLs: `http://localhost:3000/dashboard`
6. Save

---

### Step 3: Environment Variables Setup

#### Backend Environment File

Create `/backend/.env`:

```bash
# Server Configuration
PORT=8001
NODE_ENV=development

# CORS - Allow frontend to access backend
CORS_ORIGINS=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=https://octjrbrjgjjafwjfgjaa.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdGpyYnJqZ2pqYWZ3amZnamFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzIzMjAsImV4cCI6MjA3OTY0ODMyMH0.z6r-zH_7TfYaWL81Eqe4WDMLhZ66D4CYF7NRQLytOHk
SUPABASE_JWT_SECRET=gEvuN9A+hvWDUZHNyTmBYjLKI9FyTB5TE22KE2SMsSmzQ+y8w3TsS2WIaMaI2E7+TzmvCXTHZ1Y+9kA6dj8ViA==

# AI API Key (Gemini via Emergent)
EMERGENT_LLM_KEY=sk-emergent-6B2DfC07d8f2539Ab5
```

**How to get API key:**
- Sign up at https://emergent.sh to get `EMERGENT_LLM_KEY`
- Or use OpenAI and modify the AI call in `server.js`

#### Frontend Environment File

Create `/frontend/.env`:

```bash
# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001

# Supabase Configuration (same as backend)
REACT_APP_SUPABASE_URL=https://octjrbrjgjjafwjfgjaa.supabase.co
REACT_APP_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jdGpyYnJqZ2pqYWZ3amZnamFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzIzMjAsImV4cCI6MjA3OTY0ODMyMH0.z6r-zH_7TfYaWL81Eqe4WDMLhZ66D4CYF7NRQLytOHk
```

---

## 🚀 Running the App

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
yarn dev
```

Expected output:
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

**Terminal 2 - Start Frontend:**
```bash
cd frontend
yarn start
```

Expected output:
```
Compiled successfully!

Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

Browser will auto-open at http://localhost:3000

---

## 📁 Project Structure

```
campaignai/
│
├── backend/                    # Node.js + Express Backend
│   ├── server.js              # Main Express server (230+ lines)
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   ├── setup_supabase_db.sql # Database schema
│   └── node_modules/          # Backend packages
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.js      # Sidebar layout
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── pages/             # Page components
│   │   │   ├── Login.js       # Login page
│   │   │   ├── Signup.js      # Signup page
│   │   │   ├── Dashboard.js   # Dashboard with charts
│   │   │   ├── Generator.js   # Campaign generator
│   │   │   ├── Library.js     # Campaign history
│   │   │   └── Settings.js    # User settings
│   │   ├── context/
│   │   │   └── AuthContext.js # Auth state management
│   │   ├── config/
│   │   │   └── supabaseClient.js
│   │   ├── utils/
│   │   │   └── exportUtils.js # PDF/JSON/CSV export
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # Neo-Brutalist styles
│   │   └── index.css          # Global styles
│   ├── package.json           # Frontend dependencies
│   ├── .env                   # Frontend env variables
│   ├── tailwind.config.js     # Tailwind configuration
│   └── node_modules/          # Frontend packages
│
├── README.md                   # This file
├── SETUP_GUIDE.md             # Detailed setup guide
└── .gitignore                 # Git ignore rules
```

---

## 🔌 API Documentation

### Base URL
```
Local: http://localhost:8001/api
Production: https://your-domain.com/api
```

### Endpoints

#### Health Check
```http
GET /api
Response: {"message": "CampaignAI API v2.0 (Node.js)"}
```

#### Authentication (via Supabase Auth)
- Handled by frontend using `@supabase/supabase-js`
- Backend validates JWT tokens

#### Campaign Management

**Generate Campaign**
```http
POST /api/campaigns/generate
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "product_description": "Premium wireless headphones",
  "category": "electronics",
  "subcategory": "Accessories",
  "campaign_type": "social_media",
  "tone": "professional",
  "reference_image_url": "https://..." // optional
}

Response: Campaign object with generated content
```

**Get All Campaigns**
```http
GET /api/campaigns
Authorization: Bearer <token>

Response: Array of campaign objects
```

**Get Single Campaign**
```http
GET /api/campaigns/:id
Authorization: Bearer <token>

Response: Single campaign object
```

**Delete Campaign**
```http
DELETE /api/campaigns/:id
Authorization: Bearer <token>

Response: {"message": "Campaign deleted"}
```

#### Storage

**Upload Image**
```http
POST /api/storage/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: form-data with 'file' field

Response:
{
  "success": true,
  "url": "https://...",
  "filename": "uuid.jpg",
  "size": 12345
}
```

#### Dashboard

**Get Statistics**
```http
GET /api/dashboard/stats
Authorization: Bearer <token>

Response:
{
  "total_campaigns": 10,
  "total_assets": 10,
  "active_campaigns": 10,
  "downloads": 20,
  "content_usage": [...],
  "growth_data": [...]
}
```

---

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login and deploy:
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard:
   - All variables from `backend/.env`

4. Get Railway URL (e.g., `https://your-app.railway.app`)

#### Deploy Frontend to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd frontend
   vercel --prod
   ```

3. Add environment variables in Vercel dashboard:
   - `REACT_APP_BACKEND_URL=https://your-app.railway.app`
   - `REACT_APP_SUPABASE_URL=...`
   - `REACT_APP_SUPABASE_KEY=...`

#### Update CORS

In Railway, update `CORS_ORIGINS`:
```
CORS_ORIGINS=https://your-app.vercel.app
```

---

### Option 2: Render (Full Stack)

1. Push code to GitHub
2. Go to https://render.com
3. Click **"New +"** → **"Web Service"**

**Backend Service:**
- Root Directory: `backend`
- Build Command: `yarn install`
- Start Command: `node server.js`
- Add all environment variables

**Frontend Service:**
- Root Directory: `frontend`
- Build Command: `yarn build`
- Start Command: `yarn start`
- Add all environment variables

---

### Option 3: DigitalOcean App Platform

1. Connect GitHub repository
2. DigitalOcean auto-detects components
3. Configure:
   - Backend: Node.js app (port 8001)
   - Frontend: React static site
4. Add environment variables
5. Deploy

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Port 8001 already in use"**
```bash
# Find and kill process
lsof -ti:8001 | xargs kill -9

# Or use different port in .env
PORT=8002
```

**Error: "Cannot find module 'express'"**
```bash
cd backend
rm -rf node_modules yarn.lock
yarn install
```

**Error: "Invalid Supabase credentials"**
- Check `SUPABASE_URL` starts with `https://` and ends with `.supabase.co`
- Verify `SUPABASE_KEY` is the **anon public** key
- Confirm `SUPABASE_JWT_SECRET` is correct

**Error: "AI generation failed"**
- Verify `EMERGENT_LLM_KEY` is valid
- Check network connection
- View backend logs for detailed error

---

### Frontend Issues

**Error: "Failed to fetch"**
- Ensure backend is running on port 8001
- Check `REACT_APP_BACKEND_URL=http://localhost:8001` in `.env`
- Check browser console for CORS errors

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

**Blank page after login**
- Check browser console for errors
- Verify Supabase credentials match backend
- Clear browser cache and reload

---

### Database Issues

**Error: "relation 'campaigns' does not exist"**
- Run SQL script in Supabase SQL Editor
- File: `/backend/setup_supabase_db.sql`
- Verify table exists in Table Editor

**Campaigns not saving**
- Check user is authenticated
- Verify RLS policies are created
- Check Supabase logs in dashboard

**Image upload fails**
- Verify `reference-images` bucket exists
- Check storage policies
- File size must be < 5MB

---

## 🔐 Security

### Best Practices Implemented

✅ Row Level Security (RLS) in Supabase
✅ JWT token verification
✅ Environment variables for secrets
✅ CORS configuration
✅ Input validation
✅ Parameterized queries
✅ Secure file uploads

### Recommendations

- Use HTTPS in production
- Rotate JWT secrets regularly
- Enable MFA for Supabase admin
- Monitor API usage
- Set up rate limiting
- Regular security audits

---

## 📊 Database Schema

### campaigns table
```sql
Column              Type        Description
------------------  ----------  ---------------------------
id                  UUID        Primary key (auto)
user_id             UUID        Foreign key to auth.users
campaign_type       TEXT        social_media, email, meta_ads
category            TEXT        Product category
subcategory         TEXT        Product subcategory
product_description TEXT        User input
tone                TEXT        professional, casual, sales_focused
content             JSONB       Generated content
poster_design       JSONB       Poster elements (optional)
reference_image_url TEXT        Supabase Storage URL (optional)
created_at          TIMESTAMPTZ Auto timestamp
updated_at          TIMESTAMPTZ Auto updated
```

**Indexes:**
- `idx_campaigns_user_id` on `user_id`
- `idx_campaigns_created_at` on `created_at DESC`
- `idx_campaigns_campaign_type` on `campaign_type`

---

## 🎯 Testing Guide

### 1. Test Backend

```bash
# Start backend
cd backend
yarn dev

# Test health endpoint
curl http://localhost:8001/api

# Expected: {"message":"CampaignAI API v2.0 (Node.js)"}
```

### 2. Test Frontend

```bash
# Start frontend
cd frontend
yarn start

# Opens at http://localhost:3000
```

### 3. Test Authentication

1. Go to http://localhost:3000
2. Click **"Sign up"**
3. Enter email and password
4. Should redirect to Dashboard
5. Logout and login again

### 4. Test Google OAuth (if configured)

1. Click **"Sign in with Google"**
2. Choose Google account
3. Should redirect to Dashboard

### 5. Test Campaign Generation

1. Click **"Generate"** in sidebar
2. Fill in form:
   - Product: "Eco-friendly water bottle"
   - Category: Services → Training
   - Campaign: Social Media
   - Tone: Professional
3. Click **"Generate My Content"**
4. Wait 5-10 seconds
5. Should see generated content

### 6. Test Export

1. After generating campaign
2. Click **"Export PDF"** → Downloads PDF
3. Click **"Export JSON"** → Downloads JSON
4. Click **"Export CSV"** → Downloads CSV

### 7. Test Library

1. Click **"Library"**
2. Should see all campaigns
3. Click **"View"** on any campaign
4. Modal shows full details
5. Export buttons work

---

## 📝 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `8001` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:3000` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | `eyJhbG...` |
| `SUPABASE_JWT_SECRET` | JWT secret for verification | `your-secret` |
| `EMERGENT_LLM_KEY` | AI API key | `sk-emergent-xxx` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API URL | `http://localhost:8001` |
| `REACT_APP_SUPABASE_URL` | Same as backend | `https://xxx.supabase.co` |
| `REACT_APP_SUPABASE_KEY` | Same as backend | `eyJhbG...` |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **Gemini AI** - Content generation
- **Shadcn UI** - UI components
- **Tailwind CSS** - Styling framework

---

## 📞 Support

- 📧 Email: support@campaignai.com
- 📖 Documentation: [Full Docs](#)
- 🐛 Issues: [GitHub Issues](#)

---

## ✅ Quick Start Checklist

- [ ] Node.js v16+ installed
- [ ] Yarn installed
- [ ] Supabase account created
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Supabase SQL script executed
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can sign up / login
- [ ] Can generate campaigns
- [ ] Can export campaigns

---

**Built with ❤️ using Node.js + React + Supabase**

**Ready to deploy! 🚀**
