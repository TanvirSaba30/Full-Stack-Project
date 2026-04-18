const Appointment = require('../models/Appointment');
const TimeSlot = require('../models/TimeSlot');
const Notification = require('../models/Notification');

const bookAppointment = async (req, res) => {
  const { slotId, purpose } = req.body;
  const slot = await TimeSlot.findById(slotId);
  if (!slot || slot.status !== 'available') {
    return res.status(400).json({ message: 'Slot not available' });
  }

  const appointment = await Appointment.create({
    studentId: req.user._id,
    facultyId: slot.facultyId,
    slotId,
    purpose,
    status: 'pending'
  });

  slot.status = 'booked';
  await slot.save();

  // Notify faculty
  await Notification.create({
    userId: slot.facultyId,
    appointmentId: appointment._id,
    message: `New appointment request from ${req.user.name} for ${slot.startTime}`
  });

  res.status(201).json(appointment);
};

const getMyAppointments = async (req, res) => {
  let filter = {};
  if (req.user.role === 'student') filter.studentId = req.user._id;
  if (req.user.role === 'faculty') filter.facultyId = req.user._id;

  const appointments = await Appointment.find(filter)
    .populate('studentId', 'name email')
    .populate('facultyId', 'name email')
    .populate('slotId');
  res.json(appointments);
};

const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body; // approved / rejected
  const appointment = await Appointment.findById(req.params.id);

  if (appointment.facultyId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  appointment.status = status;
  await appointment.save();

  // Notify student
  await Notification.create({
    userId: appointment.studentId,
    appointmentId: appointment._id,
    message: `Your appointment has been ${status.toUpperCase()}`
  });

  res.json(appointment);
};

module.exports = { bookAppointment, getMyAppointments, updateAppointmentStatus };