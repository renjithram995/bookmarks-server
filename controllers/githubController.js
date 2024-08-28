const axios = require('axios');
const { validationResult } = require('express-validator');

exports.searchRepos = async (req, res) => {
  const { type } = req.params;
  const { query, skip = 0, top = 50 } = req.query;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const response = await axios.get(`https://api.github.com/search/${type}?q=${query || undefined}&sort=name&order=asc&page=${skip}&per_page=${top}`);
    const responseData = response.data.items.map(({ login, id, full_name: repo, owner }) => {
      const { login: ownerLogin } = owner || {}
      return {
      username: login || ownerLogin,
      id,
      repo,

    }})
    res.json({
      count: response.data.total_count,
      items: responseData
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};
