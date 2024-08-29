const mongoose = require('mongoose');
const User = require('../dbadaptor/dbmodels/User');
const Bookmark = require('../dbadaptor/dbmodels/Bookmark');
const { MONGO_DATABASE_NAME, MONGO_URI } = require('../config');

module.exports = {
  async up() {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DATABASE_NAME
    });
    // Ensure the schema is created by inserting a document (MongoDB does not create collections without data)
    await User.create({
      username: 'octocat',
      email: 'admin@github.com',
      password: 'admin123',
    });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Bookmark.collection.createIndex({ user: 1 });
    await Bookmark.collection.createIndex({ user: 1, repoUrl: 1 }, { unique: true });

    await mongoose.disconnect();
  },

  async down() {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DATABASE_NAME
    });
    
    await User.collection.drop();
    await Bookmark.collection.drop();

    await mongoose.disconnect();
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
