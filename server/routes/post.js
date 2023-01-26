const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const requireLogin = require("../middleware/requireLogin");

router.get("/allpost", requireLogin, async (req, res) => {
  const posts = await Post.find().populate("postedBy","_id username")
  .populate("comments.postedBy","_id username")
  .sort('-createdAt')

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

router.put('/like', requireLogin, (req,res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {likes: req.user._id}
  },{
    new:true,
  }).exec((err, result) =>{
    if(err){
      return res.status(422).json({error: err})
    }else{
      res.json(result);
    }
  })
})

router.put('/unlike', requireLogin, (req,res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {likes: req.user._id}
  },{
    new:true,
  })
  .exec((err, result) =>{
    if(err){
      return res.status(422).json({error: err})
    }else{
      res.json(result);
    }
  })
})


router.put('/comment', requireLogin, (req,res) => {
  const comment ={
    text: req.body.text,
    postedBy: req.user._id,
  }

  Post.findByIdAndUpdate(req.body.postId, {
    $push: {comments: comment}
  },{
    new:true,
  })
  .populate("comments.postedBy","_id username")
    .populate("postedBy","_id username")
    .exec((err, result) =>{
    if(err){
      return res.status(422).json({error: err})
    }else{
      return res.status(201).json({ message: "The post created successfully", result });
    }
  })
})

module.exports = router;
