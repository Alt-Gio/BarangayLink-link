import { PrismaClient, UserRole, Priority, ProjectStatus, TaskStatus, EventStatus, ActivityAction } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Role hierarchy and permissions
export const ROLE_HIERARCHY = {
  ADMIN: 6,
  BARANGAY_CAPTAIN: 5,
  SECRETARY: 4,
  TREASURER: 4,
  COUNCILOR: 3,
  STAFF: 1,
} as const;

export const getRoleLevel = (role: UserRole): number => {
  return ROLE_HIERARCHY[role];
};

export const hasPermission = (userRole: UserRole, requiredLevel: number): boolean => {
  return getRoleLevel(userRole) >= requiredLevel;
};

// Activity logging helper
export const logActivity = async (
  userId: string,
  action: ActivityAction,
  description: string,
  entityType: string,
  entityId: string,
  oldValues?: any,
  newValues?: any,
  metadata?: any
) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        description,
        entityType,
        entityId,
        oldValues: oldValues || null,
        newValues: newValues || null,
        metadata: metadata || null,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// User management helpers
export const userHelpers = {
  async createUser(data: {
    clerkUserId: string;
    name: string;
    email: string;
    position: string;
    role: UserRole;
    employeeId?: string;
    phoneNumber?: string;
  }) {
    const user = await prisma.user.create({
      data,
    });

    await logActivity(
      user.id,
      ActivityAction.CREATED,
      `User ${user.name} created with role ${user.role}`,
      'User',
      user.id,
      null,
      user
    );

    return user;
  },

  async getUserByClerkId(clerkUserId: string) {
    return prisma.user.findUnique({
      where: { clerkUserId },
    });
  },

  async updateUserLastActive(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });
  },

  async getUsersByRole(role: UserRole) {
    return prisma.user.findMany({
      where: { role, isActive: true },
      orderBy: { name: 'asc' },
    });
  },
};

// Project management helpers
export const projectHelpers = {
  async createProject(data: {
    name: string;
    description: string;
    category: any;
    priority: Priority;
    budget?: number;
    objectives?: string;
    beneficiaries?: string;
    location?: string;
    methodology?: string;
    expectedOutcome?: string;
    managerId: string;
    createdById: string;
    startDate?: Date;
    dueDate?: Date;
    teamIds?: string[];
  }) {
    const { teamIds, ...projectData } = data;
    
    const project = await prisma.project.create({
      data: {
        ...projectData,
        budget: data.budget ? data.budget : null,
        team: teamIds ? {
          connect: teamIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        manager: true,
        team: true,
        createdBy: true,
      },
    });

    await logActivity(
      data.createdById,
      ActivityAction.CREATED,
      `Project "${project.name}" created`,
      'Project',
      project.id,
      null,
      project
    );

    return project;
  },

  async updateProjectStatus(projectId: string, status: ProjectStatus, userId: string) {
    const oldProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { 
        status,
        completedDate: status === ProjectStatus.COMPLETED ? new Date() : null,
      },
      include: {
        manager: true,
        team: true,
      },
    });

    const actionMap = {
      [ProjectStatus.APPROVED]: ActivityAction.PROJECT_APPROVED,
      [ProjectStatus.IN_PROGRESS]: ActivityAction.PROJECT_STARTED,
      [ProjectStatus.COMPLETED]: ActivityAction.PROJECT_COMPLETED,
      [ProjectStatus.CANCELLED]: ActivityAction.PROJECT_CANCELLED,
    };

    const action = actionMap[status] || ActivityAction.UPDATED;

    await logActivity(
      userId,
      action,
      `Project "${project.name}" status changed to ${status}`,
      'Project',
      project.id,
      { status: oldProject?.status },
      { status: project.status }
    );

    return project;
  },

  async getProjectsWithStats() {
    return prisma.project.findMany({
      include: {
        manager: true,
        team: true,
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            events: true,
            documents: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getPublicProjects() {
    return prisma.project.findMany({
      where: {
        isPublic: true,
        isArchived: false,
      },
      include: {
        manager: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Task management helpers
export const taskHelpers = {
  async createTask(data: {
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: Date;
    estimatedHours?: number;
    projectId: string;
    createdById: string;
    assigneeIds?: string[];
  }) {
    const { assigneeIds, ...taskData } = data;
    
    const task = await prisma.task.create({
      data: {
        ...taskData,
        assignees: assigneeIds ? {
          connect: assigneeIds.map(id => ({ id }))
        } : undefined,
      },
      include: {
        assignees: true,
        project: true,
        createdBy: true,
      },
    });

    // Update project progress when new task is created
    const projectTasks = await prisma.task.findMany({
      where: { projectId: data.projectId }
    });
    
    const completedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED);
    const progressPercentage = projectTasks.length > 0 
      ? Math.round((completedTasks.length / projectTasks.length) * 100) 
      : 0;
      
    await prisma.project.update({
      where: { id: data.projectId },
      data: { progressPercentage }
    });

    await logActivity(
      data.createdById,
      ActivityAction.CREATED,
      `Task "${task.title}" created in project "${task.project.name}"`,
      'Task',
      task.id,
      null,
      task
    );

    return task;
  },

  async updateTaskStatus(taskId: string, status: TaskStatus, userId: string) {
    const oldTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { 
        status,
        completedDate: status === TaskStatus.COMPLETED ? new Date() : null,
      },
      include: {
        assignees: true,
        project: true,
      },
    });

    // Auto-update project progress when task status changes
    if (task.projectId) {
      const projectTasks = await prisma.task.findMany({
        where: { projectId: task.projectId }
      });
      
      const completedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED);
      const progressPercentage = projectTasks.length > 0 
        ? Math.round((completedTasks.length / projectTasks.length) * 100) 
        : 0;
        
      await prisma.project.update({
        where: { id: task.projectId },
        data: { progressPercentage }
      });
    }

    const actionMap = {
      [TaskStatus.COMPLETED]: ActivityAction.TASK_COMPLETED,
      [TaskStatus.IN_PROGRESS]: ActivityAction.TASK_ASSIGNED,
    };

    const action = actionMap[status] || ActivityAction.UPDATED;

    await logActivity(
      userId,
      action,
      `Task "${task.title}" status changed to ${status}`,
      'Task',
      task.id,
      { status: oldTask?.status },
      { status: task.status }
    );

    return task;
  },

  async getTasksByProject(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignees: true,
        checklists: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            attachments: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },
};

// Event management helpers
export const eventHelpers = {
  async createEvent(data: {
    title: string;
    description: string;
    shortDescription?: string;
    location: string;
    venue?: string;
    startDate: Date;
    endDate?: Date;
    eventType: any;
    category: any;
    isPublic: boolean;
    featuredOnLanding?: boolean;
    agenda?: string;
    requirements?: string;
    contactInfo?: string;
    targetAudience?: string;
    projectId?: string;
    createdById: string;
  }) {
    const event = await prisma.event.create({
      data,
      include: {
        project: true,
        createdBy: true,
      },
    });

    await logActivity(
      data.createdById,
      ActivityAction.CREATED,
      `Event "${event.title}" created`,
      'Event',
      event.id,
      null,
      event
    );

    return event;
  },

  async getPublicEvents() {
    return prisma.event.findMany({
      where: {
        isPublic: true,
        status: EventStatus.SCHEDULED,
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        project: true,
        createdBy: true,
      },
      orderBy: { startDate: 'asc' },
    });
  },

  async getFeaturedEvents() {
    return prisma.event.findMany({
      where: {
        featuredOnLanding: true,
        isPublic: true,
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        project: true,
      },
      orderBy: { startDate: 'asc' },
      take: 5,
    });
  },
};

// Announcement helpers
export const announcementHelpers = {
  async createAnnouncement(data: {
    title: string;
    content: string;
    excerpt?: string;
    type: any;
    priority: Priority;
    isPublic: boolean;
    isPinned?: boolean;
    showOnLanding?: boolean;
    projectId?: string;
    eventId?: string;
    createdById: string;
    publishAt?: Date;
  }) {
    const announcement = await prisma.announcement.create({
      data,
      include: {
        project: true,
        event: true,
        createdBy: true,
      },
    });

    await logActivity(
      data.createdById,
      ActivityAction.CREATED,
      `Announcement "${announcement.title}" created`,
      'Announcement',
      announcement.id,
      null,
      announcement
    );

    return announcement;
  },

  async getPublicAnnouncements() {
    return prisma.announcement.findMany({
      where: {
        isPublic: true,
        status: 'PUBLISHED',
      },
      include: {
        project: true,
        event: true,
        createdBy: true,
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  },

  async getLatestAnnouncements(limit: number = 5) {
    return prisma.announcement.findMany({
      where: {
        isPublic: true,
        status: 'PUBLISHED',
        showOnLanding: true,
      },
      include: {
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
};

// Document helpers
export const documentHelpers = {
  async createDocument(data: {
    filename: string;
    originalName: string;
    filepath: string;
    url?: string;
    mimetype: string;
    size: bigint;
    type: any;
    category?: string;
    description?: string;
    isPublic: boolean;
    accessLevel: any;
    uploadedById: string;
    projectId?: string;
    taskId?: string;
    eventId?: string;
    tags?: string[];
  }) {
    const document = await prisma.document.create({
      data: {
        ...data,
        tags: data.tags || null,
      },
      include: {
        uploadedBy: true,
        project: true,
        task: true,
        event: true,
      },
    });

    await logActivity(
      data.uploadedById,
      ActivityAction.DOCUMENT_UPLOADED,
      `Document "${document.originalName}" uploaded`,
      'Document',
      document.id,
      null,
      document
    );

    return document;
  },

  async getPublicDocuments() {
    return prisma.document.findMany({
      where: {
        isPublic: true,
        isArchived: false,
      },
      include: {
        uploadedBy: true,
        project: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Statistics helpers
export const statsHelpers = {
  async getCommunityStats() {
    const [
      totalProjects,
      completedProjects,
      activeProjects,
      totalEvents,
      upcomingEvents,
      totalAnnouncements,
      publicDocuments,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.COMPLETED } }),
      prisma.project.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
      prisma.event.count(),
      prisma.event.count({
        where: {
          startDate: { gte: new Date() },
          status: EventStatus.SCHEDULED,
        },
      }),
      prisma.announcement.count({ where: { isPublic: true } }),
      prisma.document.count({ where: { isPublic: true } }),
    ]);

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      totalEvents,
      upcomingEvents,
      totalAnnouncements,
      publicDocuments,
      projectCompletionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
    };
  },

  async getDashboardStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    const [
      myTasks,
      completedTasks,
      myProjects,
      totalBudget,
      recentActivity,
    ] = await Promise.all([
      prisma.task.count({
        where: {
          assignees: { some: { id: userId } },
          status: { not: TaskStatus.COMPLETED },
        },
      }),
      prisma.task.count({
        where: {
          assignees: { some: { id: userId } },
          status: TaskStatus.COMPLETED,
        },
      }),
      prisma.project.count({
        where: {
          OR: [
            { managerId: userId },
            { team: { some: { id: userId } } },
            { createdById: userId },
          ],
        },
      }),
      prisma.project.aggregate({
        _sum: { budget: true },
        where: {
          OR: [
            { managerId: userId },
            { team: { some: { id: userId } } },
          ],
        },
      }),
      prisma.activityLog.count({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      myTasks,
      completedTasks,
      myProjects,
      totalBudget: totalBudget._sum.budget || 0,
      recentActivity,
      taskCompletionRate: (myTasks + completedTasks) > 0 ? Math.round((completedTasks / (myTasks + completedTasks)) * 100) : 0,
    };
  },
};

export default prisma;
