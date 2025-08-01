import { NextRequest, NextResponse } from 'next/server';

// Mock data for lesson progress - In production, this would be stored in your database
let mockProgress: Record<string, any> = {
  // Pre-populate some mock data for testing
  "mock-user-id-1": { id: "mock-user-id-1", lessonId: "1", userId: "mock-user-id", progress: 100, completed: true, watchTime: 1800, lastWatched: Date.now() - 86400000 },
  "mock-user-id-2": { id: "mock-user-id-2", lessonId: "2", userId: "mock-user-id", progress: 75, completed: false, watchTime: 1200, lastWatched: Date.now() - 172800000 },
  "mock-user-id-3": { id: "mock-user-id-3", lessonId: "3", userId: "mock-user-id", progress: 0, completed: false, watchTime: 0, lastWatched: null },
  "mock-user-id-4": { id: "mock-user-id-4", lessonId: "4", userId: "mock-user-id", progress: 50, completed: false, watchTime: 900, lastWatched: Date.now() - 259200000 },
  "mock-user-id-5": { id: "mock-user-id-5", lessonId: "5", userId: "mock-user-id", progress: 100, completed: true, watchTime: 180, lastWatched: Date.now() - 3600000 },
  "mock-user-id-6": { id: "mock-user-id-6", lessonId: "6", userId: "mock-user-id", progress: 25, completed: false, watchTime: 45, lastWatched: Date.now() - 7200000 },
  "mock-user-id-7": { id: "mock-user-id-7", lessonId: "7", userId: "mock-user-id", progress: 0, completed: false, watchTime: 0, lastWatched: null },
  "mock-user-id-8": { id: "mock-user-id-8", lessonId: "8", userId: "mock-user-id", progress: 0, completed: false, watchTime: 0, lastWatched: null },
  "mock-user-id-9": { id: "mock-user-id-9", lessonId: "9", userId: "mock-user-id", progress: 30, completed: false, watchTime: 54, lastWatched: Date.now() - 14400000 }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    
    // Get user ID from headers or session (mock for now)
    const userId = request.headers.get('user-id') || 'mock-user-id';

    const progressId = `${userId}-${lessonId}`;
    const progress = mockProgress[progressId];

    console.log(`📊 Fetching progress for lesson ID: ${lessonId}, user: ${userId}`);
    console.log(`📊 Available progress IDs: ${Object.keys(mockProgress).join(', ')}`);
    console.log(`📊 Looking for progress ID: ${progressId}`);

    if (!progress) {
      console.log(`⚠️ No progress found for ${progressId}, returning default progress`);
      // Return empty progress for new lessons
      return NextResponse.json({
        success: true,
        data: {
          id: progressId,
          lessonId,
          userId,
          progress: 0,
          completed: false,
          watchTime: 0,
          lastWatched: null
        }
      });
    }

    console.log(`✅ Progress found for ${progressId}:`, progress);
    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    
    // Get user ID from headers or session (mock for now)
    const userId = request.headers.get('user-id') || 'mock-user-id';
    
    const progressId = `${userId}-${lessonId}`;
    
    // Update or create progress
    const existingProgress = mockProgress[progressId] || {
      id: progressId,
      lessonId,
      userId,
      progress: 0,
      completed: false,
      watchTime: 0,
      lastWatched: null,
      createdAt: new Date().toISOString()
    };

    const updatedProgress = {
      ...existingProgress,
      ...body,
      updatedAt: new Date().toISOString()
    };

    mockProgress[progressId] = updatedProgress;

    return NextResponse.json({
      success: true,
      data: updatedProgress
    });

  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
