
const appPackage = require('../package.json');
const mongoose = require('mongoose');
const { MONGO_DATABASE_NAME, MONGO_URI } = require('../config');

const connectDB = () => {
  mongoose.connect(MONGO_URI, {
    dbName: MONGO_DATABASE_NAME
  }).then(() => console.log.bind(console, `${appPackage.name} database connection achieved`)())
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
};

module.exports = connectDB;