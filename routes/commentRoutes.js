const express = require('express');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/games/:gameId/comments', authMiddleware, commentController.getComments);
router.post('/games/:gameId/comments', authMiddleware, commentController.addCommentToGame);

module.exports = router;