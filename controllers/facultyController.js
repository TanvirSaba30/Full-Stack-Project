const TimeSlot = require('../models/TimeSlot');

const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const slot = await TimeSlot.create({
      facultyId: req.user._id,
      date,
      startTime,
      endTime
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMySlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({ facultyId: req.user._id }).sort({ date: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available slots for a specific faculty (used by students)
const getAvailableSlots = async (req, res) => {
  try {
    const slots = await TimeSlot.find({
      facultyId: req.params.facultyId,
      status: 'available'
    }).sort({ date: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSlot, getMySlots, getAvailableSlots };