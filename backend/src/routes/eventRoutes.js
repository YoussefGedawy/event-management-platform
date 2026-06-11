const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

router.get('/', auth, getEvents);
router.get('/:id', auth, getEvent);
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;