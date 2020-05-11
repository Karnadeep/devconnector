const express = require("express");
const router = express();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route Post api/post/
// @desc  Add a Post
// @access Private
router.post(
  "/",
  [auth, [check("text", "Text field is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const text = req.body.text;
      const newPost = {};
      newPost.text = text;
      newPost.user = req.user.id;
      newPost.name = user.name;
      newPost.avatar = user.avatar;

      const createPost = new Post(newPost);
      const createdPost = await createPost.save();
      res.json(createdPost);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

// @route GET api/post/
// @desc  Get all Posts
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    if (!posts) {
      return res.status(400).json({ msg: "No Posts" });
    }
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/post/:id
// @desc  Get Post by id
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post is not present" });
    }

    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Post is not present" });
    }
    res.status(500).send("Server Error");
  }
});

// @route Delete api/post/:id
// @desc  Delete Post by id
// @access Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post is not present" });
    }

    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ msg: "Not authenicated to delete the post" });
    }
    await post.remove();
    res.status(200).send("Post deleted");
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Post is not present" });
    }
    res.status(500).send("Server Error");
  }
});

// @route Put api/posts/like/:id
// @desc  Add like on a post by id
// @access Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post is already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serer Error");
  }
});

// @route Delete api/post/likes/:id
// @desc  Delete like on a post by id
// @access Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length ==
      0
    ) {
      return res.status(400).json({ msg: "Post is not liked" });
    }

    const removeIndex = post.likes
      .map((like) => like.user)
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Serer Error");
  }
});

// @route Post api/post/comments/:id
// @desc  Add a Comment to a Post
// @access Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text Field is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post does not exists" });
      }
      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route Post api/post/comment/:id/:comment_id
// @desc  Delete a Comment from a Post
// @access Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post does not exists" });
    }
    //pull the comment from comments array
    const comment = post.comments.find(
      (comment) => comment.id == req.params.comment_id
    );

    //check if the comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //check if the comment is getting deleted by the one who created it
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    const removeIndex = post.comments
      .filter((comment) => comment.user.toString() == req.user.id)
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
