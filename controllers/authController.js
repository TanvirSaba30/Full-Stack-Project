const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

// Register user (uses MongoDB + bcrypt via User model)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, department, phone });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user from token
const getMe = async (req, res) => {
  res.json(req.user);
};

// Get all faculty members (for browse faculty)
const getFacultyList = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('-password');
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser, getMe, getFacultyList };