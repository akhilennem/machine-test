const mongoose=require('mongoose')
const blogSchema = mongoose.Schema({

title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorID:{
    type:String
},isActive:{
    type:Boolean,
    default:true
},isPublshed:{
    type:Boolean,
    default:true
},
})

module.exports = mongoose.model('blog',blogSchema)