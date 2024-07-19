const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const noteUser = require('../models/user');

exports.registerUser = async (req, res) => {
  const { username,email,password } = req.body;

  try {
    let user = await noteUser.findOne({ username });
    console.log(user)
    if (user) return res.status(400).json({ msg: 'User already exists' });

    else{
      user = new noteUser({ username,email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 8200 }, (err, token) => {
      if (err) throw err;
      res.json({ token });

    })}
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await noteUser.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
    else{
      const payload = { user: { id: user.id } };
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 8200 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await noteUser.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
