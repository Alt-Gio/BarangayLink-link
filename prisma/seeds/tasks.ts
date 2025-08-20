import { PrismaClient, TaskStatus, Priority } from '@prisma/client';

export async function seedTasks(prisma: PrismaClient, users: any[], projects: any[]) {
  console.log('📝 Seeding tasks...');

  // Create tasks and assign users using the create method
  const tasks = [];

  // Tasks for Infrastructure Project
  const task1 = await prisma.task.create({
    data: {
      title: 'Site Survey and Planning',
      description: 'Conduct detailed site survey for new basketball court location',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      projectId: projects[0].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-01-15'),
      estimatedHours: 16,
      actualHours: 18,
      assignees: {
        connect: [{ id: users[2].id }] // Secretary
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task1);

  const task2 = await prisma.task.create({
    data: {
      title: 'Budget Approval Process',
      description: 'Process budget approval documents for basketball court construction',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      projectId: projects[0].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-01-30'),
      estimatedHours: 8,
      actualHours: 6,
      assignees: {
        connect: [{ id: users[3].id }] // Treasurer
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task2);

  const task3 = await prisma.task.create({
    data: {
      title: 'Contractor Selection',
      description: 'Review and select qualified contractors for the project',
      status: TaskStatus.COMPLETED,
      priority: Priority.MEDIUM,
      projectId: projects[0].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-02-15'),
      estimatedHours: 12,
      actualHours: 10,
      assignees: {
        connect: [{ id: users[4].id }] // Councilor
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task3);

  const task4 = await prisma.task.create({
    data: {
      title: 'Construction Monitoring',
      description: 'Daily monitoring and progress reporting of construction activities',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      projectId: projects[0].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-04-30'),
      estimatedHours: 120,
      actualHours: 80,
      assignees: {
        connect: [{ id: users[5].id }] // Staff
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task4);

  // Tasks for Health Program
  const task5 = await prisma.task.create({
    data: {
      title: 'Medical Supply Procurement',
      description: 'Purchase essential medical supplies for health program',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      projectId: projects[1].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-02-01'),
      estimatedHours: 6,
      actualHours: 8,
      assignees: {
        connect: [{ id: users[3].id }] // Treasurer
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task5);

  const task6 = await prisma.task.create({
    data: {
      title: 'Health Worker Training',
      description: 'Organize training sessions for community health workers',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.MEDIUM,
      projectId: projects[1].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-03-15'),
      estimatedHours: 24,
      actualHours: 16,
      assignees: {
        connect: [{ id: users[2].id }] // Secretary
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task6);

  const task7 = await prisma.task.create({
    data: {
      title: 'Community Health Assessment',
      description: 'Conduct health assessment surveys in all barangay areas',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: projects[1].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-04-01'),
      estimatedHours: 40,
      assignees: {
        connect: [{ id: users[5].id }] // Staff
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task7);

  // Tasks for Environmental Project
  const task8 = await prisma.task.create({
    data: {
      title: 'Waste Collection Schedule Setup',
      description: 'Establish new waste collection schedules for improved sanitation',
      status: TaskStatus.REVIEW,
      priority: Priority.HIGH,
      projectId: projects[2].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-03-01'),
      estimatedHours: 12,
      actualHours: 14,
      assignees: {
        connect: [{ id: users[4].id }] // Councilor
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task8);

  const task9 = await prisma.task.create({
    data: {
      title: 'Community Education Campaign',
      description: 'Launch awareness campaign on proper waste segregation',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: projects[2].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-03-30'),
      estimatedHours: 20,
      assignees: {
        connect: [{ id: users[2].id }] // Secretary
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task9);

  const task10 = await prisma.task.create({
    data: {
      title: 'Recycling Center Setup',
      description: 'Establish community recycling center operations',
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      projectId: projects[2].id,
      createdById: users[1].id, // Barangay Captain
      dueDate: new Date('2024-05-15'),
      estimatedHours: 30,
      assignees: {
        connect: [{ id: users[5].id }] // Staff
      }
    },
    include: { assignees: true, project: true, createdBy: true }
  });
  tasks.push(task10);

  console.log(`✅ Created ${tasks.length} tasks`);
  return tasks;
}