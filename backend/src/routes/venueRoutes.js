const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getVenues, getVenue, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');

router.get('/', auth, getVenues);
router.get('/:id', auth, getVenue);
router.post('/', auth, createVenue);
router.put('/:id', auth, updateVenue);
router.delete('/:id', auth, deleteVenue);

module.exports = router;