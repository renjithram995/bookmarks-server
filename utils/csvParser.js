const csv = require('csv-parser');
const fs = require('fs');

const parseCSV = (filePath, callback) => {
  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      callback(null, results);
    })
    .on('error', (err) => {
      callback(err, null);
    });
};

module.exports = parseCSV;
