const postService = require('../services/postService');

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllWordPressPosts(req.query);
    res.json({ status: 1, message: 'Success', data: posts });
  } catch (error) {
    console.log(error)
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

const createPost = async (req, res) => {
  try {
    const newPost = await postService.createWordPressPost(req.body);
    res.json({ status: 1, message: 'Post created successfully', data: newPost });
  } catch (error) {
    console.log(error);
    res.json({ status: 0, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId, postTitle, postContent, postSlug, status } = req.body;
    const updateData = {
      title : postTitle,
      slug : postSlug,
      content : postContent,
      status : status
    }
    const updatedPost = await postService.updateWordPressPost(postId, updateData);
    res.json({ status: 1, message: 'Post updated successfully', data: updatedPost });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await postService.deleteWordPressPost(req.params.postId);
    res.json({ status: 1, message: 'Post deleted successfully', data: deletedPost });
  } catch (error) {
    res.json({ status: 0, message: error.message });
  }
};

const bulkUploadPosts = async (req, res) => {
  try {
    const { posts } = req.body; // expecting an array of posts
    const results = await postService.bulkUploadWordPressPosts(posts);
    res.json({ status: 1, message: 'Bulk upload completed', data: results });
  } catch (error) {
    console.log(error);
    res.json({ status: 0, message: error.message });
  }
};

module.exports = {
  getAllPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  bulkUploadPosts
};
