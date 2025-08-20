// Test account creation helper
// Run this to create a test account in your Clerk dashboard

const testAccounts = [
  {
    email: 'admin@test-barangay.com',
    password: 'TestPassword123!',
    role: 'ADMIN',
    name: 'Test Admin',
    jobTitle: 'System Administrator'
  },
  {
    email: 'captain@test-barangay.com', 
    password: 'TestPassword123!',
    role: 'BARANGAY_CAPTAIN',
    name: 'Test Captain',
    jobTitle: 'Barangay Captain'
  },
  {
    email: 'staff@test-barangay.com',
    password: 'TestPassword123!', 
    role: 'STAFF',
    name: 'Test Staff',
    jobTitle: 'Administrative Staff'
  }
];

console.log('🔐 Test Accounts for Manual Creation in Clerk Dashboard:');
console.log('===================================================');

testAccounts.forEach((account, index) => {
  console.log(`\n${index + 1}. ${account.role}`);
  console.log(`   📧 Email: ${account.email}`);
  console.log(`   🔑 Password: ${account.password}`);
  console.log(`   👤 Name: ${account.name}`);
  console.log(`   💼 Job Title: ${account.jobTitle}`);
});

console.log('\n📋 Instructions:');
console.log('1. Go to your Clerk Dashboard');
console.log('2. Navigate to Users section');
console.log('3. Create new users with the above credentials');
console.log('4. Use these accounts to test login at http://localhost:3000/login');
console.log('\n🚀 Ready to test!');
