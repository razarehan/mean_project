const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

const router = express.Router();

router.post("/singup", (req, res, next) => {
  bcrypt.hash(req.body.password, 8)
    .then((hash) => {
      const user = new User({email: req.body.email, password: hash});
      user.save()
        .then(result => {
          res.status(201).json({
           message: 'User Created' ,
           result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Invalid authentication creadentials!"
          })
        });
    })
})

router.post("/login", (req, res, next) => {
  let fetchUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        return res.status(401).json ({
          message: 'Invalid authentication credentials!'
        });
      }
      fetchUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json ({
          message: 'Invalid authentication credentials!'
        });
      }
      const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id}, process.env.JWT_KEY,
        {expiresIn: '1h'});

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchUser._id
      })
    })
    .catch(err => {
      return res.status(401).json ({
        message: 'Invalid authentication credentials!'
      });
    });
})

module.exports = router;