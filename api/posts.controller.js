import PostsDAO from "../dao/postsdao.js";

export default class PostsController {
  // Get all posts
  static async apiGetPosts(req, res, next) {
    const postsPerPage = req.query.postsPerPage
      ? parseInt(req.query.postsPerPage, 10)
      : 20;
    const page = req.query.page ? parseInt(req.query.page, 10) : 0;

    let filters = {};
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine;
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode;
    } else if (req.query.name) {
      filters.name = req.query.name;
    }

    const postsList = await PostsDAO.getPosts({
      filters,
      page,
      postsPerPage,
    });

    let response = {
      posts: postsList,
      page: page,
      filters: filters,
      entries_per_page: postsPerPage,
      // total_results: totalNumPosts,
    };
    res.json(postsList);
  }

  // Create new Post
  static async apiNewPost(req, res) {
    let obj = {
      title: "This is title Number 1",
      description: "Description Goes Here",
      category: "Leetcode",
      tags: ["Arrays"]
    };
    try {
      const post = await PostsDAO.createNewPost(obj);
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  static async apiGetPostById(req, res) {
    try {
      const post = await PostsDAO.getPostByID(req.query.post_id);
      res.status(200).json(post);
    } catch (e) {
      console.log(e.message);
      res.status(500).json(e);
    }
  }

  static async apiGetCategories(req, res) {
    try {
      const categories = await PostsDAO.getCategories();
      res.status(200).json(categories);
    } catch (e) {
      console.log(e.message);
      res.status(500).json(e);
    }
  }

  static async apiGetTags(req, res) {
    try {
      const tags = await PostsDAO.getTags();
      res.status(200).json(tags);
    } catch (e) {
      console.log(e.message);
      res.status(500).json(e);
    }
  }

  static async apiUpdatePost(req, res) {
    try {
      const postUpdateResponse = await PostsDAO.updatePostById(req);
      res.status(200).json({
        status: "Post Updated Successfully",
        data: postUpdateResponse,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiPublishPost(req, res) {
    try {
      const post_publish_response = await PostsDAO.publishPost(
        req.body.post_id,
        req.body.flag
      );
      res.status(200).json({
        status: "Post published Successfully",
        data: post_publish_response,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeletePost(req, res) {
    try {
      const deletePost = await PostsDAO.deletePostById(req.body.post_id);
      res.status(200).json({
        status: "Post Deleted Successfully",
        data: deletePost,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiUploadCover(req, res) {
    try {
      const image_upload = await PostsDAO.uploadCover(req);
      res.status(200).json(image_upload);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  }
}
