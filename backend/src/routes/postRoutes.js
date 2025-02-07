const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/getAllPosts', postController.getAllPosts);
router.get('/getSinglePost/:postId', postController.getSinglePost);
router.post('/search', postController.searchPosts);
router.post('/create', postController.createPost);
router.post('/update', postController.updatePost);
router.post('/delete', postController.deletePost);

module.exports = router;
