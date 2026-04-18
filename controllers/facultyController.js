const TimeSlot = require('../models/TimeSlot');

const createSlot = async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const slot = await TimeSlot.create({
    facultyId: req.user._id,
    date,
    startTime,
    endTime
  });
  res.status(201).json(slot);
};

const getMySlots = async (req, res) => {
  const slots = await TimeSlot.find({ facultyId: req.user._id }).sort({ date: 1 });
  res.json(slots);
};

module.exports = { createSlot, getMySlots };