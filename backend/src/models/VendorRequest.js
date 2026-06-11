const mongoose = require('mongoose');

const vendorRequestSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  requestedItems: { type: String, required: true },
  quantity: { type: String },
  deliveryDate: { type: Date },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'delivered'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('VendorRequest', vendorRequestSchema);