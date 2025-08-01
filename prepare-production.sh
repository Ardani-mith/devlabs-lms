#!/bin/bash

echo "🚀 Production Preparation - Remove Dev/Test Components"
echo "====================================================="
echo ""

echo "📋 Items to Remove for Production:"
echo ""
echo "🧪 DEV/TEST COMPONENTS:"
echo "   □ TestControlPanel component"
echo "   □ DebugConsole component"
echo "   □ Test utility functions"
echo "   □ Console.log statements"
echo "   □ Debug buttons in LessonManager"
echo ""

echo "📁 FILES TO CLEAN UP:"
echo "   □ /components/dev/TestControlPanel.tsx"
echo "   □ /components/dev/DebugConsole.tsx"
echo "   □ /lib/utils/testEnrollment.ts"
echo "   □ Test scripts (test-*.sh files)"
echo ""

echo "🧹 CODE TO REMOVE:"
echo "   □ TestControlPanel imports and usage"
echo "   □ DebugConsole imports and usage"
echo "   □ testUtils global window extensions"
echo "   □ Development console.log statements"
echo "   □ Debug UI in course components"
echo ""

echo "⚠️  WARNING: This will permanently remove dev/test code!"
echo "Make sure you have a backup or are in a separate branch."
echo ""

read -p "Do you want to proceed with production cleanup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled. No changes made."
    exit 1
fi

echo ""
echo "🧹 Starting production cleanup..."
echo ""

# Remove dev component files
echo "1. Removing dev component files..."
if [ -f "components/dev/TestControlPanel.tsx" ]; then
    rm "components/dev/TestControlPanel.tsx"
    echo "   ✅ Removed TestControlPanel.tsx"
fi

if [ -f "components/dev/DebugConsole.tsx" ]; then
    rm "components/dev/DebugConsole.tsx"
    echo "   ✅ Removed DebugConsole.tsx"
fi

if [ -d "components/dev" ] && [ -z "$(ls -A components/dev)" ]; then
    rmdir "components/dev"
    echo "   ✅ Removed empty dev directory"
fi

# Remove test utilities
echo "2. Removing test utilities..."
if [ -f "lib/utils/testEnrollment.ts" ]; then
    rm "lib/utils/testEnrollment.ts"
    echo "   ✅ Removed testEnrollment.ts"
fi

# Remove test scripts
echo "3. Removing test scripts..."
for script in test-*.sh; do
    if [ -f "$script" ]; then
        rm "$script"
        echo "   ✅ Removed $script"
    fi
done

echo "4. Cleaning up code references..."

# Remove TestControlPanel from course page
if grep -q "TestControlPanel" "app/courses/[slug]/page.tsx"; then
    echo "   🔧 Removing TestControlPanel from course page..."
    
    # Remove import
    sed -i '' '/import.*TestControlPanel/d' "app/courses/[slug]/page.tsx"
    
    # Remove component usage (including the entire dev section)
    sed -i '' '/{\/\* DEV\/TEST CONTROLS \*\/}/,/{\/\* END DEV\/TEST CONTROLS \*\/}/d' "app/courses/[slug]/page.tsx"
    
    echo "   ✅ Cleaned course page"
fi

# Remove DebugConsole from course page
if grep -q "DebugConsole" "app/courses/[slug]/page.tsx"; then
    sed -i '' '/import.*DebugConsole/d' "app/courses/[slug]/page.tsx"
    sed -i '' '/<DebugConsole/d' "app/courses/[slug]/page.tsx"
    echo "   ✅ Removed DebugConsole"
fi

# Remove testUtils from course page
if grep -q "testUtils" "app/courses/[slug]/page.tsx"; then
    sed -i '' '/testUtils/d' "app/courses/[slug]/page.tsx"
    echo "   ✅ Removed testUtils references"
fi

# Clean up LessonManager debug buttons
if grep -q "Debug.*Test" "app/manage-course/components/LessonManager.tsx"; then
    echo "   🔧 Removing debug buttons from LessonManager..."
    # This would need more specific regex patterns based on the actual debug UI
    echo "   ⚠️  Manual review needed for LessonManager debug UI"
fi

# Remove console.log statements (with caution)
echo "5. Scanning for console.log statements..."
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next | while read file; do
    if grep -q "console.log" "$file"; then
        echo "   ⚠️  Found console.log in: $file"
    fi
done

echo ""
echo "✅ Production cleanup completed!"
echo ""

echo "📋 MANUAL REVIEW NEEDED:"
echo ""
echo "🔍 Please manually review these files:"
echo "   □ app/courses/[slug]/page.tsx - Check for remaining dev code"
echo "   □ app/manage-course/components/LessonManager.tsx - Remove debug UI"
echo "   □ Any files with console.log statements (listed above)"
echo "   □ Remove any remaining test/dev imports"
echo ""

echo "🧪 RECOMMENDED FINAL CHECKS:"
echo ""
echo "1. Build the project:"
echo "   npm run build"
echo ""
echo "2. Check for TypeScript errors:"
echo "   npm run type-check"
echo ""
echo "3. Run linting:"
echo "   npm run lint"
echo ""
echo "4. Test production build:"
echo "   npm run start"
echo ""

echo "🎯 PRODUCTION CHECKLIST:"
echo ""
echo "✅ VERIFY THESE ARE REMOVED:"
echo "   □ No TestControlPanel component"
echo "   □ No DebugConsole component"
echo "   □ No testUtils functions"
echo "   □ No test-*.sh scripts"
echo "   □ No dev/debug UI elements"
echo "   □ Minimal console.log statements"
echo "   □ No broken imports/references"
echo ""

echo "✅ VERIFY THESE STILL WORK:"
echo "   □ Course enrollment flow"
echo "   □ Sidebar collapse/expand"
echo "   □ Lesson management"
echo "   □ All user authentication"
echo "   □ Responsive design"
echo "   □ Production build completes"
echo ""

echo "🎉 Ready for production deployment!"
echo ""
echo "💡 Tip: Test the production build thoroughly before deploying."
