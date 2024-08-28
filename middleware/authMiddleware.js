const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = function(req, res, next) {
  const authToken = req.headers.authorization?.split(' ')[1] || '';
  if (!authToken) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      msg: err.name === 'TokenExpiredError' ? 'Token expired' : 'Token is not valid'
    });
  }
};
