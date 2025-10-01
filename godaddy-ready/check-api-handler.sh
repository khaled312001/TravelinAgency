#!/bin/bash

echo "🔍 Checking api-handler.php configuration..."
echo ""

echo "📦 File sizes:"
ls -lh api-handler.php 2>/dev/null || echo "api-handler.php not found!"
ls -lh godaddy-ready/api-handler-complete.php 2>/dev/null || echo "api-handler-complete.php not found!"
echo ""

echo "🔍 Checking database credentials in api-handler.php:"
grep -A 4 "Database credentials" api-handler.php 2>/dev/null || echo "Not found in api-handler.php"
echo ""

echo "🔍 Checking which routes are in api-handler.php:"
grep -n "elseif.*path ===" api-handler.php | head -10
echo ""

echo "✅ Checking which routes are in the COMPLETE version:"
grep -n "elseif.*path ===" godaddy-ready/api-handler-complete.php | head -10
echo ""

echo "📝 Recommendation: Copy the complete version:"
echo "   cp godaddy-ready/api-handler-complete.php api-handler.php"

