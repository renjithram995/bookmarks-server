const express = require('express');
const router = express.Router();
const { importBookmarks, addBookmark, getBookmarks, removeBookmarks } = require('../controllers/bookmarkController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/import', auth, upload, importBookmarks);
router.post('/bookmark', auth, addBookmark);
router.get('/bookmarks', auth, getBookmarks);
router.delete('/bookmark', auth, removeBookmarks);

module.exports = router;
