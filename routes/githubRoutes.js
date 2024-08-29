const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { searchRepos, userRepository } = require('../controllers/githubController');
const auth = require('../middleware/authMiddleware');
const { searchQueryValidatorSchema, userRepoValidatorSchema } = require('./schemaValidation/searchSchema');

const searchQueryValidator = checkSchema(searchQueryValidatorSchema);
const userQueryValidator = checkSchema(userRepoValidatorSchema);
router.get('/search/:type', auth, searchQueryValidator, searchRepos);
router.get('/user/:username', auth, userQueryValidator, userRepository);

module.exports = router;
