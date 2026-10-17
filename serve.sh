#!/usr/bin/env bash
PORT=${1:-8000}
echo "🚀 Starting 2026 Master Study Hub on http://localhost:$PORT"
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT"
