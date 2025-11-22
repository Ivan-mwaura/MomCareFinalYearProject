const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../db/config');

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
};
