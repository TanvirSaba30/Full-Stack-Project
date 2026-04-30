// seedSlots.js — Run once to add time slots for all faculty
// Usage: node seedSlots.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const TimeSlot = require('./models/TimeSlot');

dotenv.config();

// Generate slots for the next 7 days (Mon-Sat)
function getNextDays(count) {
  const days = [];
  const today = new Date();
  let d = new Date(today);
  d.setDate(d.getDate() + 1); // start from tomorrow

  while (days.length < count) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0) { // skip Sundays
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Different slot timings for variety
const slotTimings = [
  { startTime: '09:00', endTime: '09:30' },
  { startTime: '09:30', endTime: '10:00' },
  { startTime: '10:00', endTime: '10:30' },
  { startTime: '10:30', endTime: '11:00' },
  { startTime: '11:00', endTime: '11:30' },
  { startTime: '11:30', endTime: '12:00' },
  { startTime: '14:00', endTime: '14:30' },
  { startTime: '14:30', endTime: '15:00' },
  { startTime: '15:00', endTime: '15:30' },
  { startTime: '15:30', endTime: '16:00' },
];

async function seedSlots() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const facultyMembers = await User.find({ role: 'faculty' });
    if (facultyMembers.length === 0) {
      console.log('❌ No faculty found. Run seedFaculty.js first.');
      process.exit(1);
    }

    const days = getNextDays(6); // next 6 working days
    let totalAdded = 0;

    for (const faculty of facultyMembers) {
      // Each faculty gets 3-5 slots per day (randomized for variety)
      for (const day of days) {
        // Pick a random subset of slots for this day
        const shuffled = [...slotTimings].sort(() => Math.random() - 0.5);
        const numSlots = 3 + Math.floor(Math.random() * 3); // 3 to 5 slots
        const daySlots = shuffled.slice(0, numSlots);

        for (const slot of daySlots) {
          // Check if slot already exists
          const exists = await TimeSlot.findOne({
            facultyId: faculty._id,
            date: day,
            startTime: slot.startTime,
          });

          if (!exists) {
            await TimeSlot.create({
              facultyId: faculty._id,
              date: day,
              startTime: slot.startTime,
              endTime: slot.endTime,
              status: 'available',
            });
            totalAdded++;
          }
        }
      }
      console.log(`✅ Added slots for ${faculty.name}`);
    }

    console.log(`\n🎉 Slot seeding complete! ${totalAdded} slots added.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedSlots();
