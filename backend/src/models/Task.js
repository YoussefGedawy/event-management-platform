const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['not_assigned', 'in_progress', 'done'], default: 'not_assigned' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);