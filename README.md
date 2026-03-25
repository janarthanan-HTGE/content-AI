# 🚀 CampaignAI - AI-Powered Marketing Content Generator

> Create professional marketing campaigns in seconds using AI. Generate social media posts, email campaigns, and Meta ads with just a product description.

[![Made with Emergent](https://img.shields.io/badge/Made%20with-Emergent-black)](https://emergent.sh)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-brightgreen)](https://supabase.com/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Supabase Setup](#-supabase-setup)
- [Google OAuth Setup](#-google-oauth-setup)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Export Features](#-export-features)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎨 Core Features
- **AI Content Generation** - Generate marketing content using Gemini AI
- **3 Campaign Types**:
  - 📱 Social Media Posts (Instagram, Facebook)
  - 📧 Email Campaigns
  - 🎯 Meta Ads (Facebook/Instagram Ads)
- **Smart Poster Design** - AI generates poster design elements
- **Reference Image Upload** - Upload product images to inspire AI
- **Multi-Tone Support** - Professional, Casual, Sales-focused

### 🔐 Authentication
- Email/Password authentication
- Google OAuth login
- Secure session management with Supabase Auth

### 📊 Dashboard & Analytics
- Campaign statistics
- Content usage charts
- Growth tracking
- Campaign history

### 💾 Export Capabilities
- **PDF Export** - Professional formatted reports
- **JSON Export** - Complete structured data
- **CSV Export** - Spreadsheet-compatible format
- **Bulk Export** - Export all campaigns at once

### 🎨 Design
- Neo-Brutalist UI with bold borders & shadows
- Responsive design (mobile & desktop)
- Dark/Light mode ready
- Custom animations

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **jsPDF** - PDF generation
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Backend
- **FastAPI** - Python web framework
- **Supabase** - Database & Auth
- **PostgreSQL** - Primary database
- **Emergent Integrations** - Gemini AI integration
- **Pydantic** - Data validation
- **JWT** - Token authentication

### AI & Services
- **Gemini 3 Flash** - Content generation
- **Supabase Storage** - Image storage
- **Supabase Auth** - User authentication

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **Yarn** package manager
- **Supabase Account** (free tier works)
- **Google Cloud Account** (for OAuth - optional)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd campaign-ai
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install Node dependencies
yarn install
```

---

## 🔥 Supabase Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click **"New Project"**
3. Fill in:
   - **Name**: CampaignAI
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your location
4. Click **"Create new project"**
5. Wait for setup to complete (~2 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **JWT Secret** (under JWT Settings)

### Step 3: Create Database Tables

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `/app/backend/setup_supabase_db.sql`
4. Copy **ALL content** from that file
5. Paste into the SQL editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see: "Success. No rows returned"

This creates:
- ✅ `campaigns` table
- ✅ Row Level Security (RLS) policies
- ✅ `reference-images` storage bucket
- ✅ Performance indexes

### Step 4: Verify Tables Created

1. Click **Table Editor** (left sidebar)
2. You should see:
   - `campaigns` table with columns: id, user_id, campaign_type, etc.

### Step 5: Setup Storage Bucket

1. Go to **Storage** (left sidebar)
2. Click **"Policies"** tab on `reference-images` bucket
3. Verify policies are created (from SQL script)

---

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"**
3. Name: **CampaignAI**
4. Click **"Create"**

### Step 2: Enable Google+ API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"**
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Configure consent screen (if first time):
   - User Type: **External**
   - App name: **CampaignAI**
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**
4. Application type: **Web application**
5. Name: **CampaignAI Web Client**
6. **Authorized redirect URIs**: Add this URL:
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_SUPABASE_PROJECT_REF` with your actual project reference
7. Click **"Create"**
8. **Copy** Client ID and Client Secret

### Step 4: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **"Google"** provider
3. Toggle **Enable**
4. Paste:
   - **Client ID** (from Google Cloud)
   - **Client Secret** (from Google Cloud)
5. **Redirect URL**: Add your app URL:
   ```
   https://YOUR_APP_DOMAIN.com/dashboard
   ```
6. **Site URL**: Your app's main URL
7. Click **"Save"**

---

## 🔧 Environment Variables

### Backend Environment (`.env`)

Create `/app/backend/.env`:

```bash
# MongoDB (not used, kept for compatibility)
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"

# CORS
CORS_ORIGINS="*"

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key-here
SUPABASE_JWT_SECRET=your-supabase-jwt-secret-here

# AI Integration
EMERGENT_LLM_KEY=sk-emergent-xxxxxxxxxxxx
```

**How to get values:**
- `SUPABASE_URL`: Supabase Settings → API → Project URL
- `SUPABASE_KEY`: Supabase Settings → API → anon public key
- `SUPABASE_JWT_SECRET`: Supabase Settings → API → JWT Secret
- `EMERGENT_LLM_KEY`: Already provided in your environment

### Frontend Environment (`.env`)

Create `/app/frontend/.env`:

```bash
# Backend API URL (change for production)
REACT_APP_BACKEND_URL=https://your-app.preview.emergentagent.com

# WebSocket (for development)
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false

# Supabase
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_KEY=your-supabase-anon-key-here
```

**Production URLs:**
- For Emergent: `https://your-app.preview.emergentagent.com`
- For Vercel: `https://your-app.vercel.app`
- For Netlify: `https://your-app.netlify.app`

---

## 💻 Running Locally

### Option 1: Using Supervisor (Recommended for Emergent)

```bash
# Start backend
sudo supervisorctl start backend

# Start frontend
sudo supervisorctl start frontend

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

### Option 2: Manual Run

**Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Frontend:**
```bash
cd frontend
yarn start
```

**Access the app:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8001`
- API Docs: `http://localhost:8001/docs`

---

## 🌐 Deployment

### Deploy to Emergent (Current Setup)

✅ **Already configured!**

Your app is running at:
```
https://campaign-craft-14.preview.emergentagent.com
```

**Auto-deployment:**
- Changes to code auto-restart services
- Supervisor manages backend (port 8001)
- Frontend builds automatically (port 3000)
- Kubernetes ingress routes traffic

### Deploy to Vercel (Frontend)

1. **Prepare for deployment:**
```bash
cd frontend
yarn build
```

2. **Deploy:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `frontend/.env`

4. **Update backend CORS:**
   - Add Vercel URL to `CORS_ORIGINS` in backend `.env`

### Deploy Backend to Railway/Render

**Railway:**
1. Connect GitHub repo
2. Select `/backend` as root directory
3. Add environment variables
4. Railway auto-detects Python
5. Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

**Render:**
1. New Web Service → Connect repo
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Custom Domain Setup

**For Emergent:**
1. Contact Emergent support for custom domain
2. Update DNS records as instructed
3. Update environment variables with new domain

**For Vercel:**
1. Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS (A/CNAME records)
4. Wait for SSL certificate

---

## 📁 Project Structure

```
campaign-ai/
├── backend/
│   ├── server.py              # FastAPI main application
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Backend environment variables
│   ├── setup_supabase_db.sql # Database schema
│   └── setup_storage.py       # Storage bucket setup
│
├── frontend/
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Layout.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── ui/          # Shadcn UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Generator.js
│   │   │   ├── Library.js
│   │   │   └── Settings.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── config/
│   │   │   └── supabaseClient.js
│   │   ├── utils/
│   │   │   └── exportUtils.js  # PDF/JSON/CSV export
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── IMPLEMENTATION_GUIDE.md
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup       - Create new account
POST   /api/auth/login        - Login with email/password
GET    /api/auth/me           - Get current user
```

### Campaign Management
```
POST   /api/campaigns/generate     - Generate new campaign
GET    /api/campaigns              - Get user's campaigns
GET    /api/campaigns/{id}         - Get specific campaign
DELETE /api/campaigns/{id}         - Delete campaign
```

### Storage
```
POST   /api/storage/upload    - Upload reference image
```

### Dashboard
```
GET    /api/dashboard/stats   - Get dashboard statistics
```

### API Documentation
- Interactive docs: `https://your-app.com/docs`
- OpenAPI schema: `https://your-app.com/openapi.json`

---

## 📤 Export Features

### Single Campaign Export

**PDF Export:**
- Professional formatted report
- Campaign metadata
- All generated content
- Poster design elements
- Multi-page support

**JSON Export:**
- Complete campaign object
- All nested data preserved
- Easy to re-import
- Developer-friendly

**CSV Export:**
- Spreadsheet compatible
- Field-value pairs
- Content as rows
- Works with Excel/Google Sheets

### Bulk Export

**Export All JSON:**
- Array of all campaigns
- Single file download
- Backup-friendly

**Export All CSV:**
- Summary table format
- All campaigns in one file
- Analytics-ready

**Usage in Code:**
```javascript
import { exportToPDF, exportToJSON, exportToCSV } from './utils/exportUtils';

// Export single campaign
exportToPDF(campaign);
exportToJSON(campaign);
exportToCSV(campaign);

// Export all campaigns
exportAllToJSON(campaigns);
exportAllToCSV(campaigns);
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Kill process on port 8001
sudo lsof -ti:8001 | xargs sudo kill -9

# Restart backend
sudo supervisorctl restart backend
```

**Supabase connection error:**
- Verify `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
- Check if Supabase project is active
- Verify database tables exist

**AI generation fails:**
- Check `EMERGENT_LLM_KEY` is set
- Verify key has sufficient credits
- Check API logs for errors

### Frontend Issues

**Blank page:**
```bash
# Clear cache and rebuild
cd frontend
rm -rf node_modules .cache build
yarn install
yarn start
```

**API calls failing:**
- Verify `REACT_APP_BACKEND_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

**Google OAuth not working:**
- Verify redirect URI in Google Cloud Console
- Check Supabase Auth provider is enabled
- Ensure client ID/secret are correct

### Database Issues

**Campaigns not saving:**
- Run SQL script again in Supabase
- Check RLS policies are created
- Verify user is authenticated

**Image upload fails:**
- Check storage bucket exists: `reference-images`
- Verify storage policies
- Check file size < 5MB

### Common Errors

**"Token expired":**
- User session expired
- Re-login to get new token

**"Campaign not found":**
- Campaign doesn't belong to user
- RLS policies are working correctly

**"Upload failed":**
- File too large (max 5MB)
- Invalid file type (only images allowed)
- Storage bucket not configured

---

## 📊 Database Schema

### campaigns table
```sql
id                  UUID PRIMARY KEY
user_id             UUID (references auth.users)
campaign_type       TEXT ('social_media', 'email', 'meta_ads')
category            TEXT
subcategory         TEXT
product_description TEXT
tone                TEXT ('professional', 'casual', 'sales_focused')
content             JSONB (generated content)
poster_design       JSONB (poster elements)
reference_image_url TEXT (Supabase Storage URL)
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
```

---

## 🔒 Security

### Best Practices Implemented

✅ **Row Level Security (RLS)** - Users only see their own campaigns
✅ **JWT Authentication** - Secure token-based auth
✅ **Environment Variables** - Secrets not in code
✅ **CORS Configuration** - Restricted origins
✅ **Input Validation** - Pydantic models
✅ **SQL Injection Protection** - Parameterized queries
✅ **XSS Protection** - React auto-escaping

### Additional Recommendations

- Use HTTPS in production
- Rotate JWT secrets regularly
- Enable MFA for Supabase admin
- Monitor API usage
- Set up rate limiting
- Regular security audits

---

## ⚡ Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies (backend + frontend)
- [ ] Create Supabase project
- [ ] Run SQL setup script
- [ ] Configure Google OAuth (optional)
- [ ] Set environment variables
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Test signup/login
- [ ] Generate first campaign
- [ ] Export campaign (PDF/JSON/CSV)

---

**Made with ❤️ using Emergent**

**Live App: https://campaign-craft-14.preview.emergentagent.com**
