const express = require('express');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { createSlot, getMySlots, getAvailableSlots } = require('../controllers/facultyController');
const router = express.Router();

router.post('/', protect, authorizeRoles('faculty'), createSlot);
router.get('/', protect, authorizeRoles('faculty'), getMySlots);
router.get('/available/:facultyId', protect, getAvailableSlots);

module.exports = router;