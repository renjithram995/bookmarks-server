const Bookmark = require('../dbadaptor/dbmodels/Bookmark');
const parseCSV = require('../utils/csvParser');

const addBookmark = async (req, res) => {
  const { repoName, repoUrl } = req.body;
  try {
    let bookmark = new Bookmark({
      user: req.user.id,
      repoName,
      repoUrl,
    });
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};


const removeBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.deleteOne({ user: req.user.id, repoUrl: req.repoUrl });
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


module.exports = { addBookmark, importBookmarks, getBookmarks, removeBookmarks };
