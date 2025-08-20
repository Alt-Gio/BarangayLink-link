import { PrismaClient, UserRole } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Creating users...');
  
  const users = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        clerkUserId: 'admin_clerk_id',
        name: 'System Administrator',
        email: 'admin@barangaylink.gov.ph',
        position: 'System Administrator',
        role: UserRole.ADMIN,
        employeeId: 'EMP-001',
        phoneNumber: '+63 917 123 4567',
        isActive: true,
      },
    }),
    // Barangay Captain
    prisma.user.create({
      data: {
        clerkUserId: 'captain_clerk_id',
        name: 'Juan de la Cruz',
        email: 'captain@barangaylink.gov.ph',
        position: 'Barangay Captain',
        role: UserRole.BARANGAY_CAPTAIN,
        employeeId: 'CAP-001',
        phoneNumber: '+63 917 234 5678',
        isActive: true,
      },
    }),
    // Secretary
    prisma.user.create({
      data: {
        clerkUserId: 'secretary_clerk_id',
        name: 'Maria Santos',
        email: 'secretary@barangaylink.gov.ph',
        position: 'Barangay Secretary',
        role: UserRole.SECRETARY,
        employeeId: 'SEC-001',
        phoneNumber: '+63 917 345 6789',
        isActive: true,
      },
    }),
    // Treasurer
    prisma.user.create({
      data: {
        clerkUserId: 'treasurer_clerk_id',
        name: 'Roberto Garcia',
        email: 'treasurer@barangaylink.gov.ph',
        position: 'Barangay Treasurer',
        role: UserRole.TREASURER,
        employeeId: 'TRE-001',
        phoneNumber: '+63 917 456 7890',
        isActive: true,
      },
    }),
    // Councilors
    prisma.user.create({
      data: {
        clerkUserId: 'councilor1_clerk_id',
        name: 'Ana Reyes',
        email: 'councilor1@barangaylink.gov.ph',
        position: 'Councilor - Committee on Health',
        role: UserRole.COUNCILOR,
        employeeId: 'CON-001',
        phoneNumber: '+63 917 567 8901',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: 'councilor2_clerk_id',
        name: 'Miguel Torres',
        email: 'councilor2@barangaylink.gov.ph',
        position: 'Councilor - Committee on Infrastructure',
        role: UserRole.COUNCILOR,
        employeeId: 'CON-002',
        phoneNumber: '+63 917 678 9012',
        isActive: true,
      },
    }),
    // Staff
    prisma.user.create({
      data: {
        clerkUserId: 'staff1_clerk_id',
        name: 'Elena Villanueva',
        email: 'staff1@barangaylink.gov.ph',
        position: 'Administrative Assistant',
        role: UserRole.STAFF,
        employeeId: 'STA-001',
        phoneNumber: '+63 917 789 0123',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: 'staff2_clerk_id',
        name: 'Carlos Mendoza',
        email: 'staff2@barangaylink.gov.ph',
        position: 'Field Coordinator',
        role: UserRole.STAFF,
        employeeId: 'STA-002',
        phoneNumber: '+63 917 890 1234',
        isActive: true,
      },
    }),
  ]);

  return users;
}
