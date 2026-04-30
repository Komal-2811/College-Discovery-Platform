#!/bin/bash

echo "🎓 College Discovery Platform - Complete Setup"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📍 Starting setup...${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is required. Installing...${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js found${NC}: $(node --version)"
echo ""

# Backend setup
echo -e "${BLUE}1️⃣  Setting up Backend...${NC}"
cd backend
npm install > /dev/null 2>&1
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}📝 Created .env - Please edit DATABASE_URL${NC}"
fi
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
echo ""

# Frontend setup
cd ../frontend
echo -e "${BLUE}2️⃣  Setting up Frontend...${NC}"
npm install > /dev/null 2>&1
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
echo ""

echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo -e "${BLUE}📌 Next steps:${NC}"
echo ""
echo "1. Set up PostgreSQL:"
echo "   - Option A: Local PostgreSQL"
echo "   - Option B: Neon Cloud (https://neon.tech)"
echo ""
echo "2. Edit 'backend/.env' with your DATABASE_URL"
echo ""
echo "3. Initialize database:"
cd ../backend
echo "   npm run db:push"
echo "   npm run seed"
echo ""
echo "4. Start development servers:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "5. Open http://localhost:3000"
echo ""
echo -e "${BLUE}📚 For deployment, see COMPLETE_DEPLOYMENT_GUIDE.md${NC}"
echo ""
