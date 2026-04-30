# 🎓 College Discovery Platform - Complete Setup & Deployment

## ✅ What's Built (4 Features - End-to-End)

### 1. 🔍 College Listing + Search
- **Frontend**: Home page with pagination
- **Features**:
  - Search by college name
  - Filter by location, fees
  - Show 9 colleges per page
  - Fast, usable UI with Tailwind CSS
- **Backend**: REST API with query parameters

### 2. 🏫 College Detail Page
- **Frontend**: Dynamic route `/college/[id]`
- **Features**:
  - College overview
  - Courses tab (list all programs)
  - Placements tab (salary, % placement)
  - Reviews tab (read & submit reviews)
- **Backend**: Full college data with relationships

### 3. ⚖️ Compare Colleges (HIGH PRIORITY)
- **Frontend**: `/compare` page
- **Features**:
  - Select 2-5 colleges from listing
  - Side-by-side comparison table
  - Compare: Fees, Rating, Placement, Location, Courses
  - **CSV export** functionality
  - Remove colleges to refine
- **Backend**: Comparison endpoints with college data

### 4. 🧠 Simple Predictor Tool
- **Frontend**: `/predictor` page
- **Features**:
  - Input: Exam (JEE/NEET) + Rank
  - Output: Matching colleges
  - Rank-based logic (rule-based)
  - Integrates with comparison
- **Backend**: Predictor model in database

---

## 🗄️ Database Schema (PostgreSQL)

```
College
├── id, name, location, state, city
├── fees, rating, reviewCount, description
├── founded, affiliatedTo, image
└── Relations: courses, placements, reviews, comparisons

Course
├── id, name, duration, specialization
└── collegeId (FK)

Placement
├── id, year, placementPercent
├── avgPackage, highestPackage, topRecruiter
└── collegeId (FK)

Review
├── id, rating, title, content
├── author, createdAt
└── collegeId (FK)

Comparison
├── id, userId (optional), name
└── colleges (many-to-many via ComparisonCollege)

PredictorMatch
├── id, exam, minRank, maxRank
└── collegeId (FK)
```

---

## 🚀 Deployment Instructions

### **STEP 1: Local Setup**

#### Backend
```bash
cd backend
npm install
cp .env.example .env

# Edit .env with database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/college_platform

npx prisma db push
npm run seed
npm run dev
```

✅ Backend runs on: `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

✅ Frontend runs on: `http://localhost:3000`

---

### **STEP 2: Database Setup (Choose One)**

#### Option A: PostgreSQL Locally
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb college_platform

# Set DATABASE_URL
# DATABASE_URL=postgresql://localhost/college_platform
```

#### Option B: Neon (Cloud PostgreSQL - Recommended)
1. Go to https://neon.tech
2. Sign up (free tier available)
3. Create project → Get CONNECTION_STRING
4. Copy to `.env`:
   ```
   DATABASE_URL=postgresql://username:password@...
   ```

#### Option C: AWS RDS
1. Create RDS PostgreSQL instance
2. Get endpoint from AWS console
3. Copy to `.env`

---

### **STEP 3: Deploy Backend**

#### Option A: Railway (Recommended - Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# In backend folder
railway login
railway init
railway add --postgres  # Creates DB for you
railway variables set NODE_ENV=production
railway up
```

Get URL like: `https://your-app.railway.app`

#### Option B: Render
1. Go to https://render.com
2. Create new **Web Service**
3. Connect GitHub repo (push backend folder)
4. Environment variables:
   ```
   DATABASE_URL=<from-render-postgres>
   NODE_ENV=production
   ```
5. Deploy

Get URL like: `https://your-app.onrender.com`

#### Option C: Heroku
```bash
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

---

### **STEP 4: Deploy Frontend to Vercel**

```bash
# Option 1: Using Vercel CLI
npm install -g vercel
cd frontend
vercel
```

**Or Option 2: GitHub + Vercel Dashboard**
1. Push code to GitHub
2. Go to https://vercel.com
3. Import project → select frontend folder
4. Environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
5. Deploy

Get URL like: `https://your-app.vercel.app`

---

### **STEP 5: Configure CORS**

Update backend `.env` (after deployment):
```
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy backend.

---

## 📋 Deployment Checklist

- [ ] **Database**: PostgreSQL setup (local or cloud)
- [ ] **Backend**:
  - [ ] Install dependencies: `npm install`
  - [ ] Setup `.env` with `DATABASE_URL`
  - [ ] Run migrations: `npx prisma db push`
  - [ ] Seed data: `npm run seed`
  - [ ] Test locally: `npm run dev` → check `http://localhost:5000/health`
  - [ ] Deploy to Railway/Render/Heroku
  - [ ] Get backend URL
- [ ] **Frontend**:
  - [ ] Install dependencies: `npm install`
  - [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
  - [ ] Test locally: `npm run dev` → check `http://localhost:3000`
  - [ ] Push to GitHub
  - [ ] Deploy to Vercel
  - [ ] Get frontend URL
- [ ] **Cross-Check**:
  - [ ] Backend health endpoint works: `https://your-backend/health`
  - [ ] Frontend loads without CORS errors
  - [ ] Listing page fetches colleges
  - [ ] College detail page works
  - [ ] Comparison works
  - [ ] Predictor tool works

---

## 🔗 Live URLs After Deployment

```
🎓 Frontend: https://your-app.vercel.app
🖥️ Backend API: https://your-backend.railway.app/api
💾 Database: PostgreSQL (Neon/Railway/RDS)
```

**Test endpoints:**
- `https://your-backend.railway.app/health` → should return `{"status":"ok"}`
- `https://your-backend.railway.app/api/colleges` → should return college data
- `https://your-app.vercel.app` → should load the UI

---

## 🛠️ Development Tips

### Mock Data
Pre-seeded with 8 colleges:
- IIT Delhi, IIT Bombay, IIT Madras
- NIT Trichy, DTU
- VIT, Manipal, BITS Pilani

Run `npm run seed` anytime to reset data.

### Add More Colleges
Edit `backend/src/seed.ts` and add to `COLLEGES_DATA` array.

### API Testing
Use Postman/Insomnia:
```
POST http://localhost:5000/api/comparisons
{
  "collegeIds": [1, 2, 3],
  "name": "My Comparison"
}
```

### Debugging
- Backend logs: Check terminal output
- Frontend errors: Open browser DevTools (F12)
- Database: `npm run db:studio` (opens Prisma Studio)

---

## 🚦 Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend API | ⏳ Ready to Deploy | https://your-backend.railway.app |
| Frontend | ⏳ Ready to Deploy | https://your-app.vercel.app |
| Database | ⏳ Setup Required | PostgreSQL |
| Mock Data | ✅ Included | 8 colleges |

---

## 📚 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Deployment | Vercel (Frontend), Railway (Backend) |

---

## ⚠️ Common Issues & Fixes

**CORS Error**
→ Check `FRONTEND_URL` in backend `.env`

**Database Connection Failed**
→ Check `DATABASE_URL` format and PostgreSQL is running

**API calls returning 404**
→ Ensure `NEXT_PUBLIC_API_URL` is correct in frontend

**Port already in use**
→ Change PORT in backend `.env` or kill existing process

---

## ✨ Next Steps After Deployment

1. ✅ Test all features on live URL
2. ✅ Add custom domain (Vercel + Railway support this)
3. ✅ Set up analytics
4. ✅ Add more colleges to database
5. ✅ Implement user authentication (optional)
6. ✅ Add email notifications (optional)

---

**🎉 Congratulations! Your College Discovery Platform is ready to deploy!**

For questions, check the API endpoints in `backend/src/routes/`
