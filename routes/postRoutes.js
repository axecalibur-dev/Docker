const express = require("express");
const postController = require("../controllers/postController");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
router.route("/").get(postController.getAll).post(postController.createPost);
router
  .route("/:id")
  .get(postController.getOnePost)
  .patch(postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
