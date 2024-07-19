const jwt = require('jsonwebtoken');
const config = require('config');
const noteUser = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = await noteUser.findById(decoded.user.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

