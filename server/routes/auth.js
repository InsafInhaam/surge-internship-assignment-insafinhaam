const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetch = require('node-fetch');
const { stringify } = require('querystring');

router.post("/signin", async (req, res) => {
  const { username, email, password } = req.body;

  let user;

  if (username) {
    user = await User.findOne({ username });
  } else if (email) {
    user = await User.findOne({ email });
  }
  if (!user) {
    return res.status(404).send({ error: "Incorrect user or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).send({ error: "Incorrect user or password" });
  }

  if (!req.body.token)
  return res.status(422).json({  error: "Please select captcha" });

// Secret key
const secretKey = process.env.RECAPTCHA_SECERT_KEY;

// Verify URL
const query = stringify({
  secret: secretKey,
  response: req.body.token,
  remoteip: req.connection.remoteAddress,
});

const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

// Make a request to verifyURL
const body = await fetch(verifyURL).then((res) => res.json());

// If not successful
if (body.success !== undefined && !body.success)
  return res.status(422).json({  error: "Failed captcha verification" });


  const token = jwt.sign({ id: user._id }, process.env.JWT_SECERT_KEY);
  const { _id, name, profilePic } = user;
  res.json({
    message: "successfully signed in",
    token,
    user: { _id, name, username, email, profilePic },
  });
});

router.post("/signup", async (req, res) => {
  const user = new User(req.body);

  if (
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.profilePic
  ) {
    console.log("please add all the fields");
  }

  let existingEmail;
  let existingUsername;

  try {
    existingEmail = await User.findOne({ email: req.body.email });
  } catch (error) {
    console.log(error);
  }

  if (existingEmail) {
    return res.status(422).json({ error: "This email already exists" });
  }

  try {
    existingUsername = await User.findOne({ username: req.body.username });
  } catch (error) {
    console.log(error);
  }

  if (existingUsername) {
    return res.status(422).json({ error: "This username already exists" });
  }

  if (!req.body.token)
    return res.status(422).json({  error: "Please select captcha" });

  // Secret key
  const secretKey = process.env.RECAPTCHA_SECERT_KEY;

  // Verify URL
  const query = stringify({
    secret: secretKey,
    response: req.body.token,
    remoteip: req.connection.remoteAddress,
  });

  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Make a request to verifyURL
  const body = await fetch(verifyURL).then((res) => res.json());

  // If not successful
  if (body.success !== undefined && !body.success)
    return res.status(422).json({  error: "Failed captcha verification" });


  // password hashing
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  user.password = hashedPassword;

  try {
    const newUser = await user.save();

    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (error) {
    return res.status(422).json({ error: "User created unsuccessfully" });
  }
});

module.exports = router;
