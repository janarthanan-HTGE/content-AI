# 🚀 CampaignAI - Complete Working Code

> **Full Stack Marketing Content Generator with AI**

**Stack:** Node.js + Express + React + Vite + Supabase

---

## 📦 What's Included

### ✅ Backend (Node.js + Express)
- RESTful API with 7 endpoints
- JWT authentication
- File upload with Multer
- AI content generation (Gemini)
- Supabase database integration
- CORS configured

### ✅ Frontend (React + Vite)
- ⚡ **Vite** - Lightning fast HMR
- 🎨 **React 18** - Latest React features
- 🎯 **React Router** - Client-side routing
- 💅 **Tailwind CSS** - Utility-first styling
- 🎬 **Framer Motion** - Smooth animations
- 📊 **Recharts** - Data visualization
- 📄 **jsPDF** - PDF export
- 🔔 **Sonner** - Toast notifications

### ✅ Database (Supabase)
- PostgreSQL database
- Row Level Security (RLS)
- Storage for images
- Built-in authentication

---

## 🎯 Features

- ✅ AI-powered content generation
- ✅ Social Media, Email, and Meta Ads campaigns
- ✅ Reference image upload
- ✅ Poster design generation
- ✅ Email/Password + Google OAuth authentication
- ✅ Export as PDF, JSON, CSV
- ✅ Campaign library with search
- ✅ Dashboard with analytics
- ✅ Neo-Brutalist UI design

---

## 📋 Prerequisites

1. **Node.js** v16+ 
2. **Yarn** package manager
3. **Supabase** account (free)

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

### 2. Setup Supabase

1. Create project at https://supabase.com
2. Get credentials:
   - Project URL
   - anon public key
   - JWT Secret
3. Run SQL script in Supabase SQL Editor:
   - File: `/backend/setup_supabase_db.sql`
   - Copy all content → Paste → Run

### 3. Configure Environment

**Backend** (`/backend/.env`):
```env
PORT=8001
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret

EMERGENT_LLM_KEY=your-ai-key
```

**Frontend** (`/frontend/.env`):
```env
VITE_BACKEND_URL=http://localhost:8001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

### 4. Start Development

**Terminal 1 - Backend:**
```bash
cd backend
yarn dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn dev
```

**Open:** http://localhost:3000

---

## 📁 Project Structure

```
campaignai/
├── backend/                    # Node.js Express Server
│   ├── server.js              # Main server file
│   ├── package.json
│   ├── .env
│   └── setup_supabase_db.sql
│
├── frontend/                   # React + Vite App
│   ├── index.html             # Entry HTML (Vite style)
│   ├── vite.config.js         # Vite configuration
│   ├── package.json
│   ├── .env                   # Vite env (VITE_ prefix)
│   └── src/
│       ├── main.jsx           # Vite entry point
│       ├── App.jsx            # Main app component
│       ├── pages/             # Page components (.jsx)
│       ├── components/        # Reusable components (.jsx)
│       ├── context/           # React context (.jsx)
│       ├── config/            # Supabase client (.jsx)
│       └── utils/             # Utilities (.jsx)
│
└── README.md
```

---

## 🔥 Vite Features

### ⚡ Lightning Fast
- Instant server start
- Hot Module Replacement (HMR)
- Optimized builds

### 🎯 Modern Features
- ES modules
- Tree shaking
- Code splitting
- Asset optimization

### 📦 Build Output
```bash
yarn build
# Creates optimized production build in /dist
```

---

## 🌐 Environment Variables

### Vite Environment Variables

**Important:** Vite uses `VITE_` prefix (not `REACT_APP_`)

```env
VITE_BACKEND_URL=http://localhost:8001
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_KEY=eyJhbG...
```

**Access in code:**
```javascript
const apiUrl = import.meta.env.VITE_BACKEND_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
```

---

## 🔌 API Endpoints

```
GET    /api                      # Health check
POST   /api/storage/upload       # Upload image
POST   /api/campaigns/generate   # Generate campaign
GET    /api/campaigns            # Get all campaigns
GET    /api/campaigns/:id        # Get single campaign
DELETE /api/campaigns/:id        # Delete campaign
GET    /api/dashboard/stats      # Get statistics
```

---

## 🚀 Development Commands

### Frontend (Vite)

```bash
yarn dev        # Start dev server (port 3000)
yarn build      # Build for production
yarn preview    # Preview production build
```

### Backend (Node.js)

```bash
yarn dev        # Start with nodemon (auto-restart)
yarn start      # Start production server
```

---

## 📦 Build for Production

### Frontend

```bash
cd frontend
yarn build
# Output: /frontend/dist
```

### Backend

```bash
cd backend
# No build needed - Node.js runs directly
```

---

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend to Vercel:**
```bash
cd frontend
yarn build
vercel --prod
```

**Backend to Railway:**
```bash
cd backend
railway up
```

### Option 2: Netlify (Frontend) + Render (Backend)

**Frontend:**
- Connect GitHub repo
- Build command: `yarn build`
- Publish directory: `dist`
- Add env variables

**Backend:**
- Connect GitHub repo
- Build: `yarn install`
- Start: `node server.js`
- Add env variables

---

## 🎨 UI Components

Using **Shadcn UI** components:
- Alert Dialog
- Button
- Checkbox
- Calendar
- Carousel
- Progress
- Switch
- Toast/Sonner

Located in: `/frontend/src/components/ui/`

---

## 🔧 Vite Configuration

Key configurations in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8001'
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
})
```

---

## 🐛 Troubleshooting

### "Cannot find module"
```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
# Or change port in vite.config.js
```

### "VITE_BACKEND_URL is undefined"
- Check `.env` file exists
- Variable must start with `VITE_`
- Restart dev server after changing .env

### Build errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
yarn dev
```

---

## 📊 Performance

### Vite vs CRA

| Metric | Vite | Create React App |
|--------|------|------------------|
| Dev Server Start | < 1s | 5-10s |
| Hot Reload | Instant | 1-3s |
| Build Time | 30-60s | 2-5min |
| Bundle Size | Smaller | Larger |

---

## ✅ Testing

### 1. Test Backend
```bash
cd backend
yarn dev
curl http://localhost:8001/api
```

### 2. Test Frontend
```bash
cd frontend
yarn dev
# Opens http://localhost:3000
```

### 3. Test Features
- ✅ Sign up / Login
- ✅ Generate campaign
- ✅ Export PDF/JSON/CSV
- ✅ View library
- ✅ Dashboard charts

---

## 📖 Scripts Reference

### Frontend (package.json)

```json
{
  "scripts": {
    "dev": "vite",              // Start dev server
    "build": "vite build",      // Build for production
    "preview": "vite preview"   // Preview prod build
  }
}
```

### Backend (package.json)

```json
{
  "scripts": {
    "start": "node server.js",     // Production
    "dev": "nodemon server.js"     // Development
  }
}
```

---

## 🎯 File Extensions

**Important:** All React files use `.jsx` extension:
- `App.jsx` ✅
- `Login.jsx` ✅
- `Dashboard.jsx` ✅

This is Vite best practice for React components.

---

## 🔐 Security

- ✅ Environment variables never exposed
- ✅ JWT token verification
- ✅ Row Level Security in Supabase
- ✅ CORS configured
- ✅ Input validation
- ✅ Secure file uploads

---

## 📌 Key Differences from CRA

1. **Entry Point:** `main.jsx` instead of `index.js`
2. **HTML:** `index.html` in root, not in `public/`
3. **Env Variables:** `VITE_` prefix instead of `REACT_APP_`
4. **Access Env:** `import.meta.env` instead of `process.env`
5. **File Extension:** `.jsx` recommended for React files
6. **Config:** `vite.config.js` instead of `webpack.config.js`

---

## 🎉 Success Checklist

- [ ] Node.js v16+ installed
- [ ] Yarn installed
- [ ] Supabase project created
- [ ] SQL script executed
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured (with `VITE_` prefix)
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can sign up / login
- [ ] Can generate campaigns
- [ ] Can export (PDF/JSON/CSV)
- [ ] Dashboard shows data

---

## 🚀 Production Ready

Your app is production-ready with:
- ✅ Optimized Vite build
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Modern ES modules

---

## 📞 Support

- 📧 Email: support@campaignai.com
- 📖 Docs: Full documentation included
- 🐛 Issues: Check troubleshooting section

---

**Built with ❤️ using Node.js + Express + React + Vite + Supabase**

**Vite makes it blazing fast! ⚡**
