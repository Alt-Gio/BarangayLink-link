import { NextRequest, NextResponse } from 'next/server';
import { statsHelpers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const stats = await statsHelpers.getCommunityStats();
    
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
