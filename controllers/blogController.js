
const  mongoose  = require('mongoose');
const BlogModel = require('../models/blog')
const UserModel = require('../models/user')


exports.createBlog = async (req, res) => {
  try {
    console.log('req.user:', req.user);

    const { title, content, authorName } = req.body;
    if (!title || !content || !authorName) {
      return res.status(400).json({
        success: false,
        error: 'title, content and author are required'
      });
    }
    const newBlog = new BlogModel({
      title,
      content,
      authorName,
      authorID: req.user.email
    });

    console.log('newBlog (before save):', newBlog);

    await newBlog.save();

    console.log('Blog saved successfully:', newBlog._id);

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blogId: newBlog._id
    });
  } catch (error) {
    console.error('createBlog error:', error);
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    
  }
};

exports.listBlogs = async(req,res)=>{
    try {
        
       pipeline=[{
        $match:{
        isPublshed:true,
        isActive:true
       }
    },{
        $project:{
            title:1,
            authorName:1,
            content:1
        }
    }]

   const response = await BlogModel.aggregate(pipeline);
    return res.send({success:true,data:response})
    } catch (error) {
        return res.send({"error":error.message})
    }
}

exports.individualBlog = async(req,res)=>{
    try {
        
        const email=req.user.email;
        const pipeline = [
  {
    $match: {
      email: email
    }
  },
  {
    $lookup: {
      from: "blogs",
      let: { userEmail: "$email" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$authorID", "$$userEmail"] }
          }
        },
        {
          $match: { isActive: true }  
        }
      ],
      as: "blogs"
    }
  },
  {
    $unwind: "$blogs"
  },
  {
    $project: {
      username: 1,
      email: 1,
      blog: "$blogs"
    }
  }
];

        const response = await UserModel.aggregate(pipeline);
        return res.send({success:true,data:response})
    } catch (error) {
                return res.send({"error":error.message})

    }
}

exports.editBlogs = async(req,res)=>{
    try {
        
        const authorID=req.user.email;
        const data=req.body;
        const blogID=new mongoose.Types.ObjectId(req.query.blogID);
        console.log('blogid')
        console.log(blogID) 
        const response = await BlogModel.findOneAndUpdate({_id:blogID,authorID},{$set:data})
        if(!response){
            return res.send({success:false,message:'No matching blog found for the logged user'})
        }
         return res.send({success:true,data:response})

    } catch (error) {
                        
        return res.send({"error":error.message})

    }
}


exports.deleteBlogs = async(req,res)=>{
    try {
        
        const authorID=req.user.email;
        const blogID=new mongoose.Types.ObjectId(req.query.blogID);
        console.log(req.query) 
        const response = await BlogModel.findOneAndUpdate({_id:blogID,authorID},{$set:{isActive:false}})
        if(!response){
            return res.send({success:false,message:'No matching blog found for the logged user'})
        }
         return res.send({success:true,data:response})

    } catch (error) {
                        
        return res.send({"error":error.message})

    }
}