const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const User = require('../backend/src/models/User');
const Event = require('../backend/src/models/Event');
const Venue = require('../backend/src/models/Venue');
const Guest = require('../backend/src/models/Guest');
const Task = require('../backend/src/models/Task');
const Vendor = require('../backend/src/models/Vendor');
const VendorRequest = require('../backend/src/models/VendorRequest');

const MONGO_URI = 'mongodb://youssefgedawy2018_db_user:Test1234@ac-e8xv4vx-shard-00-00.qowjyrq.mongodb.net:27017,ac-e8xv4vx-shard-00-01.qowjyrq.mongodb.net:27017,ac-e8xv4vx-shard-00-02.qowjyrq.mongodb.net:27017/eventmanagement?ssl=true&replicaSet=atlas-a3gly6-shard-0&authSource=admin&appName=Cluster0';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const organizer = await User.create({
      name: 'Test Organizer',
      email: 'organizer@test.com',
      password: hashedPassword,
      role: 'organizer'
    });

    const staffMembers = [];
    for (let i = 0; i < 20; i++) {
      const staff = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'staff'
      });
      staffMembers.push(staff);
    }

    const venueOwner = await User.create({
      name: faker.person.fullName(),
      email: 'venueowner@test.com',
      password: hashedPassword,
      role: 'venue_owner'
    });

    const vendorUser = await User.create({
      name: faker.person.fullName(),
      email: 'vendor@test.com',
      password: hashedPassword,
      role: 'vendor'
    });

    await User.create({
      name: faker.person.fullName(),
      email: 'guest@test.com',
      password: hashedPassword,
      role: 'guest'
    });

    console.log('Created users');

    const venues = [];
    const cities = ['Cairo', 'Berlin', 'London', 'Paris', 'Dubai', 'New York', 'Tokyo', 'Sydney', 'Rome', 'Barcelona'];
    for (let i = 0; i < 10; i++) {
      const venue = await Venue.create({
        name: faker.company.name() + ' Hall',
        location: cities[i],
        capacity: faker.number.int({ min: 50, max: 1000 }),
        price: faker.number.int({ min: 500, max: 10000 }),
        description: faker.lorem.sentence(),
        amenities: 'WiFi, Parking, Catering, AV Equipment',
        owner: venueOwner._id
      });
      venues.push(venue);
    }
    console.log('Created venues');

    const vendors = [];
    const suppliesOptions = ['Catering', 'Flowers', 'AV Equipment', 'Lighting', 'Photography', 'Security', 'Cleaning', 'Furniture', 'Music', 'Decoration'];
    for (let i = 0; i < 15; i++) {
      const vendor = await Vendor.create({
        companyName: faker.company.name(),
        supplies: suppliesOptions[i % suppliesOptions.length],
        location: faker.location.city(),
        pricingList: `$${faker.number.int({ min: 100, max: 5000 })} per event`,
        contactInfo: faker.internet.email(),
        owner: vendorUser._id
      });
      vendors.push(vendor);
    }
    console.log('Created vendors');

    const events = [];
    const statuses = ['planning', 'confirmed', 'completed', 'cancelled'];
    for (let i = 0; i < 20; i++) {
      const event = await Event.create({
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        date: faker.date.future(),
        organizer: organizer._id,
        venue: venues[i % venues.length]._id,
        budget: faker.number.int({ min: 1000, max: 50000 }),
        status: statuses[i % statuses.length]
      });
      events.push(event);
    }
    console.log('Created events');

    const rsvpStatuses = ['pending', 'attending', 'not_attending', 'maybe'];
    const dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Halal', 'Gluten-free'];
    for (let i = 0; i < 100; i++) {
      await Guest.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        event: events[i % events.length]._id,
        rsvpStatus: rsvpStatuses[i % rsvpStatuses.length],
        dietaryPreference: dietaryOptions[i % dietaryOptions.length],
        checkedIn: faker.datatype.boolean()
      });
    }
    console.log('Created guests');

    const taskTitles = ['Set up stage', 'Arrange seating', 'Prepare catering', 'Test AV equipment',
      'Welcome guests', 'Manage parking', 'Coordinate vendors', 'Setup decorations',
      'Manage registration', 'Handle security'];
    const taskStatuses = ['not_assigned', 'in_progress', 'done'];
    for (let i = 0; i < 50; i++) {
      await Task.create({
        title: taskTitles[i % taskTitles.length],
        event: events[i % events.length]._id,
        assignedStaff: staffMembers[i % staffMembers.length]._id,
        status: taskStatuses[i % taskStatuses.length]
      });
    }
    console.log('Created tasks');

    for (let i = 0; i < 20; i++) {
      await VendorRequest.create({
        vendor: vendors[i % vendors.length]._id,
        event: events[i % events.length]._id,
        requestedItems: faker.commerce.productName(),
        quantity: `${faker.number.int({ min: 1, max: 100 })} units`,
        deliveryDate: faker.date.future(),
        status: ['pending', 'accepted', 'declined', 'delivered'][i % 4],
        notes: faker.lorem.sentence()
      });
    }
    console.log('Created vendor requests');

    console.log('\n✅ Seed completed successfully!');
    console.log('Test accounts:');
    console.log('  Organizer:  organizer@test.com / password123');
    console.log('  Vendor:     vendor@test.com / password123');
    console.log('  Guest:      guest@test.com / password123');
    console.log('  VenueOwner: venueowner@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.log('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();