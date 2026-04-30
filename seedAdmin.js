// seedAdmin.js — Run once to create the admin user
// Usage: node seedAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const adminData = {
  name: 'Admin',
  email: 'admin@university.edu',
  password: 'admin123',
  role: 'admin',
  department: 'Administration',
  phone: '9999999999',
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const exists = await User.findOne({ email: adminData.email });
    if (exists) {
      console.log('⏭️  Admin already exists. Skipping.');
      process.exit(0);
    }

    await User.create(adminData);
    console.log('✅ Admin user created!');
    console.log('');
    console.log('📋 Admin Credentials:');
    console.log(`   Email:    ${adminData.email}`);
    console.log(`   Password: ${adminData.password}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedAdmin();
