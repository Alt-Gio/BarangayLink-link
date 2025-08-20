import { PrismaClient, ProjectStatus, ProjectCategory, Priority } from '@prisma/client';

export async function seedProjects(prisma: PrismaClient, users: any[]) {
  console.log('🏗️ Creating projects...');
  
  const [admin, captain, secretary, treasurer, councilor1, councilor2, staff1, staff2] = users;

  const projects = await Promise.all([
    // Infrastructure Project
    prisma.project.create({
      data: {
        name: 'New Health Center Construction',
        description: 'Construction of a modern 2-story health center to serve the growing population of the barangay.',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date('2024-06-01'),
        dueDate: new Date('2024-12-31'),
        budget: 8500000,
        expenditure: 3200000,
        category: ProjectCategory.HEALTH,
        priority: Priority.HIGH,
        objectives: 'Provide quality healthcare services to all barangay residents',
        beneficiaries: 'All 12,000 barangay residents',
        location: 'Lot 123, Barangay Center',
        methodology: 'Design-Build procurement method with community participation',
        expectedOutcome: 'Improved health outcomes and accessibility to healthcare services',
        progressPercentage: 38,
        isPublic: true,
        managerId: councilor1.id,
        createdById: captain.id,
        team: {
          connect: [
            { id: councilor2.id },
            { id: staff1.id },
            { id: staff2.id },
          ],
        },
      },
    }),
    // Digital Literacy Project
    prisma.project.create({
      data: {
        name: 'Senior Citizens Digital Literacy Program',
        description: 'Comprehensive digital literacy training program for senior citizens.',
        status: ProjectStatus.APPROVED,
        startDate: new Date('2024-09-01'),
        dueDate: new Date('2024-11-30'),
        budget: 450000,
        expenditure: 0,
        category: ProjectCategory.EDUCATION,
        priority: Priority.MEDIUM,
        objectives: 'Empower senior citizens with digital skills',
        beneficiaries: '150 senior citizens aged 60 and above',
        location: 'Community Learning Center',
        methodology: 'Hands-on training sessions with peer tutoring',
        expectedOutcome: 'Digitally literate senior citizens who can access online services',
        progressPercentage: 15,
        isPublic: true,
        managerId: secretary.id,
        createdById: councilor1.id,
        team: {
          connect: [
            { id: staff1.id },
          ],
        },
      },
    }),
    // Environmental Project
    prisma.project.create({
      data: {
        name: 'Solid Waste Management Enhancement',
        description: 'Implementation of improved solid waste management system.',
        status: ProjectStatus.COMPLETED,
        startDate: new Date('2024-03-01'),
        dueDate: new Date('2024-08-31'),
        completedDate: new Date('2024-08-25'),
        budget: 1200000,
        expenditure: 1150000,
        category: ProjectCategory.ENVIRONMENT,
        priority: Priority.HIGH,
        objectives: 'Achieve zero waste-to-landfill target',
        beneficiaries: 'All households and business establishments',
        location: 'Entire barangay area',
        methodology: 'Community-based waste management approach',
        expectedOutcome: 'Cleaner environment and sustainable waste management',
        progressPercentage: 100,
        isPublic: true,
        managerId: councilor2.id,
        createdById: captain.id,
        team: {
          connect: [
            { id: staff2.id },
          ],
        },
      },
    }),
    // Youth Development Project
    prisma.project.create({
      data: {
        name: 'Youth Leadership Development Program',
        description: 'Comprehensive leadership training and skills development program.',
        status: ProjectStatus.PLANNING,
        startDate: new Date('2024-10-01'),
        dueDate: new Date('2025-03-31'),
        budget: 650000,
        expenditure: 0,
        category: ProjectCategory.YOUTH,
        priority: Priority.MEDIUM,
        objectives: 'Develop next generation of community leaders',
        beneficiaries: '100 youth aged 18-30',
        location: 'Youth Development Center',
        methodology: 'Mentorship-based learning with practical projects',
        expectedOutcome: 'Empowered youth ready for leadership responsibilities',
        progressPercentage: 5,
        isPublic: true,
        managerId: staff1.id,
        createdById: councilor1.id,
        team: {
          connect: [
            { id: staff2.id },
          ],
        },
      },
    }),
    // Sports Development Project
    prisma.project.create({
      data: {
        name: 'Community Sports Complex Development',
        description: 'Development of a multi-purpose sports complex.',
        status: ProjectStatus.APPROVED,
        startDate: new Date('2024-11-01'),
        dueDate: new Date('2025-06-30'),
        budget: 2800000,
        expenditure: 0,
        category: ProjectCategory.SPORTS,
        priority: Priority.MEDIUM,
        objectives: 'Promote healthy lifestyle through sports and recreation',
        beneficiaries: 'All barangay residents, especially youth',
        location: 'Barangay Sports Ground',
        methodology: 'Phased construction with community involvement',
        expectedOutcome: 'Modern sports facility for community use',
        progressPercentage: 8,
        isPublic: true,
        managerId: councilor2.id,
        createdById: captain.id,
        team: {
          connect: [
            { id: councilor1.id },
            { id: staff1.id },
          ],
        },
      },
    }),
  ]);

  return projects;
}
