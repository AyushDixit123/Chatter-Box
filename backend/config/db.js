const mongoose = require('mongoose');

const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000
        })
        
    } catch (error) {
        console.log('error') 
    }

}
require('../models/userModel')
require('../models/chatModel')
require('../models/messageModel')
module.exports=connectDB


