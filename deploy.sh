#!/bin/bash
# Quick deploy script
echo "🚀 Deploying vocab app..."
npm run build
npm run deploy
echo "✅ Deployment complete!"