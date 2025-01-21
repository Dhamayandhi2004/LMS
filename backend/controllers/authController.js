const User = require('../models/User'); // Assuming you have a User model

// Register function
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(400).send('Error during registration: ' + err.message);
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid credentials');
    }
    res.status(200).send('User logged in successfully');
  } catch (err) {
    res.status(500).send('Error during login: ' + err.message);
  }
};

module.exports = { register, login };
