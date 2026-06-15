const mongoose = require('mongoose');

const discussionEmbeddingSchema = new mongoose.Schema({
  post_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  content_snippet: { type: String, required: true },
  category: { type: String, default: '' },
  tags: [{ type: String }],
  embedding: { type: [Number], required: true },
  created_at: { type: Date, default: Date.now }
});

discussionEmbeddingSchema.index({ embedding: 1 });

module.exports = mongoose.model('DiscussionEmbedding', discussionEmbeddingSchema);
