const axios = require('axios');

exports.searchRepos = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
    res.json(response.data.items);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};
