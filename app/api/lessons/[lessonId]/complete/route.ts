import { NextRequest, NextResponse } from 'next/server';

// Mock data for lesson completion - In production, this would be stored in your database
let mockCompletions: Record<string, any> = {};

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    const body = await request.json();
    
    // Get user ID from headers or session (mock for now)
    const userId = request.headers.get('user-id') || 'mock-user-id';
    
    const completionId = `${userId}-${lessonId}`;
    
    // Mark lesson as completed
    const completion = {
      id: completionId,
      lessonId,
      userId,
      completed: true,
      progress: 100,
      completedAt: body.completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    mockCompletions[completionId] = completion;

    // Note: In production, you would update the progress in the database
    // For now, we'll just return the completion data

    return NextResponse.json({
      success: true,
      data: completion,
      message: 'Lesson marked as completed successfully'
    });

  } catch (error) {
    console.error('Error marking lesson as complete:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const { lessonId } = params;
    
    // Get user ID from headers or session (mock for now)
    const userId = request.headers.get('user-id') || 'mock-user-id';
    
    const completionId = `${userId}-${lessonId}`;
    const completion = mockCompletions[completionId];

    return NextResponse.json({
      success: true,
      data: completion || { completed: false }
    });

  } catch (error) {
    console.error('Error fetching lesson completion:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
