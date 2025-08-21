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

// Helper function to safely delete from table
async function safeDeleteMany(prisma: PrismaClient, tableName: string, deleteFunction: () => Promise<any>) {
  try {
    await deleteFunction();
    console.log(`✅ Cleared ${tableName}`);
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log(`⚠️  Table ${tableName} doesn't exist yet (will be created by schema push)`);
    } else {
      console.log(`❌ Error clearing ${tableName}:`, error.message);
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if schema has been pushed
  console.log('🔍 Checking if tables exist...');
  try {
    await prisma.$queryRaw`SELECT 1 FROM users LIMIT 1`;
    console.log('✅ Tables exist, proceeding with seeding...');
  } catch (error: any) {
    if (error.code === 'P2021') {
      console.log('❌ Tables do not exist! Please run schema push first:');
      console.log('   npm run db:push');
      console.log('');
      console.log('Then run seeding again:');
      console.log('   npm run db:seed');
      process.exit(1);
    }
  }

  // Clear existing data safely
  console.log('🧹 Clearing existing data...');
  await safeDeleteMany(prisma, 'activity_logs', () => prisma.activityLog.deleteMany());
  await safeDeleteMany(prisma, 'comments', () => prisma.comment.deleteMany());
  await safeDeleteMany(prisma, 'attachments', () => prisma.attachment.deleteMany());
  await safeDeleteMany(prisma, 'checklists', () => prisma.checklist.deleteMany());
  await safeDeleteMany(prisma, 'goal_metrics', () => prisma.goalMetric.deleteMany());
  await safeDeleteMany(prisma, 'goal_milestones', () => prisma.goalMilestone.deleteMany());
  await safeDeleteMany(prisma, 'goals', () => prisma.goal.deleteMany());
  await safeDeleteMany(prisma, 'documents', () => prisma.document.deleteMany());
  await safeDeleteMany(prisma, 'announcements', () => prisma.announcement.deleteMany());
  await safeDeleteMany(prisma, 'events', () => prisma.event.deleteMany());
  await safeDeleteMany(prisma, 'tasks', () => prisma.task.deleteMany());
  await safeDeleteMany(prisma, 'projects', () => prisma.project.deleteMany());
  await safeDeleteMany(prisma, 'page_contents', () => prisma.pageContent.deleteMany());
  await safeDeleteMany(prisma, 'settings', () => prisma.setting.deleteMany());
  await safeDeleteMany(prisma, 'users', () => prisma.user.deleteMany());

  // Seed data in order
  console.log('🌱 Seeding data...');
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