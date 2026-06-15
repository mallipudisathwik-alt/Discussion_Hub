const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

exports.getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await Comment.find({ post_id: postId, parent_comment_id: null })
      .populate('replies')
      .sort({ created_at: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const postId = parseInt(req.params.postId);
    const { content } = req.body;
    const comment = new Comment({
      post_id: postId,
      user_id: req.user.userId,
      username: req.user.sub,
      content,
      avatar_url: req.body.avatar_url || ''
    });
    await comment.save();

    try {
      await ActivityLog.create({
        user_id: req.user.userId,
        action: 'COMMENTED',
        target_type: 'post',
        target_id: String(postId),
        metadata: { comment_id: comment._id }
      });
    } catch (logErr) {
      console.warn('Failed to log activity:', logErr.message);
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    comment.content = req.body.content;
    comment.is_edited = true;
    comment.updated_at = new Date();
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.user_id !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Comment.deleteMany({ parent_comment_id: comment._id });
    await Comment.findByIdAndDelete(comment._id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.replyToComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const parent = await Comment.findById(req.params.commentId);
    if (!parent) return res.status(404).json({ error: 'Parent comment not found' });
    const reply = new Comment({
      post_id: parent.post_id,
      user_id: req.user.userId,
      username: req.user.sub,
      content: req.body.content,
      avatar_url: req.body.avatar_url || '',
      parent_comment_id: parent._id
    });
    await reply.save();
    parent.replies.push(reply._id);
    await parent.save();

    try {
      await ActivityLog.create({
        user_id: req.user.userId,
        action: 'COMMENTED',
        target_type: 'comment',
        target_id: String(parent._id),
        metadata: { reply_id: reply._id }
      });
    } catch (logErr) {
      console.warn('Failed to log activity:', logErr.message);
    }

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    comment.upvotes += 1;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
