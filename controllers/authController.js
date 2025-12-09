require('dotenv').config();
const User = require("../models/user");
const BlogModel = require("../models/blog");
const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../validators/UserValidator");


exports.signup = async (req, res) => {
  let session;

  try {
    let { username, email, password } = req.body;

    const { error } = validator.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details,
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    password = await bcrypt.hash(password, 10);
    const [user] = await User.create(
      [
        {
          username,
          email,
          password,
        },
      ],
      { session }
    );

    const [newBlog] = await BlogModel.create(
      [
        {
          title: "test",
          content: "test",
          authorName: username,      
          authorID: user._id.toString(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      blog: {
        id: newBlog._id,
        title: newBlog.title,
      },
    });
  } catch (err) {
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (e) {
      }
    }

    console.error("Signup transaction error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Email not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid credentials" });
    console.log(process.env.JWT_SECRET)
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: 36000 });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};