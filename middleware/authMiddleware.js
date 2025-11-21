require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticate = async (req, res, next) => {
 try{
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

   const token= req.headers.authorization.split(" ")[1];
   console.log(req.headers.authorization)
   if (!token) { return res.status(401).json({ success: false, message: "No token provided" }); }
   console.log(process.env.JWT_SECRET)
   const isVerified= jwt.verify(token,process.env.JWT_SECRET)
    if(isVerified)
    {
    req.user=isVerified;
    next()
    }

}
   catch(err){
        return res.json({message:"unauthorized",error:err.message})

   }
};

