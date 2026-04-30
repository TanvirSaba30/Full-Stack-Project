const Appointment = require('../models/Appointment');
const TimeSlot = require('../models/TimeSlot');
const Notification = require('../models/Notification');

const bookAppointment = async (req, res) => {
  try {
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

    await Notification.create({
      userId: slot.facultyId,
      appointmentId: appointment._id,
      message: `New appointment request from ${req.user.name} for ${slot.startTime}`
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('studentId', 'name email department')
      .populate('facultyId', 'name email department')
      .populate('slotId');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'student') filter.studentId = req.user._id;
    if (req.user.role === 'faculty') filter.facultyId = req.user._id;

    const appointments = await Appointment.find(filter)
      .populate('studentId', 'name email department')
      .populate('facultyId', 'name email department')
      .populate('slotId')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.facultyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    await Notification.create({
      userId: appointment.studentId,
      appointmentId: appointment._id,
      message: `Your appointment has been ${status.toUpperCase()}`
    });

    const populated = await Appointment.findById(appointment._id)
      .populate('studentId', 'name email department')
      .populate('facultyId', 'name email department')
      .populate('slotId');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, getMyAppointments, updateAppointmentStatus };