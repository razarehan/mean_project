const express = require('express');

const router = express.Router();

const Post = require('../models/post');
const checkAuth = require('../middleware/auth');

router.post('', checkAuth, (req, res, next)=> {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imgUrl: req.body.imgUrl,
    creator: req.userData.userId,
    createdAt: req.body.createdAt
  })
  post.save().then(createdPost=> {
    res.status(201).json({
      message: 'Post added successfully',
      post: createdPost
    });  
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
  
});

router.get('', (req, res, next) => {
  Post.find().then((documents) => {
    res.status(200).json(
      {
        message: 'posts fetched successfully!',
        posts: documents
      }
    );
  }).catch(error=> {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById({_id: req.params.id})
   .then(post => {
    if(post) {
      res.status(200).json ({
        message: 'post fetch successfully',
        post:post
      })
    }
    else {
      res.status(404).json({
        message: 'post not found',
        post:null
      })
    }
   }).catch(error=> {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
});

router.put('/:id', checkAuth, (req, res, next) => {
  const post = new Post(
    {
      _id: req.body.id,
      title: req.body.title, 
      content: req.body.content,
      imgUrl: req.body.imgUrl,
      creator: req.userData.userId,
      createdAt: req.userData.createdAt
    });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
    .then((document) => {
      if (document.matchedCount > 0) {
        res.status(200).json({
          message: 'post updated successfully!',
          post: document
        })
      } else {
        res.status(401).json({
          message: 'Not authorized!',
          post: document
        })
      }
    })
    .catch(error=> {
      res.status(500).json({
        message: "Couldn't update post!"
      })
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId})
    .then((document) => {
      if (document.deletedCount > 0) {
        res.status(200).json ({
          message: 'posts deleted successfully!',
          post: document
        })
      } else {
        res.status(401).json ({
          message: 'Not authorized!!',
          post: document
        })
      }
      
    })
});

module.exports = router