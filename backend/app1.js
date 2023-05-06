const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();
mongoose.connect("mongodb+srv://rzzza:" + process.env.MONGO_ATLAS_PW + "@cluster0.pyyeazx.mongodb.net/test?retryWrites=true&w=majority")
  .then(() => {
    console.log('connected to db');
  })
  .catch(() => {
    console.log('Connection fail');
  })

app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);

module.exports = app;