const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Temporary in-memory storage for testing since MongoDB IP is not whitelisted
let users = [];

const registerUser = async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;
  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    password, // Stored in plain text for testing only
    role,
    department,
    phone
  };
  users.push(newUser);

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    department: newUser.department,
    token: generateToken(newUser._id)
  });
};

const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user && user.password === password) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

module.exports = { registerUser, authUser };