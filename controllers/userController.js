const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');


const JWT_SECRET_KEY = 'brain@95'; 

const userController = {
  createUser: async (req, res) => {
    try {
      logger.info('User created successfully');
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  },
  registerUser: async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ first_name, last_name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '60m' });
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = userController;
