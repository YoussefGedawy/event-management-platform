const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['planning', 'confirmed', 'completed', 'cancelled'], default: 'planning' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);