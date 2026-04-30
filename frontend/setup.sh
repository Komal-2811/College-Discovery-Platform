#!/bin/bash

echo "🎨 College Platform - Frontend Setup Script"
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

# Create .env.local
echo ""
echo "🔧 Setting up environment..."
if [ ! -f .env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Make sure backend is running on http://localhost:5000"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Frontend will run on http://localhost:3000"
echo ""
