const Guest = require('../models/Guest');

const getGuests = async (req, res) => {
  try {
    const { eventId, rsvpStatus } = req.query;
    let filter = {};
    if (eventId) filter.event = eventId;
    if (rsvpStatus) filter.rsvpStatus = rsvpStatus;
    const guests = await Guest.find(filter).populate('event', 'title');
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createGuest = async (req, res) => {
  try {
    const { name, email, event, dietaryPreference } = req.body;
    if (!name || !email || !event) {
      return res.status(400).json({ message: 'Name, email and event are required' });
    }
    const guest = await Guest.create({ name, email, event, dietaryPreference });
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getGuests, createGuest, updateGuest, deleteGuest };