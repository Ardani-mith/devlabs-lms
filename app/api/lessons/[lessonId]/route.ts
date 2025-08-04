import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  try {
    console.log(`🎥 Fetching lesson ${lessonId} from backend...`);
    
    // Use the public lessons endpoint that doesn't require authentication
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${backendUrl}/public-lessons/${lessonId}`);
    
    if (!res.ok) {
      console.log(`❌ Backend response not ok: ${res.status} ${res.statusText}`);
      return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
    }
    
    const data = await res.json();
    console.log(`✅ Lesson data from backend:`, data);
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error fetching lesson:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  try {
    const body = await request.json();
    // Use the correct environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${backendUrl}/lessons/${lessonId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Lesson not found or update failed' }, { status: 404 });
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
