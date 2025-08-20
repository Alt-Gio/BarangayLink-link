import { PrismaClient, AnnouncementType } from '@prisma/client';

export async function seedAnnouncements(prisma: PrismaClient, users: any[], projects: any[], events: any[]) {
  console.log('📢 Seeding announcements...');

  const announcements = await prisma.announcement.createMany({
    data: [
      {
        title: 'New Basketball Court Construction Begins',
        content: 'We are excited to announce the start of construction for our new community basketball court. The project is expected to be completed by May 2024. Thank you for your patience during the construction period.',
        type: AnnouncementType.PROJECT,
        isPublic: true,
        isPinned: true,
        createdById: users[1].id, // Barangay Captain
        projectId: projects[0].id, // Infrastructure Project
        eventId: events[1].id, // Basketball Court Groundbreaking
        publishedAt: new Date('2024-02-21T10:00:00Z'),
      },
      {
        title: 'Community Health Day Registration Open',
        content: 'Registration is now open for our Community Health Day on March 15, 2024. Free medical check-ups, vaccinations, and health consultations will be available. Please bring your health records and valid ID.',
        type: AnnouncementType.EVENT,
        isPublic: true,
        isPinned: true,
        createdById: users[2].id, // Secretary
        projectId: projects[1].id, // Health Program
        eventId: events[0].id, // Community Health Day
        publishedAt: new Date('2024-02-28T09:00:00Z'),
      },
      {
        title: 'Waste Collection Schedule Update',
        content: 'Effective March 1, 2024, garbage collection will be on Mondays, Wednesdays, and Fridays. Please segregate your waste properly: biodegradable, non-biodegradable, and recyclables in separate containers.',
        type: AnnouncementType.PROJECT,
        isPublic: true,
        isPinned: false,
        createdById: users[4].id, // Councilor
        projectId: projects[2].id, // Environmental Project
        publishedAt: new Date('2024-02-25T15:00:00Z'),
      },
      {
        title: 'Monthly Barangay Assembly - March 30',
        content: 'All residents are invited to attend the Monthly Barangay Assembly on March 30, 2024, at 7:00 PM. Agenda includes project updates, budget discussions, and community concerns. Your participation is important.',
        type: AnnouncementType.EVENT,
        isPublic: true,
        isPinned: false,
        createdById: users[2].id, // Secretary
        eventId: events[3].id, // Monthly Barangay Assembly
        publishedAt: new Date('2024-03-20T11:00:00Z'),
      },
      {
        title: 'Youth Sports Festival 2024',
        content: 'Save the date! Our annual Youth Sports Festival will be held on May 20, 2024. Various sports competitions, games, and prizes await our young athletes. Registration details will be announced soon.',
        type: AnnouncementType.EVENT,
        isPublic: true,
        isPinned: false,
        createdById: users[4].id, // Councilor
        eventId: events[4].id, // Youth Sports Festival
        publishedAt: new Date('2024-03-01T14:00:00Z'),
      },
      {
        title: 'Disaster Preparedness Training',
        content: 'In line with our safety initiatives, we will conduct Disaster Preparedness Training on June 15, 2024. Learn essential emergency response skills and help make our community more resilient.',
        type: AnnouncementType.EVENT,
        isPublic: true,
        isPinned: false,
        createdById: users[4].id, // Councilor
        eventId: events[7].id, // Disaster Preparedness Training
        publishedAt: new Date('2024-03-10T10:00:00Z'),
      },
      {
        title: 'Environmental Clean-Up Drive',
        content: 'Join us for a community-wide clean-up drive on April 5, 2024, starting at 6:00 AM. Bring gloves, water, and enthusiasm! Let\'s work together to keep our barangay clean and green.',
        type: AnnouncementType.PROJECT,
        isPublic: true,
        isPinned: false,
        createdById: users[5].id, // Staff
        projectId: projects[2].id, // Environmental Project
        eventId: events[6].id, // Clean-Up Drive
        publishedAt: new Date('2024-03-25T08:00:00Z'),
      },
      {
        title: 'Budget Transparency Report - Q1 2024',
        content: 'The first quarter budget report is now available for public viewing. Visit the barangay office during business hours or check our website for detailed financial information and project expenditures.',
        type: AnnouncementType.GENERAL,
        isPublic: true,
        isPinned: false,
        createdById: users[3].id, // Treasurer
        publishedAt: new Date('2024-04-01T16:00:00Z'),
      },
    ],
  });

  console.log(`✅ Created ${announcements.count} announcements`);

  // Return the created announcements for use by other seeders
  const createdAnnouncements = await prisma.announcement.findMany({
    include: {
      createdBy: true,
      project: true,
      event: true,
    },
  });

  return createdAnnouncements;
}
