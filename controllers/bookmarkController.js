const { validationResult } = require('express-validator');
const axios = require('axios');

const Bookmark = require('../dbadaptor/dbmodels/Bookmark');
const parseCSV = require('../utils/csvParser');

const addBookmark = async (req, res) => {
  const { repoName, repoUrl } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const validateRepo = await validateRepository(repoUrl);
    if (!validateRepo) {
      return res.status(400).json({ error: 'Invalid Repository' });
    }
    let bookmark = new Bookmark({
      user: req.user.id,
      repoName,
      repoUrl,
    });
    const result = await bookmark.save();
    res.json({
      id: result.id
    });
  } catch (err) {
    console.log(err);
    return err.code === 11000 ? res.status(400).json({ msg: 'Repository is already bookmarked' }) : res.status(500).send('Server error');
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    const responseData = bookmarks.map(({ id: bookMarkId, repoName, repoUrl }) => {
      return {
        repoName,
        repoUrl,
        bookMarked: true,
        bookMarkId
      };});
    res.json(responseData);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


const removeBookmarks = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const bookMarkFilter = { _id };
    const bookmarks = await Bookmark.deleteOne(bookMarkFilter);
    res.json(bookmarks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


const importBookmarks = async (req, res) => {
  const filePath = req.file.path;

  parseCSV(filePath, async (err, data) => {
    if (err) {
      return res.status(500).json({ msg: 'Error parsing CSV file' });
    }

    try {
      const validBookmarks = data.filter(item => item.repoName && item.repoUrl);

      // Save bookmarks
      const bookmarks = validBookmarks.map(item => ({
        user: req.user.id,
        repoName: item.repoName,
        repoUrl: item.repoUrl,
      }));

      await Bookmark.insertMany(bookmarks);

      res.json({ msg: 'Bookmarks imported successfully', bookmarks });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: 'Server error' });
    }
  });
};

const validateRepository = (repoUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const urlParts = repoUrl.split('/');
      const userName = urlParts[urlParts.length - 2];
      const repoName = urlParts[urlParts.length - 1];
      const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
      axios.get(apiUrl).then(({ data }) => {
        resolve(!!data);
      }).catch(() => {
        resolve(false);
      });
    } catch () {
      reject('Invalid Repository');
    }
  }); 
};


module.exports = { addBookmark, importBookmarks, getBookmarks, removeBookmarks };
