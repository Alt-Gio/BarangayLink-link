import { PrismaClient, EventStatus, EventCategory, EventType } from '@prisma/client';

export async function seedEvents(prisma: PrismaClient, users: any[], projects: any[]) {
  console.log('📅 Seeding events...');

  const events = await prisma.event.createMany({
    data: [
      {
        title: 'Community Health Day',
        description: 'Free medical check-ups, vaccination, and health education for all residents',
        startDate: new Date('2024-03-15T08:00:00Z'),
        endDate: new Date('2024-03-15T17:00:00Z'),
        location: 'Barangay Health Center',
        category: EventCategory.HEALTH,
        eventType: EventType.COMMUNITY,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 200,
        actualAttendees: 45,
        createdById: users[1].id, // Barangay Captain
        projectId: projects[1].id, // Health Program
      },
      {
        title: 'Basketball Court Groundbreaking',
        description: 'Official groundbreaking ceremony for the new community basketball court',
        startDate: new Date('2024-02-20T09:00:00Z'),
        endDate: new Date('2024-02-20T11:00:00Z'),
        location: 'New Basketball Court Site',
        category: EventCategory.SPORTS,
        eventType: EventType.COMMUNITY,
        status: EventStatus.COMPLETED,
        isPublic: true,
        maxAttendees: 150,
        actualAttendees: 148,
        createdById: users[1].id, // Barangay Captain
        projectId: projects[0].id, // Infrastructure Project
      },
      {
        title: 'Environmental Awareness Seminar',
        description: 'Educational seminar on proper waste management and environmental protection',
        startDate: new Date('2024-04-10T14:00:00Z'),
        endDate: new Date('2024-04-10T17:00:00Z'),
        location: 'Barangay Hall Conference Room',
        category: EventCategory.EDUCATION,
        eventType: EventType.COMMUNITY,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 80,
        actualAttendees: 23,
        createdById: users[2].id, // Secretary
        projectId: projects[2].id, // Environmental Project
      },
      {
        title: 'Monthly Barangay Assembly',
        description: 'Regular monthly meeting for community updates and discussions',
        startDate: new Date('2024-03-30T19:00:00Z'),
        endDate: new Date('2024-03-30T21:00:00Z'),
        location: 'Barangay Hall',
        category: EventCategory.GOVERNMENT,
        eventType: EventType.MEETING,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 100,
        actualAttendees: 67,
        createdById: users[2].id, // Secretary
      },
      {
        title: 'Youth Sports Festival',
        description: 'Annual sports festival for youth development and community bonding',
        startDate: new Date('2024-05-20T07:00:00Z'),
        endDate: new Date('2024-05-20T18:00:00Z'),
        location: 'New Basketball Court',
        category: EventCategory.SPORTS,
        eventType: EventType.COMMUNITY,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 300,
        actualAttendees: 89,
        createdById: users[4].id, // Councilor
        projectId: projects[0].id, // Infrastructure Project
      },
      {
        title: 'Senior Citizens Health Check',
        description: 'Special health screening program for elderly residents',
        startDate: new Date('2024-04-25T08:30:00Z'),
        endDate: new Date('2024-04-25T15:30:00Z'),
        location: 'Barangay Health Center',
        category: EventCategory.HEALTH,
        eventType: EventType.COMMUNITY,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 60,
        actualAttendees: 34,
        createdById: users[3].id, // Treasurer
        projectId: projects[1].id, // Health Program
      },
      {
        title: 'Clean-Up Drive',
        description: 'Community-wide environmental clean-up and tree planting activity',
        startDate: new Date('2024-04-05T06:00:00Z'),
        endDate: new Date('2024-04-05T10:00:00Z'),
        location: 'Various Barangay Areas',
        category: EventCategory.ENVIRONMENT,
        eventType: EventType.COMMUNITY,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 150,
        actualAttendees: 78,
        createdById: users[5].id, // Staff
        projectId: projects[2].id, // Environmental Project
      },
      {
        title: 'Disaster Preparedness Training',
        description: 'Emergency response training for community disaster preparedness',
        startDate: new Date('2024-06-15T13:00:00Z'),
        endDate: new Date('2024-06-15T17:00:00Z'),
        location: 'Barangay Hall',
        category: EventCategory.EMERGENCY,
        eventType: EventType.TRAINING,
        status: EventStatus.SCHEDULED,
        isPublic: true,
        maxAttendees: 120,
        actualAttendees: 12,
        createdById: users[4].id, // Councilor
      },
    ],
  });

  console.log(`✅ Created ${events.count} events`);

  // Return the created events for use by other seeders
  const createdEvents = await prisma.event.findMany({
    include: {
      createdBy: true,
      project: true,
    },
  });

  return createdEvents;
}