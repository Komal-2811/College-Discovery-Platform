#!/bin/bash

echo "🚀 College Platform - Backend Setup Script"
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env with your DATABASE_URL"
    echo "   Example: postgresql://user:password@localhost:5432/college_platform"
fi

# Setup database
echo ""
echo "🗄️  Setting up database..."
npx prisma db push

echo ""
echo "🌱 Seeding database with college data..."
npm run seed

echo ""
echo "✨ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Edit .env with your database credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Backend will run on http://localhost:5000"
echo ""
