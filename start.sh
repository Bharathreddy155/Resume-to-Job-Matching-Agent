#!/usr/bin/env bash
# MatchPulse AI - One-Click Launcher for Team

echo "🚀 Starting MatchPulse AI Platform..."

# 1. Start Backend in background
echo "⚡ Launching FastAPI Backend on http://localhost:8000..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "✨ Launching React/Vite Frontend on http://localhost:5173..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================================="
echo "🎯 App is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "=================================================="
echo "Press CTRL+C to terminate both servers."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
