import { NextRequest, NextResponse } from 'next/server';
import { eventHelpers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';

    let events;
    
    if (featured) {
      events = await eventHelpers.getFeaturedEvents();
    } else {
      events = await eventHelpers.getPublicEvents();
    }
    
    const limitedEvents = events.slice(0, limit);
    
    return NextResponse.json(limitedEvents, {
      headers: {
        'Cache-Control': 's-maxage=180, stale-while-revalidate=300', // Cache for 3 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
