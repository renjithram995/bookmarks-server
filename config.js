module.exports = {
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
    MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME || 'GHBookmark',
    JWT_SECRET: process.env.JWT_SECRET || 'renjith@Bookmarks-server987',
    PORT: process.env.PORT || 5000,
    JWT_EXPIRY: '2h'
}