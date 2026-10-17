#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

echo "=================================================="
echo "⚡ Setting up Kartik Chauhan's GitHub Profile Repo"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing local git repository..."
    git init -b main
else
    echo "✅ Git repository already initialized."
    git branch -M main
fi

# Configure remote
REMOTE_URL="git@github.com:chauhankartik/chauhankartik.git"
if git remote | grep -q "origin"; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi
echo "🔗 Remote origin set to $REMOTE_URL"

# Stage files
git add README.md header.svg
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit."
else
    git commit -m "feat: initialize staff systems architect github profile readme"
    echo "💾 Committed changes."
fi

echo ""
echo "🔍 Checking if remote repo chauhankartik/chauhankartik exists on GitHub..."
if git ls-remote "$REMOTE_URL" > /dev/null 2>&1; then
    echo "🚀 Remote repo exists! Pushing to GitHub (main branch)..."
    git push -u origin main
    echo "✨ Profile README successfully deployed! Check https://github.com/chauhankartik"
else
    echo "⚠️  The special repository 'chauhankartik/chauhankartik' has not been created on GitHub yet."
    echo ""
    echo "👉 Please follow these 2 quick steps:"
    echo "   1. Open: https://github.com/new"
    echo "   2. Repository name: chauhankartik"
    echo "      (Make sure it is marked PUBLIC, no need to add README since we have it ready)"
    echo "   3. Run this script again: ./setup_and_push.sh"
    echo ""
    echo "Once created, running this script will instantly push your profile banner & README!"
fi
