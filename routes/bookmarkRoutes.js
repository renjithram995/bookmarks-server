const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { importBookmarks, addBookmark, getBookmarks, removeBookmarks } = require('../controllers/bookmarkController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createBookMarkSchema, removeBookMarkSchema } = require('./schemaValidation/bookmarkSchema');

const createBookMarkValidatorSchema = checkSchema(createBookMarkSchema);
const removeBookMarkValidatorSchema = checkSchema(removeBookMarkSchema);

router.post('/import', auth, upload, importBookmarks);
router.post('/bookmark', auth, createBookMarkValidatorSchema, addBookmark);
router.get('/bookmarks', auth, getBookmarks);
router.delete('/bookmark/:id', auth, removeBookMarkValidatorSchema, removeBookmarks);

module.exports = router;
