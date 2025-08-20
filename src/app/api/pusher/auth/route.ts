import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { pusherServer } from '@/lib/pusher';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.text();
    const formData = new URLSearchParams(body);
    
    const socketId = formData.get('socket_id');
    const channel = formData.get('channel_name');

    if (!socketId || !channel) {
      return NextResponse.json({ error: 'Missing socket_id or channel_name' }, { status: 400 });
    }

    // Authorize user for private channels
    if (channel.startsWith('private-user-')) {
      const channelUserId = channel.replace('private-user-', '');
      
      // Users can only access their own private channels
      if (channelUserId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Authorize user for project channels
    if (channel.startsWith('project-')) {
      const projectId = channel.replace('project-', '');
      
      // Check if user has access to this project
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { createdById: user.id },
            { managerId: user.id },
            { team: { some: { id: user.id } } }
          ]
        }
      });

      if (!project) {
        return NextResponse.json({ error: 'Project access denied' }, { status: 403 });
      }
    }

    // Authorize user for task channels
    if (channel.startsWith('task-')) {
      const taskId = channel.replace('task-', '');
      
      // Check if user has access to this task
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          OR: [
            { createdById: user.id },
            { assignees: { some: { id: user.id } } },
            { project: { 
              OR: [
                { createdById: user.id },
                { managerId: user.id },
                { team: { some: { id: user.id } } }
              ]
            }}
          ]
        }
      });

      if (!task) {
        return NextResponse.json({ error: 'Task access denied' }, { status: 403 });
      }
    }

    // Generate auth signature for the channel
    const authResponse = pusherServer.authorizeChannel(socketId, channel, {
      user_id: user.id,
      user_info: {
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
