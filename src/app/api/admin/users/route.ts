import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the requesting user
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has admin privileges (Level 5 or above: ADMIN, BARANGAY_CAPTAIN)
    const canViewUsers = ['ADMIN', 'BARANGAY_CAPTAIN'].includes(currentUser.role);
    if (!canViewUsers) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const department = searchParams.get('department');
    const search = searchParams.get('search');

    // Build where clause
    const whereClause: Record<string, unknown> = {};

    if (role && role !== 'ALL') {
      whereClause.role = role;
    }

    if (status === 'ACTIVE') {
      whereClause.isActive = true;
    } else if (status === 'INACTIVE') {
      whereClause.isActive = false;
    }

    // Note: department field doesn't exist in User model, removing this filter

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch users with activity logs for login count
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            createdProjects: true,
            managedProjects: true,
            assignedTasks: true,
            createdEvents: true,
            uploadedDocuments: true,
            activityLogs: true,
          }
        }
      },
      orderBy: [
        { role: 'asc' },
        { name: 'asc' }
      ]
    });

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get completed tasks count
        const completedTasksCount = await prisma.task.count({
          where: {
            assignees: { some: { id: user.id } },
            status: 'COMPLETED'
          }
        });

        // Get login count from activity logs
        const loginCount = await prisma.activityLog.count({
          where: {
            userId: user.id,
            action: 'USER_LOGIN'
          }
        });

        // Get last active time from latest activity log
        const lastActivity = await prisma.activityLog.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true }
        });

        return {
          id: user.id,
          clerkUserId: user.clerkUserId,
          name: user.name,
          email: user.email,
          position: user.position,
          role: user.role,
          employeeId: user.employeeId,
          phoneNumber: user.phoneNumber,
          profileImage: user.profileImage,
          isActive: user.isActive,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          lastActiveAt: lastActivity?.createdAt.toISOString() || user.updatedAt.toISOString(),
          loginCount: loginCount,
          projectsManaged: user._count.createdProjects + user._count.managedProjects,
          tasksCompleted: completedTasksCount,
          eventsOrganized: user._count.createdEvents,
          documentsUploaded: user._count.uploadedDocuments,
        };
      })
    );

    // Note: department field doesn't exist in User model, using empty array
    const departmentList: string[] = [];

    // Get statistics
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      officials: users.filter(u => ['ADMIN', 'BARANGAY_CAPTAIN', 'SECRETARY', 'TREASURER', 'COUNCILOR'].includes(u.role)).length,
      online: users.filter(u => {
        const lastActive = new Date(u.updatedAt);
        const now = new Date();
        const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
        return diffInHours < 1; // Consider online if active within last hour
      }).length
    };

    return NextResponse.json({
      users: usersWithStats,
      departments: departmentList,
      stats
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only ADMIN can create users
    if (currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.position || !data.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: data.clerkUserId || `temp_${Date.now()}`, // Temporary ID until Clerk integration
        name: data.name,
        email: data.email,
        position: data.position,
        role: data.role,
        employeeId: data.employeeId,
        // Note: department field removed as it doesn't exist in schema
        phoneNumber: data.phoneNumber,
        profileImage: data.profileImage,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });

    // Log the activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATED',
        description: `User ${newUser.name} created`,
        entityType: 'User',
        entityId: newUser.id,
        userId: currentUser.id,
        metadata: {
          newUserRole: newUser.role,
          newUserEmail: newUser.email
        }
      }
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
