const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllWordPressPosts(req.query);
    res.json({ status: 1, message: 'Success', data: posts });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await postService.getWordPressPost(req.params.postId);
    res.json({ status: 1, message: 'Success', data: post });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const searchPosts = async (req, res) => {
  try {
    const searchResults = await postService.searchWordPressPosts(req.body);
    res.json({ status: 1, message: 'Success', data: searchResults });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = await postService.createWordPressPost(req.body);
    res.json({ status: 1, message: 'Post created successfully', data: newPost });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId, updateData } = req.body;
    const updatedPost = await postService.updateWordPressPost(postId, updateData);
    res.json({ status: 1, message: 'Post updated successfully', data: updatedPost });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await postService.deleteWordPressPost(req.body.postId);
    res.json({ status: 1, message: 'Post deleted successfully', data: deletedPost });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
};
