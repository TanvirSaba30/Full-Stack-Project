const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { registerUser, authUser, getMe, getFacultyList } = require('../config/controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.get('/faculty', protect, getFacultyList);

module.exports = router;