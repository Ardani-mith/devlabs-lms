/**
 * Test script to debug course creation issue
 */

async function testCourseCreation() {
  // First login to get a valid token
  const loginResponse = await fetch('http://localhost:4300/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'dani',
      password: '123'
    })
  });

  if (!loginResponse.ok) {
    console.error('Login failed:', await loginResponse.text());
    return;
  }

  const loginData = await loginResponse.json();
  const token = loginData.access_token;
  
  console.log('✅ Login successful, user:', loginData.user);
  console.log('🔑 Token:', token.substring(0, 50) + '...');

  // Test course data - exactly as sent by frontend
  const courseData = {
    title: 'Test Course Frontend',
    description: 'This is a test course from frontend',
    thumbnailUrl: '',
    youtubeEmbedUrl: '',
    youtubeVideoId: '',
    youtubeThumbnailUrl: '',
    category: 'Web Development',
    level: 'Pemula',
    price: 0,
    published: false,
    tags: [],
    lessonsCount: 1,
    totalDurationHours: 1
  };

  console.log('📝 Course data being sent:', courseData);
  console.log('📝 Course data keys:', Object.keys(courseData));

  // Create course
  const createResponse = await fetch('http://localhost:4300/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(courseData)
  });

  console.log('📡 Response status:', createResponse.status);
  console.log('📡 Response headers:', [...createResponse.headers.entries()]);

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.error('❌ Course creation failed:', createResponse.status, errorText);
    
    try {
      const errorJson = JSON.parse(errorText);
      console.error('❌ Error details:', errorJson);
    } catch (e) {
      console.error('❌ Could not parse error as JSON');
    }
    return;
  }

  const courseResult = await createResponse.json();
  console.log('✅ Course created successfully:', courseResult);
}

// Run the test
testCourseCreation().catch(console.error);
