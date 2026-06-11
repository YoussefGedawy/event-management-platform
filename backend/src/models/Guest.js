const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  rsvpStatus: { type: String, enum: ['pending', 'attending', 'not_attending', 'maybe'], default: 'pending' },
  dietaryPreference: { type: String, default: '' },
  checkedIn: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);