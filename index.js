const express=require('express')
require('dotenv').config();
const mongoose=require('mongoose')
const authMiddleware=require('./middleware/authMiddleware')
const app=express()

app.use(express.json())

const authRoute =  require('./routes/authRoute')
const blogRoute =  require('./routes/blogRoute')

app.use('/auth',authRoute)
app.use(authMiddleware.authenticate)
app.use('/blog',blogRoute)

app.listen((process.env.PORT),()=>{
    console.log("App running on localhost:8000");  
})

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected succesfully")
}) 