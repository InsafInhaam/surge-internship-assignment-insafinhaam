const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/allpost", requireLogin, async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .sort("-createdAt");

  try {
    res.status(201).json(posts);
  } catch (error) {
    res.status(422).json({
      error: error,
    });
  }
});

router.get("/getPostById/:id", requireLogin, async (req, res) => {
  const posts = await Post.find({ postedBy: req.params.id })
    .populate("postedBy", "_id username")
    .populate("comments.postedBy", "_id username")
    .sort("-createdAt");

  try {
    res.status(201).json(posts);
  } catch (error) {
    res.status(422).json({
      error: error,
    });
  }
});

router.post("/createpost", requireLogin, async (req, res) => {
  const { title, body, photoUrl } = req.body;
  if (!title || !body || !photoUrl) {
    res.status(422).json({ error: "Please add all the fields" });
  }
  req.user.password = undefined;

  const post = new Post({ title, body, photo: photoUrl, postedBy: req.user });

  try {
    const newpost = await post.save();
    res.status(201).json({ message: "The post created successfully", newpost });
  } catch (error) {
    res.status(422).json({
      error: error,
    });
  }
});

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id username")
    .populate("postedBy", "_id username")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ error: err });
      } else {
        res.status(201).json({ result, message: "Successfully commented!" });
      }
    });
});

router.delete("/deletepost/:id", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(201).json({ result, message: "Successfully deleted" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

router.delete("/deletecomment/:id", requireLogin, async (req, res) => {
  Post.findOne({ "comments._id": req.params.id })
    .populate("postedBy", "_id")
    .populate("comments.postedBy", "_id username")
    .exec((err, post) => {
      if (err || !post) {
        res.status(422).json({ error: err });
      }
      const commentToDelete = post.comments.find(
        (comment) => comment._id.toString() === req.params.id.toString()
      );

      if (commentToDelete) {
        if (
          commentToDelete.postedBy._id.toString() === req.user._id.toString()
        ) {
          post.comments.pull(commentToDelete);
          post.save((err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.status(201).json({ result, message: "Comment deleted!" });
            }
          });
        }
      }
    });
});

module.exports = router;
