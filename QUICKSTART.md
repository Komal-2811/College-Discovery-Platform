# ⚡ Quick Start Guide - College Discovery Platform

## 🏃 5-Minute Local Setup

### Prerequisites
- Node.js 18+ (check: `node --version`)
- PostgreSQL (or use Neon cloud: https://neon.tech)

### Step 1: Clone & Navigate
```bash
cd collegePlatform
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env - Add your PostgreSQL connection string
# DATABASE_URL=postgresql://localhost/college_platform
```

### Step 3: Database Setup
```bash
# Push schema to database
npx prisma db push

# Seed with 8 mock colleges
npm run seed
```

### Step 4: Start Backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 5: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Opens http://localhost:3000
```

## ✅ Local Testing

| Feature | URL | Test |
|---------|-----|------|
| Home Page | http://localhost:3000 | See listing, search, filter |
| Detail Page | http://localhost:3000/college/1 | View courses, placements |
| Compare | Select colleges on home, click "Compare" | See comparison table |
| Predictor | http://localhost:3000/predictor | Enter JEE rank, see colleges |

## 🌍 Deployment (Follow COMPLETE_DEPLOYMENT_GUIDE.md)

1. **Database**: Set up PostgreSQL (Neon recommended)
2. **Backend**: Deploy to Railway/Render
3. **Frontend**: Deploy to Vercel
4. **Connect**: Update API URLs

## 📂 Project Structure
```
collegePlatform/
├── backend/          # Express API
├── frontend/         # Next.js UI
├── README.md
├── COMPLETE_DEPLOYMENT_GUIDE.md
└── FILES_SUMMARY.md
```

## 🔗 Useful Commands

### Backend
```bash
npm run dev         # Start dev server
npm run build       # Build TypeScript
npm run seed        # Reset database with mock data
npm run db:studio   # Open Prisma Studio (GUI)
```

### Frontend
```bash
npm run dev         # Start dev server
npm run build       # Build Next.js
npm run start       # Start production server
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `DATABASE_URL not set` | Create `.env` in backend folder, add PostgreSQL connection |
| `Port 5000 in use` | Change PORT in `backend/.env` |
| `CORS error` | Update `FRONTEND_URL` in backend `.env` |
| `API 404 error` | Ensure `NEXT_PUBLIC_API_URL` is correct in frontend |

## 📚 Full Documentation
- **README.md** - Project overview
- **COMPLETE_DEPLOYMENT_GUIDE.md** - Production deployment
- **FILES_SUMMARY.md** - All files created
- **DEPLOYMENT.md** - Quick reference

## 🎯 Next Steps
1. ✅ Run locally to test
2. ✅ Set up production database
3. ✅ Deploy backend to Railway
4. ✅ Deploy frontend to Vercel
5. ✅ Test live URLs

---

**🎉 Ready to go! Questions? Check COMPLETE_DEPLOYMENT_GUIDE.md**
