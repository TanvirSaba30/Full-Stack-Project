// seedFaculty.js — Run once to add faculty to the database
// Usage: node seedFaculty.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const facultyData = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Data Structures & Algorithms',
    designation: 'Professor',
    phone: '9876543210',
    maxAppointments: 8,
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Machine Learning',
    designation: 'Associate Professor',
    phone: '9876543211',
    maxAppointments: 10,
  },
  {
    name: 'Dr. Amit Verma',
    email: 'amit.verma@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Electronics',
    subject: 'Digital Signal Processing',
    designation: 'Professor',
    phone: '9876543212',
    maxAppointments: 6,
  },
  {
    name: 'Dr. Sneha Patel',
    email: 'sneha.patel@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Mathematics',
    subject: 'Linear Algebra',
    designation: 'Assistant Professor',
    phone: '9876543213',
    maxAppointments: 12,
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Electronics',
    subject: 'Embedded Systems',
    designation: 'Professor',
    phone: '9876543214',
    maxAppointments: 5,
  },
  {
    name: 'Dr. Ananya Reddy',
    email: 'ananya.reddy@university.edu',
    password: 'faculty123',
    role: 'faculty',
    department: 'Computer Science',
    subject: 'Database Management Systems',
    designation: 'Associate Professor',
    phone: '9876543215',
    maxAppointments: 10,
  },
];

async function seedFaculty() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const faculty of facultyData) {
      const exists = await User.findOne({ email: faculty.email });
      if (exists) {
        console.log(`⏭️  Skipping ${faculty.name} — already exists`);
        continue;
      }
      await User.create(faculty);
      console.log(`✅ Added ${faculty.name} (${faculty.subject})`);
    }

    console.log('\n🎉 Faculty seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedFaculty();
