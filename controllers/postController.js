const postModel = require("../models/postModel");

// CREATE POST
const createPostController = async (req, res) => {
  try {
    const { title, description } = req.body;

    // VALIDATE
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Title And Description Both Are Required!",
      });
    }

    const post = await postModel({
      title,
      description,
      postedBy: req.auth._id,
    }).save();

    res.status(201).send({
      success: true,
      message: "Post Created Successfully!",
      post,
    });
    console.log(req);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Create Post API",
      error,
    });
  }
};

// GET ALL POSTs
const getAllPostsController = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("postedBy", "_id name")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All Posts Data",
      posts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In GET ALL POSTS API.",
      error,
    });
  }
};

// GET USER POSTs
const getUserPostsController = async (req, res) => {
  try {
    const userPosts = await postModel.find({ postedBy: req.auth._id });

    res.status(200).send({
      success: true,
      message: "User Posts Data",
      userPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In GET USER POSTS API.",
      error,
    });
  }
};

const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    await postModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Post Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in DELETE POST API",
      error,
    });
  }
};

const updatePostController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;

    // FIND POST IN DB
    const post = await postModel.findById({ _id: id });

    // VALIDATION
    if (!title || !description) {
      return res.status(500).send({
        success: false,
        message: "Please provide title or description",
      });
    }

    const updatedPost = await postModel.findByIdAndUpdate(
      { _id: id },
      {
        title: title || post?.title,
        description: description || post?.description,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Post Updated Successfully!",
      updatedPost,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in UPDATE POST API",
      error,
    });
  }
};

module.exports = {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
};
