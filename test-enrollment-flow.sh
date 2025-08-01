#!/bin/bash

# 🧪 LMS Course Enrollment Testing Script
# Usage: ./test-enrollment-flow.sh [course-slug]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default course slug
COURSE_SLUG=${1:-"react-fundamentals"}
BASE_URL="http://localhost:4301"

echo -e "${BLUE}🧪 LMS Course Enrollment Testing Script${NC}"
echo -e "${BLUE}======================================${NC}"
echo -e "Course: ${YELLOW}${COURSE_SLUG}${NC}"
echo -e "URL: ${YELLOW}${BASE_URL}/courses/${COURSE_SLUG}${NC}"
echo ""

# Check if servers are running
echo -e "${BLUE}🔍 Checking servers...${NC}"

# Check frontend
if curl -s "${BASE_URL}" > /dev/null; then
    echo -e "${GREEN}✅ Frontend server running on ${BASE_URL}${NC}"
else
    echo -e "${RED}❌ Frontend server not running on ${BASE_URL}${NC}"
    echo -e "${YELLOW}💡 Run: npm run dev${NC}"
    exit 1
fi

# Check backend
if curl -s "http://localhost:4300/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend server running on http://localhost:4300${NC}"
else
    echo -e "${YELLOW}⚠️  Backend server might not be running on http://localhost:4300${NC}"
    echo -e "${YELLOW}💡 Run: npm run start (in backend directory)${NC}"
fi

echo ""

# Test scenarios
echo -e "${BLUE}🎯 Test Scenarios${NC}"
echo -e "${BLUE}=================${NC}"

echo -e "${YELLOW}📋 Manual Testing Checklist:${NC}"
echo ""

echo -e "${GREEN}Szenario 1: Non-Enrolled User${NC}"
echo "1. Open: ${BASE_URL}/courses/${COURSE_SLUG}"
echo "2. Verify TestControlPanel shows 'Not Enrolled'"
echo "3. Check info banner: 'Mode Preview - Belum Terdaftar'"
echo "4. Check sidebar: 'Daftar Gratis' or 'Daftar Kursus' button"
echo "5. Check lessons: Lock/Preview icons visible"
echo "6. Check progress bar: Should not be visible"
echo ""

echo -e "${GREEN}Szenario 2: Just Enrolled (0% Progress)${NC}"
echo "1. Click 'Simulate Enrollment' in TestControlPanel"
echo "2. Verify info banner changes to progress info"
echo "3. Check sidebar: Shows 'Progres Belajar Anda: 0%'"
echo "4. Check lessons: No more lock icons"
echo "5. Check progress bar: Visible with 0%"
echo ""

echo -e "${GREEN}Szenario 3: Learning Progress (Partial)${NC}"
echo "1. Click 'Complete Lesson' buttons in TestControlPanel"
echo "2. Verify progress bar updates (e.g., 20%, 40%)"
echo "3. Check completed lessons show checkmark icons"
echo "4. Check progress counter updates"
echo ""

echo -e "${GREEN}Szenario 4: Course Completed (100%)${NC}"
echo "1. Set progress to 100% via TestControlPanel"
echo "2. Verify progress bar shows 100%"
echo "3. Check certificate download button appears"
echo "4. Check all lessons show completed status"
echo ""

echo -e "${GREEN}Szenario 5: Reset and Retest${NC}"
echo "1. Click 'Reset Enrollment' in TestControlPanel"
echo "2. Refresh page"
echo "3. Verify back to non-enrolled state"
echo "4. Repeat scenarios 1-4"
echo ""

# UI Elements to check
echo -e "${YELLOW}🎨 UI Elements Checklist:${NC}"
echo ""
echo "Course Detail Page:"
echo "  □ Course header responsive"
echo "  □ Tabs navigation working"
echo "  □ Info banners conditional rendering"
echo "  □ Content organization proper"
echo ""
echo "Sidebar (CourseInfoSidebar):"
echo "  □ Course info consistent"
echo "  □ Enrollment/Purchase buttons"
echo "  □ Progress bar and percentage"
echo "  □ Continue learning button"
echo "  □ Certificate download button"
echo ""
echo "Lessons/Modules (ModuleAccordion):"
echo "  □ Lesson status icons"
echo "  □ Lesson badges (PREVIEW/TERKUNCI/SELESAI)"
echo "  □ Module collapse/expand"
echo "  □ Lesson accessibility by enrollment"
echo ""
echo "Responsive Design:"
echo "  □ Mobile view (< 768px)"
echo "  □ Tablet view (768px - 1024px)"
echo "  □ Desktop view (> 1024px)"
echo "  □ Dark mode compatibility"
echo ""

# Browser testing commands
echo -e "${YELLOW}🔧 Browser Testing Commands:${NC}"
echo ""
echo "Open browser console and run:"
echo ""
echo "// Check current test data"
echo "getTestEnrollmentData('${COURSE_SLUG}')"
echo ""
echo "// Clear test data"
echo "localStorage.clear()"
echo ""
echo "// Manual enrollment simulation"
echo "simulateEnrollment('${COURSE_SLUG}')"
echo ""
echo "// Manual lesson completion"
echo "simulateLessonComplete('${COURSE_SLUG}', 'lesson-1', 'Introduction')"
echo ""
echo "// Reset enrollment"
echo "resetEnrollment('${COURSE_SLUG}')"
echo ""

# Performance check
echo -e "${YELLOW}📊 Performance Checklist:${NC}"
echo "  □ Page load time < 2s"
echo "  □ No console errors/warnings"
echo "  □ Smooth state transitions"
echo "  □ Memory usage acceptable"
echo ""

# Final instructions
echo -e "${BLUE}🚀 Ready to Test!${NC}"
echo ""
echo -e "${GREEN}1. Open browser: ${BASE_URL}/courses/${COURSE_SLUG}${NC}"
echo -e "${GREEN}2. Open browser dev tools (F12)${NC}"
echo -e "${GREEN}3. Follow the manual testing scenarios above${NC}"
echo -e "${GREEN}4. Use TestControlPanel for state simulation${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "- TestControlPanel only appears in development mode"
echo "- All state changes are logged to console"
echo "- Test with multiple course slugs for consistency"
echo "- Test in both light and dark modes"
echo ""
echo -e "${BLUE}Happy Testing! 🎉${NC}"
