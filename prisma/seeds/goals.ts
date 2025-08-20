import { PrismaClient } from '@prisma/client';

export async function seedGoals(prisma: PrismaClient) {
  // Get users for goal creation and assignment
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const captain = await prisma.user.findFirst({ where: { role: 'BARANGAY_CAPTAIN' } });
  const secretary = await prisma.user.findFirst({ where: { role: 'SECRETARY' } });
  const treasurer = await prisma.user.findFirst({ where: { role: 'TREASURER' } });
  const councilor = await prisma.user.findFirst({ where: { role: 'COUNCILOR' } });
  const staff = await prisma.user.findFirst({ where: { role: 'STAFF' } });

  if (!admin || !captain || !secretary || !treasurer || !councilor || !staff) {
    throw new Error('Required users not found for goal seeding');
  }

  const goals = [
    {
      title: 'Project Delivery Excellence',
      description: 'Achieve 95% on-time project delivery rate for all barangay projects',
      type: 'BARANGAY' as const,
      category: 'DELIVERY' as const,
      priority: 'HIGH' as const,
      status: 'ACTIVE' as const,
      targetValue: 95,
      currentValue: 87,
      unit: '%',
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-12-31'),
      rewards: ['Performance Bonus', 'Team Recognition'],
      createdById: captain.id,
      assignees: {
        connect: [{ id: admin.id }, { id: captain.id }]
      },
      milestones: {
        create: [
          {
            title: '80% Milestone',
            targetValue: 80,
            isCompleted: true,
            completedDate: new Date('2024-06-15'),
            reward: 'Team Lunch',
            order: 1
          },
          {
            title: '90% Milestone',
            targetValue: 90,
            isCompleted: false,
            order: 2
          },
          {
            title: '95% Target',
            targetValue: 95,
            isCompleted: false,
            reward: 'Performance Bonus',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-01-31'), value: 75 },
          { date: new Date('2024-02-28'), value: 78 },
          { date: new Date('2024-03-31'), value: 82 },
          { date: new Date('2024-04-30'), value: 85 },
          { date: new Date('2024-05-31'), value: 87 }
        ]
      }
    },
    {
      title: 'Digital Document Processing',
      description: 'Process 100% of official documents digitally to improve efficiency',
      type: 'TEAM' as const,
      category: 'EFFICIENCY' as const,
      priority: 'MEDIUM' as const,
      status: 'ACTIVE' as const,
      targetValue: 100,
      currentValue: 65,
      unit: '%',
      startDate: new Date('2024-03-01'),
      targetDate: new Date('2024-09-30'),
      rewards: ['Process Improvement Award'],
      createdById: secretary.id,
      assignees: {
        connect: [{ id: secretary.id }, { id: staff.id }]
      },
      milestones: {
        create: [
          {
            title: '50% Digital',
            targetValue: 50,
            isCompleted: true,
            completedDate: new Date('2024-05-15'),
            order: 1
          },
          {
            title: '75% Digital',
            targetValue: 75,
            isCompleted: false,
            order: 2
          },
          {
            title: '100% Digital',
            targetValue: 100,
            isCompleted: false,
            reward: 'Efficiency Award',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-03-31'), value: 35 },
          { date: new Date('2024-04-30'), value: 45 },
          { date: new Date('2024-05-31'), value: 55 },
          { date: new Date('2024-06-30'), value: 65 }
        ]
      }
    },
    {
      title: 'Community Engagement Score',
      description: 'Increase community participation in barangay events and programs',
      type: 'BARANGAY' as const,
      category: 'COLLABORATION' as const,
      priority: 'HIGH' as const,
      status: 'ACTIVE' as const,
      targetValue: 80,
      currentValue: 72,
      unit: '%',
      startDate: new Date('2024-02-01'),
      targetDate: new Date('2024-11-30'),
      rewards: ['Community Recognition'],
      createdById: councilor.id,
      assignees: {
        connect: [{ id: councilor.id }, { id: captain.id }]
      },
      milestones: {
        create: [
          {
            title: '60% Engagement',
            targetValue: 60,
            isCompleted: true,
            completedDate: new Date('2024-04-20'),
            order: 1
          },
          {
            title: '70% Engagement',
            targetValue: 70,
            isCompleted: true,
            completedDate: new Date('2024-07-10'),
            order: 2
          },
          {
            title: '80% Target',
            targetValue: 80,
            isCompleted: false,
            reward: 'Excellence Award',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-02-28'), value: 55 },
          { date: new Date('2024-03-31'), value: 62 },
          { date: new Date('2024-04-30'), value: 68 },
          { date: new Date('2024-05-31'), value: 72 }
        ]
      }
    },
    {
      title: 'Budget Efficiency Optimization',
      description: 'Achieve 98% budget utilization efficiency across all projects',
      type: 'PROJECT' as const,
      category: 'EFFICIENCY' as const,
      priority: 'CRITICAL' as const,
      status: 'ACTIVE' as const,
      targetValue: 98,
      currentValue: 94,
      unit: '%',
      startDate: new Date('2024-04-01'),
      targetDate: new Date('2024-12-31'),
      rewards: ['Financial Excellence Award'],
      createdById: treasurer.id,
      assignees: {
        connect: [{ id: treasurer.id }, { id: admin.id }]
      },
      milestones: {
        create: [
          {
            title: '90% Efficiency',
            targetValue: 90,
            isCompleted: true,
            completedDate: new Date('2024-06-01'),
            order: 1
          },
          {
            title: '95% Efficiency',
            targetValue: 95,
            isCompleted: false,
            order: 2
          },
          {
            title: '98% Target',
            targetValue: 98,
            isCompleted: false,
            reward: 'Excellence Bonus',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-04-30'), value: 88 },
          { date: new Date('2024-05-31'), value: 91 },
          { date: new Date('2024-06-30'), value: 94 }
        ]
      }
    },
    {
      title: 'Personal Task Completion',
      description: 'Complete all assigned tasks within deadline consistently',
      type: 'PERSONAL' as const,
      category: 'DELIVERY' as const,
      priority: 'MEDIUM' as const,
      status: 'COMPLETED' as const,
      targetValue: 100,
      currentValue: 100,
      unit: '%',
      startDate: new Date('2024-01-01'),
      targetDate: new Date('2024-08-31'),
      completedDate: new Date('2024-08-25'),
      rewards: ['Performance Recognition'],
      createdById: staff.id,
      assignees: {
        connect: [{ id: staff.id }]
      },
      milestones: {
        create: [
          {
            title: '80% On-time',
            targetValue: 80,
            isCompleted: true,
            completedDate: new Date('2024-03-15'),
            order: 1
          },
          {
            title: '90% On-time',
            targetValue: 90,
            isCompleted: true,
            completedDate: new Date('2024-05-20'),
            order: 2
          },
          {
            title: '100% Target',
            targetValue: 100,
            isCompleted: true,
            completedDate: new Date('2024-08-25'),
            reward: 'Employee of the Month',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-02-28'), value: 75 },
          { date: new Date('2024-03-31'), value: 82 },
          { date: new Date('2024-04-30'), value: 88 },
          { date: new Date('2024-05-31'), value: 92 },
          { date: new Date('2024-06-30'), value: 96 },
          { date: new Date('2024-07-31'), value: 98 },
          { date: new Date('2024-08-31'), value: 100 }
        ]
      }
    },
    {
      title: 'Response Time Optimization',
      description: 'Reduce average citizen request response time to under 24 hours',
      type: 'TEAM' as const,
      category: 'QUALITY' as const,
      priority: 'HIGH' as const,
      status: 'ACTIVE' as const,
      targetValue: 24,
      currentValue: 36,
      unit: 'hours',
      startDate: new Date('2024-05-01'),
      targetDate: new Date('2024-10-31'),
      rewards: ['Service Excellence Award'],
      createdById: secretary.id,
      assignees: {
        connect: [{ id: secretary.id }, { id: staff.id }, { id: councilor.id }]
      },
      milestones: {
        create: [
          {
            title: '48 Hours',
            targetValue: 48,
            isCompleted: true,
            completedDate: new Date('2024-06-15'),
            order: 1
          },
          {
            title: '36 Hours',
            targetValue: 36,
            isCompleted: true,
            completedDate: new Date('2024-07-20'),
            order: 2
          },
          {
            title: '24 Hours Target',
            targetValue: 24,
            isCompleted: false,
            reward: 'Efficiency Bonus',
            order: 3
          }
        ]
      },
      metrics: {
        create: [
          { date: new Date('2024-05-31'), value: 52 },
          { date: new Date('2024-06-30'), value: 45 },
          { date: new Date('2024-07-31'), value: 36 }
        ]
      }
    }
  ];

  console.log('🎯 Creating goals...');
  for (const goalData of goals) {
    await prisma.goal.create({
      data: goalData
    });
  }

  console.log(`✅ Created ${goals.length} goals`);
}
