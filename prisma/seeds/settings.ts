import { PrismaClient } from '@prisma/client';

export async function seedSettings(prisma: PrismaClient, users: any[]) {
  console.log('⚙️ Seeding settings...');

  const settings = await prisma.setting.createMany({
    data: [
      {
        key: 'BARANGAY_NAME',
        value: 'Barangay Bitano',
        description: 'Official name of the barangay',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'BARANGAY_ADDRESS',
        value: 'Bitano, Butuan City, Agusan del Norte',
        description: 'Complete address of the barangay',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'CONTACT_PHONE',
        value: '+63 912 345 6789',
        description: 'Official contact phone number',
        category: 'contact',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'CONTACT_EMAIL',
        value: 'barangay.bitano@butuan.gov.ph',
        description: 'Official email address',
        category: 'contact',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'OFFICE_HOURS',
        value: 'Monday to Friday: 8:00 AM - 5:00 PM',
        description: 'Official office operating hours',
        category: 'general',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'POPULATION_COUNT',
        value: '4,250',
        description: 'Current population count of the barangay',
        category: 'statistics',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'HOUSEHOLD_COUNT',
        value: '1,180',
        description: 'Number of households in the barangay',
        category: 'statistics',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'LAND_AREA',
        value: '2.8 square kilometers',
        description: 'Total land area of the barangay',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'MISSION_STATEMENT',
        value: 'To serve our community with integrity, transparency, and dedication towards sustainable development and improved quality of life for all residents.',
        description: 'Official mission statement',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'VISION_STATEMENT',
        value: 'A progressive, peaceful, and prosperous barangay where every resident enjoys a safe, healthy, and sustainable environment.',
        description: 'Official vision statement',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'EMERGENCY_HOTLINE',
        value: '911 / +63 912 345 6789',
        description: 'Emergency contact numbers',
        category: 'emergency',
        isPublic: true,
        updatedBy: users[4].id, // Councilor
      },
      {
        key: 'WEBSITE_URL',
        value: 'https://barangaybitano.gov.ph',
        description: 'Official website URL',
        category: 'contact',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'FACEBOOK_PAGE',
        value: 'https://facebook.com/BarangayBitano',
        description: 'Official Facebook page',
        category: 'social',
        isPublic: true,
        updatedBy: users[2].id, // Secretary
      },
      {
        key: 'ESTABLISHMENT_DATE',
        value: 'March 15, 1985',
        description: 'Date when the barangay was officially established',
        category: 'general',
        isPublic: true,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'MAX_FILE_UPLOAD_SIZE',
        value: '10485760', // 10MB in bytes
        description: 'Maximum file upload size in bytes',
        category: 'system',
        isPublic: false,
        updatedBy: users[0].id, // Admin
      },
      {
        key: 'DOCUMENT_RETENTION_PERIOD',
        value: '7', // 7 years
        description: 'Document retention period in years',
        category: 'system',
        isPublic: false,
        updatedBy: users[0].id, // Admin
      },
      {
        key: 'AUTO_BACKUP_ENABLED',
        value: 'true',
        description: 'Enable automatic database backups',
        category: 'system',
        isPublic: false,
        updatedBy: users[0].id, // Admin
      },
      {
        key: 'NOTIFICATION_EMAIL_ENABLED',
        value: 'true',
        description: 'Enable email notifications for important events',
        category: 'notifications',
        isPublic: false,
        updatedBy: users[0].id, // Admin
      },
      {
        key: 'PUBLIC_REGISTRATION_ENABLED',
        value: 'false',
        description: 'Allow public registration for events',
        category: 'events',
        isPublic: false,
        updatedBy: users[1].id, // Barangay Captain
      },
      {
        key: 'MAINTENANCE_MODE',
        value: 'false',
        description: 'System maintenance mode status',
        category: 'system',
        isPublic: false,
        updatedBy: users[0].id, // Admin
      },
    ],
  });

  console.log(`✅ Created ${settings.count} settings`);

  // Return the created settings for use by other seeders
  const createdSettings = await prisma.setting.findMany({
    include: {
      updatedByUser: true,
    },
  });

  return createdSettings;
}
