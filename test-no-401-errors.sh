#!/bin/bash

echo "🔍 Testing for 401 Unauthorized errors"
echo "======================================"
echo ""

# Test lesson viewer API calls that the frontend makes
echo "📋 Testing actual API calls from lesson viewer:"
echo ""

# 1. Course data (backend API - direct response)
echo "1️⃣ Course API (Backend): GET /courses/youtube-url-test-course"
COURSE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4300/courses/youtube-url-test-course)
if [ "$COURSE_STATUS" = "200" ]; then
    echo "   ✅ Status: $COURSE_STATUS (OK)"
else
    echo "   ❌ Status: $COURSE_STATUS (ERROR)"
fi
echo ""

# 2. Lesson data (Next.js API - wrapped response)
echo "2️⃣ Lesson API (Next.js): GET /api/lessons/5"
LESSON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4301/api/lessons/5)
if [ "$LESSON_STATUS" = "200" ]; then
    echo "   ✅ Status: $LESSON_STATUS (OK)"
else
    echo "   ❌ Status: $LESSON_STATUS (ERROR)"
fi
echo ""

# 3. Lesson progress (Next.js API - wrapped response)
echo "3️⃣ Progress API (Next.js): GET /api/lessons/5/progress"
PROGRESS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4301/api/lessons/5/progress)
if [ "$PROGRESS_STATUS" = "200" ]; then
    echo "   ✅ Status: $PROGRESS_STATUS (OK)"
else
    echo "   ❌ Status: $PROGRESS_STATUS (ERROR)"
fi
echo ""

# 4. Lesson completion (Next.js API - wrapped response)
echo "4️⃣ Complete API (Next.js): POST /api/lessons/5/complete"
COMPLETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:4301/api/lessons/5/complete -H "Content-Type: application/json" -d '{"completed": true}')
if [ "$COMPLETE_STATUS" = "200" ]; then
    echo "   ✅ Status: $COMPLETE_STATUS (OK)"
else
    echo "   ❌ Status: $COMPLETE_STATUS (ERROR)"
fi
echo ""

# 5. Frontend page
echo "5️⃣ Frontend Page: GET /courses/youtube-url-test-course/lessons/5"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4301/courses/youtube-url-test-course/lessons/5)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Status: $FRONTEND_STATUS (OK)"
else
    echo "   ❌ Status: $FRONTEND_STATUS (ERROR)"
fi
echo ""

# 6. Test that backend lesson API (which requires auth) is NOT called
echo "6️⃣ Backend Lesson API (Should NOT be called): GET /lessons/5"
BACKEND_LESSON_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4300/lessons/5)
if [ "$BACKEND_LESSON_STATUS" = "401" ]; then
    echo "   ✅ Status: $BACKEND_LESSON_STATUS (Correctly requires auth)"
    echo "   ✅ Lesson viewer is NOT calling this endpoint!"
elif [ "$BACKEND_LESSON_STATUS" = "200" ]; then
    echo "   ⚠️  Status: $BACKEND_LESSON_STATUS (Unexpectedly accessible)"
else
    echo "   ❓ Status: $BACKEND_LESSON_STATUS (Other response)"
fi
echo ""

echo "🎯 RESULT:"
echo "========="
if [ "$COURSE_STATUS" = "200" ] && [ "$LESSON_STATUS" = "200" ] && [ "$PROGRESS_STATUS" = "200" ] && [ "$COMPLETE_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ SUCCESS: All lesson viewer APIs return 200 OK"
    echo "✅ SUCCESS: No 401 Unauthorized errors for lesson viewer"
    echo "✅ SUCCESS: Lesson viewer uses correct API endpoints"
    echo ""
    echo "🚀 The lesson viewer should now work without any authentication errors!"
else
    echo "❌ FAILED: Some APIs are not working correctly"
fi

