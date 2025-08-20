import { NextRequest, NextResponse } from 'next/server';
import { projectHelpers } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const featured = searchParams.get('featured') === 'true';

    const projects = await projectHelpers.getPublicProjects();
    
    // Filter and limit results
    let filteredProjects = projects;
    
    if (featured) {
      // Get featured projects (completed or high progress)
      filteredProjects = projects.filter(project => 
        project.status === 'COMPLETED' || project.progressPercentage >= 75
      );
    }
    
    const limitedProjects = filteredProjects.slice(0, limit);
    
    return NextResponse.json(limitedProjects, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
