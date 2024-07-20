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

router.post("/login", async (req, res, next) => {
  let fetchUser;
  fetchUser = await User.findOne({email: req.body.email});
  if(!fetchUser) {
    return res.status(401).json ({
      message: 'Invalid authentication credentials!'
    });
  }
  let isPasswordMatched;
  try {
    isPasswordMatched = await bcrypt.compare(req.body.password, fetchUser.password);
  } catch(err) {
    console.log("password not matched!!!");
  }
  if(!isPasswordMatched) {
    return res.status(401).json ({
      message: 'Invalid authentication credentials!'
    });
  }
  const ss_key = "";
  const token = jwt.sign({email: fetchUser.email, userId: fetchUser._id }, ss_key, { expiresIn: '1h' });

  return res.status(200).json({
    token: token,
    expiresIn: 3600,
    userId: fetchUser._id
  });
})

module.exports = router;