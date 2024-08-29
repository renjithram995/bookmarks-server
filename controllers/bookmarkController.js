const { validationResult } = require('express-validator');
const axios = require('axios');
const mongoose = require('mongoose');
const { GIT_TOKEN } = require('../config');

const axiosConfig = {
  headers: { Authorization: `Bearer ${GIT_TOKEN}` }
};
const Bookmark = require('../dbadaptor/dbmodels/Bookmark');
const { processSmallCSV, processLargeCSV } = require('../utils/csvParser');

const FILE_SIZE_THRESHOLD = 5 * 1024 * 1024; // 5 MB threshold

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
    const responseData = bookmarks.map(({ id: bookMarkId, repoName, repoUrl, dateBookmarked }) => {
      return {
        repoName,
        repoUrl,
        bookMarked: true,
        dateBookmarked,
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

const validateAndSaveBookMarks = async (bookMarks, userId) => {

  try {
    const promiseAll = [];
    let validBookmarks = bookMarks.reduce((accum, { repoName, repoUrl }) => {
      const isDuplicate = accum.find((e) => e.repoUrl === repoUrl);
      if (repoName && repoUrl && repoUrl.toLowerCase() && !isDuplicate) { // repo name should be included in repoUrl
        promiseAll.push(validateRepository(repoUrl));
        accum.push({ repoName, repoUrl });
      }
      return accum;
    }, []
    );
  
    if (promiseAll.length) {
      const promiseResult = await Promise.allSettled(promiseAll);
      console.log(promiseResult);
      promiseResult.forEach(({ status, value }, idx) => {
        if (status !== 'fulfilled' || !value) {
          validBookmarks.splice(idx, 1);
        }
      });
      const duplicateBookMarkFilter = {
        '$and': [{
          'repoUrl': {
            '$in': validBookmarks.map(({repoUrl}) => repoUrl)
          }
        },
        {
          user: new mongoose.Types.ObjectId(userId)
        }]
      };
      const duplicateBookMarks = await Bookmark.find(duplicateBookMarkFilter);
      console.log(duplicateBookMarkFilter, duplicateBookMarks);
      validBookmarks = validBookmarks.filter(({ repoUrl }) => !duplicateBookMarks.find((e) => e.repoUrl === repoUrl));
    }
  
    // Save bookmarks
    const bookmarks = validBookmarks.map(item => ({
      user: userId,
      repoName: item.repoName,
      repoUrl: item.repoUrl,
    }));
  
    if (bookmarks.length) {
      await Bookmark.insertMany(bookmarks); // ToDo: Need to make as a transaction
    }
    return { succeeded: validBookmarks.length, rejected: bookMarks.length - validBookmarks.length };
  } catch (error) {
    console.log('Error on validateAndSaveBookMarks', error);
    throw error;
  }
};

const importBookmarks = async (req, res) => {
  const { path: filePath, size: fileSize } = req.file || {};

  const fileProcessing = fileSize > FILE_SIZE_THRESHOLD ?
    processLargeCSV(filePath, req.user.id, validateAndSaveBookMarks) :
    processSmallCSV(filePath, req.user.id, validateAndSaveBookMarks);
  fileProcessing.then(({ succeeded = 0, rejected = 0 }) => {
    res.json({ msg: `Bookmarks imported successfully. ${succeeded} rows completed and ${rejected} rows rejected` });
  }).catch((err) => {
    console.log('Error while file processing', err);
    res.status(500).json({ msg: 'Server error' });
  });
};

const validateRepository = (repoUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const urlParts = repoUrl.split('/');
      const userName = urlParts[urlParts.length - 2];
      const repoName = urlParts[urlParts.length - 1];
      const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
      axios.get(apiUrl, axiosConfig).then(({ data }) => {
        resolve(!!data);
      }).catch(() => {
        resolve(false);
      });
    } catch {
      reject('Invalid Repository');
    }
  }); 
};

const aggregateBookmarkData = (req, res) => {
  try {
    Bookmark.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateBookmarked' } },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]).then((result) => {
      console.log(result);
      return res.json(result);
    }).catch((err) => {
      console.log('Error while fetching aggregate data', err);
      return res.status(400).json({ errors: err.message || err });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

// const bookmarkBulkInsert = (req, res) => {

// }


module.exports = { addBookmark, importBookmarks, getBookmarks, removeBookmarks, aggregateBookmarkData };
