const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  username: { type: String, required: true },
  avatar_url: { type: String, default: '' },
  content: { type: String, required: true },
  parent_comment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  is_edited: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
