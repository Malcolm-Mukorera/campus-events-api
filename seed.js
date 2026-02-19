/**
 * Seed script — populates the database with sample events and a test user.
 * Run with: node seed.js
 * Clear data: node seed.js --clear
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');

dotenv.config();

const sampleUser = {
  name: 'Test User',
  email: 'test@university.ac.uk',
  password: 'password123',
};

const sampleEvents = [
  {
    title: 'Annual Tech & Innovation Fair',
    description: 'Showcase your projects and network with industry professionals. Open to all students from any faculty. Refreshments provided.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    location: 'Main Hall, Student Union Building',
    category: 'academic',
    faculty: 'Engineering',
    capacity: 200,
  },
  {
    title: 'Inter-Faculty Football Tournament',
    description: 'Annual football competition between faculties. Form your team of 11 and register at the sports office before the deadline.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: 'University Sports Ground',
    category: 'sports',
    faculty: 'All',
    capacity: 150,
  },
  {
    title: 'Graduate Careers & Networking Evening',
    description: 'Meet recruiters from over 20 top companies. Bring copies of your CV. Smart casual dress code applies.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: 'Business School Atrium',
    category: 'career',
    faculty: 'All',
    capacity: 300,
  },
  {
    title: 'International Food Festival',
    description: 'A celebration of cultures with food, music and performances from students around the world. Free entry for all students.',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    location: 'Campus Quad',
    category: 'social',
    faculty: 'All',
    capacity: null,
  },
  {
    title: 'Machine Learning Workshop',
    description: 'Hands-on introduction to machine learning using Python and scikit-learn. Laptops required. Beginners welcome.',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    location: 'Computer Lab 2B',
    category: 'academic',
    faculty: 'Computer Science',
    capacity: 30,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (process.argv.includes('--clear')) {
      await User.deleteMany({});
      await Event.deleteMany({});
      console.log('🗑️  Database cleared');
      process.exit(0);
    }

    // Create test user
    const user = await User.create(sampleUser);
    console.log(`👤 Created test user: ${user.email} / password123`);

    // Create events linked to that user
    const eventsWithOrganizer = sampleEvents.map(e => ({ ...e, organizer: user._id }));
    await Event.insertMany(eventsWithOrganizer);
    console.log(`🎉 Created ${sampleEvents.length} sample events`);

    console.log('\n✅ Seed complete! You can now start the server with: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
