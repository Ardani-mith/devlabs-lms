import { NextRequest, NextResponse } from 'next/server';

// Mock data for lesson details - In production, this would come from your database
const mockLessons: Record<string, any> = {
  "1": {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the basics of web development including HTML, CSS, and JavaScript fundamentals.",
    content: "This comprehensive lesson covers the fundamentals of web development...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 1800, // 30 minutes in seconds
    durationMinutes: 30,
    order: 1,
    moduleId: "module-1",
    courseName: "Web Development Fundamentals",
    type: "video",
    status: "tersedia",
    isPreviewable: true
  },
  "2": {
    id: "2",
    title: "HTML Fundamentals",
    description: "Deep dive into HTML structure, semantics, and best practices.",
    content: "HTML is the foundation of web development...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
    duration: 2400, // 40 minutes in seconds
    durationMinutes: 40,
    order: 2,
    moduleId: "module-1",
    courseName: "Web Development Fundamentals",
    type: "video",
    status: "tersedia",
    isPreviewable: false
  },
  "3": {
    id: "3",
    title: "CSS Styling and Layouts",
    description: "Master CSS for styling and creating responsive layouts.",
    content: "CSS allows you to style your HTML elements...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 2700, // 45 minutes in seconds
    durationMinutes: 45,
    order: 3,
    moduleId: "module-1", 
    courseName: "Web Development Fundamentals",
    type: "video",
    status: "tersedia",
    isPreviewable: false
  },
  "4": {
    id: "4",
    title: "JavaScript Basics",
    description: "Introduction to JavaScript programming concepts and DOM manipulation.",
    content: "JavaScript brings interactivity to your web pages...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 3600, // 60 minutes in seconds
    durationMinutes: 60,
    order: 4,
    moduleId: "module-2",
    courseName: "Web Development Fundamentals", 
    type: "video",
    status: "tersedia",
    isPreviewable: false
  },
  "5": {
    id: "5",
    title: "Test Lesson 1754015923064",
    description: "This is a test lesson for YouTube video embedding and progress tracking.",
    content: "This is a comprehensive test lesson...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 180, // 3 minutes in seconds
    durationMinutes: 3,
    order: 1,
    moduleId: "module-1",
    courseName: "YouTube URL Test Course",
    type: "video",
    status: "tersedia",
    isPreviewable: true
  },
  "6": {
    id: "6", 
    title: "Test Lesson 1754015923597",
    description: "Advanced lesson with interactive content and assessments.",
    content: "This advanced lesson covers...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 180,
    durationMinutes: 3,
    order: 2,
    moduleId: "module-1",
    courseName: "YouTube URL Test Course",
    type: "video",
    status: "tersedia",
    isPreviewable: false
  },
  "7": {
    id: "7",
    title: "Responsive Design Principles",
    description: "Learn how to create responsive designs that work on all devices.",
    content: "Responsive design ensures your website looks great on all devices...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 2100, // 35 minutes in seconds
    durationMinutes: 35,
    order: 5,
    moduleId: "module-2",
    courseName: "Web Development Fundamentals",
    type: "video",
    status: "tersedia",
    isPreviewable: false
  },
  "8": {
    id: "8",
    title: "Test Lesson 1754015934247",
    description: "This is a comprehensive test lesson for debugging lesson viewer functionality.",
    content: "This is a test lesson added directly to state for debugging. It includes all necessary properties for proper lesson viewing experience including video content, progress tracking, and interactive elements.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeVideoId: "dQw4w9WgXcQ",
    duration: 300, // 5 minutes in seconds
    durationMinutes: 5,
    videoDuration: 300,
    order: 3,
    moduleId: "module-1",
    courseName: "Test Course for Debugging",
    type: "video",
    status: "tersedia",
    isPreviewable: true
  },
  "9": {
    id: "9",
    title: "Test Lesson 1754015924683", 
    description: "Comprehensive lesson covering key concepts and practical applications.",
    content: "This comprehensive lesson covers key concepts...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 180,
    durationMinutes: 3,
    order: 4,
    moduleId: "module-1",
    courseName: "YouTube URL Test Course",
    type: "video",
    status: "tersedia",
    isPreviewable: false
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    console.log(`🔍 API: Looking for lesson with ID: ${lessonId}`);

    // Simulate database lookup
    const lesson = mockLessons[lessonId];

    if (!lesson) {
      console.log(`❌ API: Lesson with ID ${lessonId} not found in mock data`);
      console.log(`📋 API: Available lesson IDs: ${Object.keys(mockLessons).join(', ')}`);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Lesson with ID ${lessonId} not found`,
          availableLessons: Object.keys(mockLessons),
          message: 'Please check the lesson ID and try again'
        },
        { status: 404 }
      );
    }

    console.log(`✅ API: Found lesson: ${lesson.title}`);

    return NextResponse.json({
      success: true,
      data: lesson
    });

  } catch (error) {
    console.error('❌ API: Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();

    // Simulate lesson update
    if (!mockLessons[lessonId]) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Update lesson data
    mockLessons[lessonId] = {
      ...mockLessons[lessonId],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: mockLessons[lessonId]
    });

  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
