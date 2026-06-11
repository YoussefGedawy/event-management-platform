const Venue = require('../models/Venue');

const getVenues = async (req, res) => {
  try {
    const { location, capacity, date } = req.query;
    let filter = { isActive: true };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };
    const venues = await Venue.find(filter);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createVenue = async (req, res) => {
  try {
    const { name, location, capacity, price, description, amenities } = req.body;
    if (!name || !location || !capacity || !price) {
      return res.status(400).json({ message: 'Name, location, capacity and price are required' });
    }
    const venue = await Venue.create({
      name, location, capacity, price, description, amenities,
      owner: req.user.userId
    });
    res.status(201).json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json({ message: 'Venue deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getVenues, getVenue, createVenue, updateVenue, deleteVenue };