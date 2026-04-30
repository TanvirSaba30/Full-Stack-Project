const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { bookAppointment, getMyAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');

router.post('/', protect, bookAppointment);
router.get('/', protect, getMyAppointments);
router.put('/:id/status', protect, authorizeRoles('faculty'), updateAppointmentStatus);

module.exports = router;