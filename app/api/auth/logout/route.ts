import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // In a real application, you might want to:
    // 1. Invalidate the token on the server side
    // 2. Add the token to a blacklist
    // 3. Clear any server-side sessions

    // For now, we'll just return a success response
    // The client will handle clearing the local storage

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: 'Logged out successfully',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
