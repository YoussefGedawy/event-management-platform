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

// Seed route: wipes all collections and inserts fresh dummy data.
// Visit http://localhost:5000/api/seed in the browser to (re)populate the database.
app.get('/api/seed', async (req, res) => {
  const { faker } = require('@faker-js/faker');
  const bcrypt = require('bcryptjs');
  const User = require('./src/models/User');
  const Event = require('./src/models/Event');
  const Venue = require('./src/models/Venue');
  const Guest = require('./src/models/Guest');
  const Task = require('./src/models/Task');
  const Vendor = require('./src/models/Vendor');
  const VendorRequest = require('./src/models/VendorRequest');

  try {
    // Reset: clear everything so the seed can be run repeatedly
    await User.deleteMany({});
    await Event.deleteMany({});
    await Venue.deleteMany({});
    await Guest.deleteMany({});
    await Task.deleteMany({});
    await Vendor.deleteMany({});
    await VendorRequest.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const cities = ['Cairo', 'Berlin', 'London', 'Paris', 'Dubai', 'New York', 'Tokyo', 'Sydney', 'Rome', 'Barcelona'];
    const supplies = ['Catering', 'Flowers', 'AV Equipment', 'Lighting', 'Photography', 'Security', 'Cleaning', 'Furniture', 'Music', 'Decoration'];

    // Fixed test accounts (one per role) so every dashboard can be demoed
    const organizer = await User.create({ name: 'Test Organizer', email: 'organizer@test.com', password: hashedPassword, role: 'organizer' });
    const venueOwner = await User.create({ name: 'Test VenueOwner', email: 'venueowner@test.com', password: hashedPassword, role: 'venue_owner' });
    await User.create({ name: 'Test Vendor', email: 'vendor@test.com', password: hashedPassword, role: 'vendor' });

    // 20 staff members. The first one has a known login so the Staff dashboard is demoable.
    const staffMembers = [];
    const knownStaff = await User.create({ name: 'Test Staff', email: 'staff@test.com', password: hashedPassword, role: 'staff' });
    staffMembers.push(knownStaff);
    for (let i = 0; i < 19; i++) {
      const s = await User.create({ name: faker.person.fullName(), email: faker.internet.email(), password: hashedPassword, role: 'staff' });
      staffMembers.push(s);
    }

    // 10 venues, owned by the venue owner
    const venues = [];
    for (let i = 0; i < 10; i++) {
      const v = await Venue.create({ name: faker.company.name() + ' Hall', location: cities[i], capacity: faker.number.int({ min: 50, max: 1000 }), price: faker.number.int({ min: 500, max: 10000 }), description: faker.lorem.sentence(), amenities: 'WiFi, Parking, Catering', owner: venueOwner._id });
      venues.push(v);
    }

    // 15 vendors
    const vendors = [];
    for (let i = 0; i < 15; i++) {
      const v = await Vendor.create({ companyName: faker.company.name(), supplies: supplies[i % supplies.length], location: faker.location.city(), pricingList: `$${faker.number.int({ min: 100, max: 5000 })} per event`, contactInfo: faker.internet.email(), owner: organizer._id });
      vendors.push(v);
    }

    // 20 events, each with a venue
    const events = [];
    for (let i = 0; i < 20; i++) {
      const e = await Event.create({ title: faker.lorem.words(3), description: faker.lorem.sentence(), date: faker.date.future(), organizer: organizer._id, venue: venues[i % venues.length]._id, budget: faker.number.int({ min: 1000, max: 50000 }), status: ['planning', 'confirmed', 'completed', 'cancelled'][i % 4] });
      events.push(e);
    }

    // 100 guests. The first guest uses guest@test.com so the Guest dashboard is demoable.
    await User.create({ name: 'Test Guest', email: 'guest@test.com', password: hashedPassword, role: 'guest' });
    await Guest.create({ name: 'Test Guest', email: 'guest@test.com', event: events[0]._id, rsvpStatus: 'pending', dietaryPreference: 'Vegetarian' });
    for (let i = 0; i < 99; i++) {
      await Guest.create({ name: faker.person.fullName(), email: faker.internet.email(), event: events[i % events.length]._id, rsvpStatus: ['pending', 'attending', 'not_attending', 'maybe'][i % 4], dietaryPreference: ['None', 'Vegetarian', 'Vegan', 'Halal'][i % 4], checkedIn: faker.datatype.boolean() });
    }

    // 50 tasks. Because knownStaff is at index 0, it gets several tasks (indexes 0,10,20,...).
    for (let i = 0; i < 50; i++) {
      await Task.create({ title: ['Set up stage', 'Arrange seating', 'Prepare catering', 'Test AV', 'Welcome guests'][i % 5], event: events[i % events.length]._id, assignedStaff: staffMembers[i % staffMembers.length]._id, status: ['not_assigned', 'in_progress', 'done'][i % 3] });
    }

    // 20 vendor requests so the Vendor dashboard has data
    for (let i = 0; i < 20; i++) {
      await VendorRequest.create({ vendor: vendors[i % vendors.length]._id, event: events[i % events.length]._id, requestedItems: faker.commerce.productName(), quantity: `${faker.number.int({ min: 1, max: 100 })} units`, deliveryDate: faker.date.future(), status: ['pending', 'accepted', 'declined', 'delivered'][i % 4], notes: faker.lorem.sentence() });
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