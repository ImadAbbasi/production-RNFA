const express = require("express");
const { requireSignIn } = require("../controllers/userController");
const {
  createPostController,
  getAllPostsController,
  getUserPostsController,
  deletePostController,
  updatePostController,
} = require("../controllers/postController");

// ROUTER OBJECT
const router = express.Router();

// ROUTES
// CREATE POST || POST
router.post("/create-post", requireSignIn, createPostController);

// GET ALL POSTs || GET
router.get("/get-all-posts", getAllPostsController);

// GET USER POSTs || GET
router.get("/get-user-posts", requireSignIn, getUserPostsController);

// DELETE POST || DELETE
router.delete("/delete-post/:id", requireSignIn, deletePostController);

// UPDATE POST || PUT
router.put("/update-post/:id", requireSignIn, updatePostController);

// EXPORT
module.exports = router;
