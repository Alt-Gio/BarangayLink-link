import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';
import { seedProjects } from './seeds/projects';
import { seedTasks } from './seeds/tasks';
import { seedEvents } from './seeds/events';
import { seedAnnouncements } from './seeds/announcements';
import { seedDocuments } from './seeds/documents';
import { seedSettings } from './seeds/settings';
import { seedGoals } from './seeds/goals';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.checklist.deleteMany();
  await prisma.goalMetric.deleteMany();
  await prisma.goalMilestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.document.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.pageContent.deleteMany();
  await prisma.setting.deleteMany(); // Delete settings before users since they reference users
  await prisma.user.deleteMany();

  // Seed data in order
  const users = await seedUsers(prisma);
  const projects = await seedProjects(prisma, users);
  const tasks = await seedTasks(prisma, users, projects);
  const events = await seedEvents(prisma, users, projects);
  const announcements = await seedAnnouncements(prisma, users, projects, events);
  const documents = await seedDocuments(prisma, users, projects);
  await seedGoals(prisma);
  await seedSettings(prisma, users);

  console.log('✅ Database seeding completed successfully!');
  console.log(`👥 Users: ${users.length}`);
  console.log(`🏗️ Projects: ${projects.length}`);
  console.log(`✅ Tasks: ${tasks.length}`);
  console.log(`📅 Events: ${events.length}`);
  console.log(`📢 Announcements: ${announcements.length}`);
  console.log(`📄 Documents: ${documents.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });