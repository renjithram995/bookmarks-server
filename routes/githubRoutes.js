const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { searchRepos } = require('../controllers/githubController');
const auth = require('../middleware/authMiddleware');
const { searchQueryValidatorSchema } = require('./schemaValidation/searchSchema')

const queryValidatorSchema = checkSchema(searchQueryValidatorSchema)
router.get('/search/:type', auth, queryValidatorSchema, searchRepos);

module.exports = router;
