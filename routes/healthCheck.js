const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/', auth, (req, res) => {
  res.status(200).json({
    timeZone: new Date().toISOString(),
    code: 200,
    message: 'success',
  });
});

module.exports = router;