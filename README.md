# College Discovery Platform - Setup Guide

## Project Overview
A production-grade college discovery platform with listing, detailed pages, comparison, and predictor tools.

**Features Built:**
1. ✅ College Listing + Search with filters
2. ✅ College Detail Page with courses/placements/reviews
3. ✅ Compare Colleges side-by-side
4. ✅ Predictor Tool (rank-based matching)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Setup database
npx prisma db push
npm run seed

# Run development server
npm run dev
```

The backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Run development server
npm run dev
```

The frontend runs on `http://localhost:3000`

## API Endpoints

### Colleges
- `GET /api/colleges` - List colleges with filters
- `GET /api/colleges/:id` - Get college details
- `POST /api/colleges/:id/reviews` - Add review

### Comparisons
- `POST /api/comparisons` - Create comparison
- `GET /api/comparisons/:id` - Get comparison
- `DELETE /api/comparisons/:id` - Delete comparison

### Predictor
- `POST /api/predictor/predict` - Predict colleges by rank

## Mock Data
Pre-seeded with 8 colleges including:
- IIT Delhi, IIT Bombay, IIT Madras
- NIT Trichy, DTU
- VIT, Manipal, BITS Pilani

Each college has courses, placements, and reviews.

## Database Schema
- **College** - Main college info
- **Course** - Courses offered
- **Placement** - Placement statistics
- **Review** - Student reviews
- **Comparison** - Saved comparisons
- **PredictorMatch** - Rank ranges for colleges

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Features
✅ Fast pagination with infinite scroll support
✅ Real-time search across college names
✅ Filter by location and fees
✅ Detailed college profiles with tabs
✅ Student reviews (mock allowed)
✅ Side-by-side comparison table
✅ CSV export for comparisons
✅ Rank-based college predictor
✅ Responsive Tailwind UI
✅ TypeScript throughout

## File Structure
```
collegePlatform/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express server
│   │   ├── controllers/           # Business logic
│   │   ├── routes/                # API endpoints
│   │   ├── seed.ts                # Data seeding
│   │   └── utils/
│   ├── prisma/schema.prisma       # Database schema
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx               # Home (listing)
│   │   ├── college/[id]/page.tsx  # Detail page
│   │   ├── compare/page.tsx       # Comparison
│   │   ├── predictor/page.tsx     # Predictor tool
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   └── types.ts               # TypeScript types
│   └── package.json
│
└── DEPLOYMENT.md                  # Deployment guide
```

## Next Steps
1. Set up PostgreSQL database
2. Run backend: `npm install && npm run dev` (backend/)
3. Run frontend: `npm install && npm run dev` (frontend/)
4. Deploy to Vercel + Railway
5. Add custom styling/features as needed

## Support
For issues or feature requests, check the deployment guide first.
