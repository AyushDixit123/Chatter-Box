const generateToken=require('../config/generateToken')
const asyncHandler= require('express-async-handler') // auto-catches any error in async process
const User = require('../models/userModel');

const registerUser = asyncHandler(async (req,res) =>{

    const { name, email, password, pic } = req.body;

    if (!name || !email || !password){
        //if any of them is undefined
        res.status(400);

        throw new Error('Please Enter all the fields')
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');

    }

    const user=await User.create({
        name,
        email,
        password,
        pic

    });
    if (user) {
        res.status(200).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error('failed to create the user')
    }

})

module.exports={registerUser}  