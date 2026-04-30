# College Discovery Platform - Deployment Guide

## Backend Deployment (Railway/Render)

### Step 1: Prepare Database
1. Use PostgreSQL (Neon, AWS RDS, or Railway)
2. Get DATABASE_URL from your provider

### Step 2: Deploy Backend
#### Option A: Using Railway
```bash
# Login to Railway CLI
npm install -g @railway/cli
railway login

# Deploy
railway init
railway add --postgres
railway variables set DATABASE_URL=<your-postgresql-url>
railway up
```

#### Option B: Using Render
1. Go to render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set environment variables:
   - DATABASE_URL
   - NODE_ENV=production
5. Deploy

### Step 3: Setup Database
```bash
# Run migrations
npx prisma migrate deploy

# Seed data
npm run seed
```

## Frontend Deployment (Vercel)

### Step 1: Deploy
```bash
# Using Vercel CLI
npm install -g vercel
vercel
```

Or manually:
1. Push code to GitHub
2. Go to vercel.com
3. Import project
4. Set environment variable:
   - NEXT_PUBLIC_API_URL=<backend-url>
5. Deploy

### Step 2: Configure CORS
Update backend `.env`:
```
FRONTEND_URL=<your-vercel-domain>
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/college_platform
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## Testing Live
1. Backend: https://your-backend/health
2. Frontend: https://your-frontend.vercel.app
3. API: https://your-backend/api/colleges
