const axios = require('axios');
const { validationResult } = require('express-validator');
const Bookmark = require('../dbadaptor/dbmodels/Bookmark');
const { GIT_TOKEN } = require('../config');

const axiosConfig = {
  headers: { Authorization: `Bearer ${GIT_TOKEN}` }
};
const getBookMarkedRepo = (responseData, userId)=> {
  return new Promise((resolve) => {
    const repoUrls = responseData.reduce((accum, data) => {
      if (accum.type !== 'User') {
        accum.push(data.html_url);
      }
      return accum;
    }, []);
    let bookMarkedRepo = {};
    if (repoUrls.length) {
      const bookMarkFilter = {
        repoUrl: {
          $in: repoUrls
        },
        user: userId
      };
      Bookmark.find(bookMarkFilter).then((result) => {
        bookMarkedRepo = result.reduce((accum, data) => {
          accum[data.repoUrl] = data.id;
          return accum;
        }, {});
      }).catch((err) => {
        console.error('Error while fetching bookmark data', err);
      }).finally(() => {
        resolve(bookMarkedRepo);
      });
    }
  });
};
exports.searchRepos = async (req, res) => {
  const { type } = req.params;
  const { query, skip = 0, top = 50 } = req.query;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await axios.get(`https://api.github.com/search/${type}?q=${query || undefined}&sort=name&order=asc&page=${skip}&per_page=${top}`, axiosConfig);
    const bookMarkedRepos = await getBookMarkedRepo(response.data.items, req.user.id);
    const responseData = response.data.items.map(({ login, id, full_name: repoName, html_url: repoUrl, owner }) => {
      const { login: ownerLogin } = owner || {};
      const bookMarkId = bookMarkedRepos[repoUrl];
      return {
        username: login || ownerLogin,
        id,
        repoName,
        repoUrl,
        bookMarked: !!bookMarkedRepos[repoUrl],
        bookMarkId
      };});
    res.json({
      count: response.data.total_count,
      items: responseData
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

exports.userRepository = async (req, res) => {
  const { username } = req.params;
  const { skip = 0, top = 50 } = req.query;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await axios.get(`https://api.github.com/users/${username}/repos?sort=name&order=asc&page=${skip}&per_page=${top}`, axiosConfig);
    const bookMarkedRepos = await getBookMarkedRepo(response.data, req.user.id);
    const responseData = response.data.map(({ id, full_name: repoName, html_url: repoUrl }) => {
      const bookMarkId = bookMarkedRepos[repoUrl];
      return {
        username,
        id,
        repoName,
        repoUrl,
        bookMarked: !!bookMarkedRepos[repoUrl],
        bookMarkId
      };});
    res.json({
      count: 100,
      items: responseData
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};
