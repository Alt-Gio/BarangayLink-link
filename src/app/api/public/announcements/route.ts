import { NextRequest, NextResponse } from 'next/server';
import { announcementHelpers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const latest = searchParams.get('latest') === 'true';

    let announcements;
    
    if (latest) {
      announcements = await announcementHelpers.getLatestAnnouncements(limit);
    } else {
      announcements = await announcementHelpers.getPublicAnnouncements();
    }
    
    return NextResponse.json(announcements, {
      headers: {
        'Cache-Control': 's-maxage=120, stale-while-revalidate=240', // Cache for 2 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching public announcements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
