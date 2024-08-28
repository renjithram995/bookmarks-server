const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoName: { type: String, required: true },
  repoUrl: { type: String, required: true },
  dateBookmarked: { type: Date, default: Date.now },
},{
  versionKey: false,
  timestamps: { createdAt: 'creation_date', updatedAt: 'modification_date' }
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
