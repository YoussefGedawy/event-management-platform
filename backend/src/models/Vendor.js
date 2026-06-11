const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  supplies: { type: String, required: true },
  location: { type: String, required: true },
  pricingList: { type: String },
  contactInfo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);