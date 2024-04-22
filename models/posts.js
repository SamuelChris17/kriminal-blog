const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  readCount: { type: Number, default: 0 },
  readingTime: { type: Number },
  body: { type: String, required: true },
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
