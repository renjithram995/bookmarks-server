const express = require('express');
const router = express.Router();
const { searchRepos } = require('../controllers/githubController');
const auth = require('../middleware/authMiddleware');


router.get('/search/:query', auth, searchRepos);

module.exports = router;
