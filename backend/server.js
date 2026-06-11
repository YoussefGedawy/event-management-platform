const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const venueRoutes = require('./src/routes/venueRoutes');
const guestRoutes = require('./src/routes/guestRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const userRoutes = require('./src/routes/userRoutes');
const vendorRoutes = require('./src/routes/vendorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Event Management API is running' });
});

app.get('/api/seed', async (req, res) => {
  const { faker } = require('@faker-js/faker');
  const bcrypt = require('bcryptjs');
  const User = require('./src/models/User');
  const Event = require('./src/models/Event');
  const Venue = require('./src/models/Venue');
  const Guest = require('./src/models/Guest');
  const Task = require('./src/models/Task');
  const Vendor = require('./src/models/Vendor');

  try {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Venue.deleteMany({});
    await Guest.deleteMany({});
    await Task.deleteMany({});
    await Vendor.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const cities = ['Cairo', 'Berlin', 'London', 'Paris', 'Dubai'];
    const supplies = ['Catering', 'Flowers', 'AV Equipment', 'Lighting', 'Photography'];

    const organizer = await User.create({ name: 'Test Organizer', email: 'organizer@test.com', password: hashedPassword, role: 'organizer' });
    await User.create({ name: 'Test Vendor', email: 'vendor@test.com', password: hashedPassword, role: 'vendor' });
    await User.create({ name: 'Test Guest', email: 'guest@test.com', password: hashedPassword, role: 'guest' });
    await User.create({ name: 'Test VenueOwner', email: 'venueowner@test.com', password: hashedPassword, role: 'venue_owner' });

    const staffMembers = [];
    for (let i = 0; i < 10; i++) {
      const s = await User.create({ name: faker.person.fullName(), email: faker.internet.email(), password: hashedPassword, role: 'staff' });
      staffMembers.push(s);
    }

    const venues = [];
    for (let i = 0; i < 5; i++) {
      const v = await Venue.create({ name: faker.company.name() + ' Hall', location: cities[i], capacity: faker.number.int({ min: 50, max: 500 }), price: faker.number.int({ min: 500, max: 5000 }), amenities: 'WiFi, Parking', owner: organizer._id });
      venues.push(v);
    }

    const vendors = [];
    for (let i = 0; i < 10; i++) {
      const v = await Vendor.create({ companyName: faker.company.name(), supplies: supplies[i % supplies.length], location: faker.location.city(), contactInfo: faker.internet.email(), owner: organizer._id });
      vendors.push(v);
    }

    const events = [];
    for (let i = 0; i < 20; i++) {
      const e = await Event.create({ title: faker.lorem.words(3), description: faker.lorem.sentence(), date: faker.date.future(), organizer: organizer._id, budget: faker.number.int({ min: 1000, max: 50000 }), status: ['planning', 'confirmed', 'completed', 'cancelled'][i % 4] });
      events.push(e);
    }

    for (let i = 0; i < 100; i++) {
      await Guest.create({ name: faker.person.fullName(), email: faker.internet.email(), event: events[i % events.length]._id, rsvpStatus: ['pending', 'attending', 'not_attending', 'maybe'][i % 4], dietaryPreference: ['None', 'Vegetarian', 'Vegan', 'Halal'][i % 4] });
    }

    for (let i = 0; i < 50; i++) {
      await Task.create({ title: ['Set up stage', 'Arrange seating', 'Prepare catering', 'Test AV', 'Welcome guests'][i % 5], event: events[i % events.length]._id, assignedStaff: staffMembers[i % staffMembers.length]._id, status: ['not_assigned', 'in_progress', 'done'][i % 3] });
    }

    res.json({ message: '✅ Seed completed! Database populated with dummy data.' });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection failed:', error.message);
  });