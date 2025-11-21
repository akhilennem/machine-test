require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../validators/UserValidator");


exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const { error, value } = validator.validate(req.body);
  if(error){
      return res.json({success:false,error:error.details})
    }
    const exist = await User.findOne({ email });
    if (exist) 
        return res.status(400).json({ success: false, message: "Email already exists" });
    password = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password });
    res.json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
   return res.status(500).json({ success: false, message: err.message });
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