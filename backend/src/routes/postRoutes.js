const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validateRequest } = require("../middlewares");
const { createPostDTO, updatePostDTO } = require("../dto");

router.get('/getAllPosts', postController.getAllPosts);
router.get('/getSinglePost/:postId', postController.getSinglePost);
router.post('/create', createPostDTO, validateRequest, postController.createPost);
router.post('/bulk-create', postController.bulkUploadPosts);
router.patch('/update', updatePostDTO, validateRequest, postController.updatePost);
router.delete('/delete/:postId', postController.deletePost);

module.exports = router;
