const axios = require('axios');
const { Posts } = require('../models');
const { siteUrl } = require('../config/env'); // Import siteUrl from env.js
const { getWordPressAuthToken } = require('../utils/wordpressAuth'); // Import auth token

const authHeader = {
  Authorization: getWordPressAuthToken(),
  'Content-Type': 'application/json',
};

const getAllWordPressPosts = async (queryParams = {}) => {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await axios.get(`${siteUrl}/wp-json/wp/v2/posts?${queryString}`, { headers: authHeader });
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const getWordPressPost = async postId => {
  try {
    const response = await axios.get(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, { headers: authHeader });
    const postData = await Posts.findOne({ where: { postId } });
    const data = {
      ...response.data,
      postData
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createWordPressPost = async postData => {
  try {
    const data = {
      title : postData.postTitle,
      slug : postData.postSlug,
      content : postData.postContent,
      status : postData.status
    }
    const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, data, { headers: authHeader });
    if(response?.data){
      await Posts.create({
        postId : response.data.id,
        postTitle : postData.postTitle,
        postContent : postData.postContent,
        postFields : postData.postFields,
        name : postData.name,
        phoneNumber : postData.phoneNumber,
        postSlug : response.data.slug,
        status : postData.status,
        isSync : false
      });
    }else{
      await Posts.create({
        postTitle : postData.postTitle,
        postContent : postData.postContent,
        postFields : postData.postFields,
        name : postData.name,
        phoneNumber : postData.phoneNumber,
        postSlug : postData.postSlug,
        status : postData.status,
        isSync : true
      });
    }
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

const updateWordPressPost = async (postId, updateData) => {
  try {
    const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, updateData, { headers: authHeader });
    if(response.data){
      const data = {
        postTitle : updateData.title,
        postSlug : response.data.slug,
        postContent : updateData.content,
        status : updateData.status,
        name : updateData.name,
        phoneNumber : updateData.phoneNumber,
        postFields : updateData.postFields
      }
      await Posts.update(data, {
        where: { postId: postId },
      });    
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteWordPressPost = async postId => {
  try {
    const response = await axios.delete(`${siteUrl}/wp-json/wp/v2/posts/${postId}`, { headers: authHeader });
    if(response.data){
      await Posts.destroy({
        where: { postId: postId },
      });    
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const syncWordPressPosts = async () => {
  try {
    // Fetch only posts that need syncing
    const posts = await Posts.findAll({ where: { isSync: true } });

    await Promise.all(
      posts.map(async (post) => {
        try {
          const data = {
            title: post.postTitle,
            slug: post.postSlug,
            content: post.postContent,
            status: post.status,
          };

          const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, data, {
            headers: authHeader,
          });

          if (response.status === 201 && response.data) {
            await Posts.update(
              { isSync: false },
              { where: { id: post.id } }
            );
            console.log(`✅ Post Synced: ${post.postTitle}`);
          }
        } catch (error) {
          console.error(`❌ Failed to sync post: ${post.postTitle}`, error.message);
        }
      })
    );

    console.log("✅ WordPress Sync Completed.");
  } catch (error) {
    console.error("❌ Error in syncing posts:", error);
  }
};

const bulkUploadWordPressPosts = async (postsData) => {
  try {
    const results = await Promise.allSettled(
      postsData.map(async (postData) => {
        try {
          const data = {
            title: postData.postTitle,
            slug: postData.postSlug,
            content: postData.postContent,
            status: postData.status,
          };

          const response = await axios.post(`${siteUrl}/wp-json/wp/v2/posts`, data, { headers: authHeader });

          if (response?.data) {
            await Posts.create({
              postId: response.data.id,
              postTitle: postData.postTitle,
              postContent: postData.postContent,
              postFields: postData.postFields,
              name: postData.name,
              phoneNumber: postData.phoneNumber,
              postSlug: response.data.slug,
              status: postData.status,
              isSync: false,
            });
            return { success: true, postTitle: postData.postTitle };
          }
        } catch (error) {
          console.error(`Failed to upload post: ${postData.postTitle}`, error.message);
          return { success: false, postTitle: postData.postTitle, error: error.message };
        }
      })
    );

    const successfulUploads = results.filter(result => result.status === 'fulfilled' && result.value.success);
    const failedUploads = results.filter(result => result.status === 'fulfilled' && !result.value.success);

    console.log(`${successfulUploads.length} posts uploaded successfully.`);
    if (failedUploads.length > 0) {
      console.error(`${failedUploads.length} posts failed to upload.`);
    }

    return { successfulUploads, failedUploads };
  } catch (error) {
    console.error("Error in bulk uploading posts:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  getAllWordPressPosts,
  getWordPressPost,
  createWordPressPost,
  updateWordPressPost,
  deleteWordPressPost,
  syncWordPressPosts,
  bulkUploadWordPressPosts
};
