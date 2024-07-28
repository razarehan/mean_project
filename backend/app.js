const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();
console.log("REHAN", process.env.MONGOOSE_PASSWORD);
mongoose.connect("mongodb+srv://rzzza_123:" + process.env.MONGOOSE_PASSWORD + "@cluster0.l1empog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
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