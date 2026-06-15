const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:postId', commentController.getComments);
router.post('/:postId', authMiddleware, [body('content').notEmpty()], commentController.addComment);
router.put('/:commentId', authMiddleware, [body('content').notEmpty()], commentController.editComment);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
router.post('/:commentId/reply', authMiddleware, [body('content').notEmpty()], commentController.replyToComment);
router.post('/:commentId/upvote', authMiddleware, commentController.upvoteComment);

module.exports = router;
