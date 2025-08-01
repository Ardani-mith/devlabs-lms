#!/bin/bash

# 🧪 Test Script: Enrollment UI Behavior
# Validates that enrollment buttons disappear after user enrolls

echo "🎯 Testing Enrollment UI Behavior"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

COURSE_URL="http://localhost:4301/courses/youtube-url-test-course"

echo -e "${BLUE}Course URL: ${COURSE_URL}${NC}"
echo ""

echo -e "${YELLOW}📋 UI Elements Checklist - Before Enrollment:${NC}"
echo "  □ 'Daftar Gratis' or 'Daftar Kursus' button visible in header"
echo "  □ 'Simpan ke Wishlist' button visible"
echo "  □ 'Daftar Gratis' button visible in sidebar"
echo "  □ No progress bar in header"
echo "  □ Preview banner visible in content"
echo "  □ Lock icons on lessons"
echo ""

echo -e "${YELLOW}📋 UI Elements Checklist - After Enrollment:${NC}"
echo "  □ 'Mulai Belajar Sekarang' or 'Lanjutkan Belajar' button in header"
echo "  □ NO 'Daftar' buttons anywhere"
echo "  □ NO 'Simpan ke Wishlist' button"
echo "  □ Progress bar visible in header"
echo "  □ Progress card visible in sidebar"
echo "  □ No preview banner (replaced with progress banner)"
echo "  □ No lock icons on lessons"
echo ""

echo -e "${BLUE}🚀 Testing Steps:${NC}"
echo ""

echo -e "${GREEN}Step 1: Test Non-Enrolled State${NC}"
echo "1. Open: ${COURSE_URL}"
echo "2. Open browser console (F12)"
echo "3. Run: testUtils.testScenario1()"
echo "4. Verify all 'Before Enrollment' items are visible"
echo ""

echo -e "${GREEN}Step 2: Test Enrollment State${NC}"
echo "1. Run: testUtils.testScenario2()"
echo "2. Verify all 'After Enrollment' items are correct"
echo "3. Ensure NO enrollment buttons are visible"
echo ""

echo -e "${GREEN}Step 3: Test Progress States${NC}"
echo "1. Run: testUtils.testScenario3() // 50% progress"
echo "2. Verify progress bar shows 50%"
echo "3. Verify 'Lanjutkan Belajar' button text"
echo "4. Run: testUtils.testScenario4() // 100% complete"
echo "5. Verify certificate button appears in sidebar"
echo ""

echo -e "${GREEN}Step 4: Reset and Repeat${NC}"
echo "1. Run: testUtils.testScenario1()"
echo "2. Verify back to non-enrolled state"
echo "3. All enrollment buttons should be back"
echo ""

echo -e "${YELLOW}🔍 Console Commands for Quick Testing:${NC}"
echo ""
echo "// Test enrollment state changes"
echo "testUtils.testScenario1()  // Non-enrolled"
echo "testUtils.testScenario2()  // Just enrolled"
echo "testUtils.testScenario3()  // 50% progress"
echo "testUtils.testScenario4()  // Completed"
echo ""
echo "// Check current state"
echo "testUtils.getTestEnrollmentData()"
echo ""
echo "// Manual enrollment"
echo "testUtils.simulateEnrollment()"
echo "testUtils.resetEnrollment()"
echo ""

echo -e "${BLUE}🎯 Expected Behavior Summary:${NC}"
cat << 'EOF'

NON-ENROLLED STATE:
├── Header
│   ├── ✅ "Daftar Gratis" button
│   ├── ✅ "Simpan ke Wishlist" button
│   └── ❌ No progress bar
├── Sidebar
│   ├── ✅ "Daftar Gratis" button
│   └── ❌ No progress card
└── Content
    ├── ✅ Preview banner
    └── ✅ Lock icons on lessons

ENROLLED STATE:
├── Header
│   ├── ✅ "Mulai/Lanjutkan Belajar" button
│   ├── ✅ Progress bar
│   ├── ❌ NO "Daftar" buttons
│   └── ❌ NO "Wishlist" button
├── Sidebar
│   ├── ✅ Progress card
│   └── ❌ NO "Daftar" button
└── Content
    ├── ✅ Progress banner
    └── ❌ No lock icons

COMPLETED STATE:
├── All enrolled state features +
├── Sidebar
│   └── ✅ "Unduh Sertifikat" button
└── Header
    └── ✅ "Lanjutkan Belajar" (if continue available)

EOF

echo ""
echo -e "${GREEN}Ready to test! Open ${COURSE_URL} and follow the steps above.${NC}"
echo -e "${YELLOW}💡 Tip: Keep this terminal open as reference while testing.${NC}"
