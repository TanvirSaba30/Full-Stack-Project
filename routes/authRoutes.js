// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Student/Faculty/Admin Registration & Login
router.post('/register', authController.registerUser);
router.post('/login', authController.authUser);

module.exports = router;