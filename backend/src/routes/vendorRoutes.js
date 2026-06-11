const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getVendors, createVendor, updateVendor, deleteVendor, getVendorRequests, createVendorRequest, updateVendorRequest } = require('../controllers/vendorController');

router.get('/', auth, getVendors);
router.post('/', auth, createVendor);
router.put('/:id', auth, updateVendor);
router.delete('/:id', auth, deleteVendor);

router.get('/requests', auth, getVendorRequests);
router.post('/requests', auth, createVendorRequest);
router.put('/requests/:id', auth, updateVendorRequest);

module.exports = router;