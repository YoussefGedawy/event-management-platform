const Vendor = require('../models/Vendor');
const VendorRequest = require('../models/VendorRequest');

// Get all vendors
const getVendors = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search) filter.companyName = { $regex: search, $options: 'i' };
    const vendors = await Vendor.find(filter);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create vendor
const createVendor = async (req, res) => {
  try {
    const { companyName, supplies, location, pricingList, contactInfo } = req.body;
    if (!companyName || !supplies || !location) {
      return res.status(400).json({ message: 'Company name, supplies and location are required' });
    }
    const vendor = await Vendor.create({ companyName, supplies, location, pricingList, contactInfo, owner: req.user.userId });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update vendor
const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all vendor requests
const getVendorRequests = async (req, res) => {
  try {
    const { eventId, status } = req.query;
    let filter = {};
    if (eventId) filter.event = eventId;
    if (status) filter.status = status;
    const requests = await VendorRequest.find(filter)
      .populate('vendor', 'companyName location')
      .populate('event', 'title');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create vendor request
const createVendorRequest = async (req, res) => {
  try {
    const { vendor, event, requestedItems, quantity, deliveryDate, notes } = req.body;
    if (!vendor || !event || !requestedItems) {
      return res.status(400).json({ message: 'Vendor, event and requested items are required' });
    }
    const request = await VendorRequest.create({ vendor, event, requestedItems, quantity, deliveryDate, notes });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update vendor request
const updateVendorRequest = async (req, res) => {
  try {
    const request = await VendorRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('vendor', 'companyName')
      .populate('event', 'title');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getVendors, createVendor, updateVendor, deleteVendor, getVendorRequests, createVendorRequest, updateVendorRequest };