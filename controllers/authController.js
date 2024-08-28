const User = require('../dbadaptor/dbmodels/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { JWT_EXPIRY, JWT_SECRET } = require('../config');

const getJWTPayload = ({ email, id, username }) => ({
  user: { email, id, username }
});
const JWT_CONFIG = {
  expiresIn: JWT_EXPIRY
};
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();

    jwt.sign(getJWTPayload(user), JWT_SECRET, JWT_CONFIG, (err, token) => {
      if (err) throw err;
      res.json({ token,
        user: {
          email,
          username: user.username
        }
      });
    });
  } catch (err) {
    console.log(err);
    return err.code === 11000 ? res.status(400).json({ msg: 'Username already exists' }) : res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    jwt.sign(getJWTPayload(user), JWT_SECRET, JWT_CONFIG, (err, token) => {
      if (err) throw err;
      res.json({ token,
        user: {
          email,
          username: user.username
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};
