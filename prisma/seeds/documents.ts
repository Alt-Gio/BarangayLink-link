import { PrismaClient, DocumentType, AccessLevel } from '@prisma/client';

export async function seedDocuments(prisma: PrismaClient, users: any[], projects: any[]) {
  console.log('📄 Seeding documents...');

  const documents = await prisma.document.createMany({
    data: [
      {
        filename: 'basketball_court_contract.pdf',
        originalName: 'Basketball Court Construction Contract.pdf',
        filepath: '/documents/contracts/basketball_court_contract.pdf',
        url: '/documents/contracts/basketball_court_contract.pdf',
        mimetype: 'application/pdf',
        size: BigInt(2048576), // 2MB
        type: DocumentType.DOCUMENT,
        category: 'Infrastructure',
        description: 'Official contract agreement for the basketball court construction project',
        isPublic: false,
        accessLevel: AccessLevel.MANAGEMENT,
        uploadedById: users[2].id, // Secretary
        projectId: projects[0].id, // Infrastructure Project
      },
      {
        filename: 'health_program_budget.xlsx',
        originalName: 'Health Program Budget Proposal.xlsx',
        filepath: '/documents/budgets/health_program_budget.xlsx',
        url: '/documents/budgets/health_program_budget.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: BigInt(512000), // 512KB
        type: DocumentType.SPREADSHEET,
        category: 'Financial',
        description: 'Detailed budget proposal for the community health program implementation',
        isPublic: true,
        accessLevel: AccessLevel.PUBLIC,
        uploadedById: users[3].id, // Treasurer
        projectId: projects[1].id, // Health Program
      },
      {
        filename: 'environmental_impact_assessment.pdf',
        originalName: 'Environmental Impact Assessment.pdf',
        filepath: '/documents/reports/environmental_impact_assessment.pdf',
        url: '/documents/reports/environmental_impact_assessment.pdf',
        mimetype: 'application/pdf',
        size: BigInt(3145728), // 3MB
        type: DocumentType.REPORT,
        category: 'Environmental',
        description: 'Environmental impact study for waste management improvement project',
        isPublic: false,
        accessLevel: AccessLevel.OFFICIALS,
        uploadedById: users[5].id, // Staff
        projectId: projects[2].id, // Environmental Project
      },
      {
        filename: 'assembly_minutes_feb_2024.docx',
        originalName: 'Barangay Assembly Minutes - February 2024.docx',
        filepath: '/documents/minutes/assembly_minutes_feb_2024.docx',
        url: '/documents/minutes/assembly_minutes_feb_2024.docx',
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: BigInt(256000), // 256KB
        type: DocumentType.DOCUMENT,
        category: 'Governance',
        description: 'Official minutes from the February 2024 monthly barangay assembly',
        isPublic: true,
        accessLevel: AccessLevel.PUBLIC,
        uploadedById: users[2].id, // Secretary
      },
      {
        filename: 'sports_equipment_procurement.pdf',
        originalName: 'Sports Equipment Procurement Plan.pdf',
        filepath: '/documents/procurement/sports_equipment_procurement.pdf',
        url: '/documents/procurement/sports_equipment_procurement.pdf',
        mimetype: 'application/pdf',
        size: BigInt(1024000), // 1MB
        type: DocumentType.DOCUMENT,
        category: 'Infrastructure',
        description: 'Procurement plan for sports equipment for youth development programs',
        isPublic: false,
        accessLevel: AccessLevel.MANAGEMENT,
        uploadedById: users[4].id, // Councilor
        projectId: projects[0].id, // Infrastructure Project
      },
      {
        filename: 'health_guidelines.pdf',
        originalName: 'Community Health Guidelines.pdf',
        filepath: '/documents/policies/health_guidelines.pdf',
        url: '/documents/policies/health_guidelines.pdf',
        mimetype: 'application/pdf',
        size: BigInt(1536000), // 1.5MB
        type: DocumentType.DOCUMENT,
        category: 'Health',
        description: 'Standard operating procedures for community health services',
        isPublic: true,
        accessLevel: AccessLevel.PUBLIC,
        uploadedById: users[2].id, // Secretary
        projectId: projects[1].id, // Health Program
      },
      {
        filename: 'waste_segregation_manual.pdf',
        originalName: 'Waste Segregation Manual.pdf',
        filepath: '/documents/manuals/waste_segregation_manual.pdf',
        url: '/documents/manuals/waste_segregation_manual.pdf',
        mimetype: 'application/pdf',
        size: BigInt(2560000), // 2.5MB
        type: DocumentType.DOCUMENT,
        category: 'Environmental',
        description: 'Comprehensive guide for proper waste segregation practices',
        isPublic: true,
        accessLevel: AccessLevel.PUBLIC,
        uploadedById: users[5].id, // Staff
        projectId: projects[2].id, // Environmental Project
      },
      {
        filename: 'q1_2024_financial_report.xlsx',
        originalName: 'Q1 2024 Financial Report.xlsx',
        filepath: '/documents/reports/q1_2024_financial_report.xlsx',
        url: '/documents/reports/q1_2024_financial_report.xlsx',
        mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: BigInt(768000), // 768KB
        type: DocumentType.REPORT,
        category: 'Financial',
        description: 'Quarterly financial report showing budget utilization and project expenditures',
        isPublic: true,
        accessLevel: AccessLevel.PUBLIC,
        uploadedById: users[3].id, // Treasurer
      },
    ],
  });

  console.log(`✅ Created ${documents.count} documents`);

  // Return the created documents for use by other seeders
  const createdDocuments = await prisma.document.findMany({
    include: {
      uploadedBy: true,
      project: true,
    },
  });

  return createdDocuments;
}