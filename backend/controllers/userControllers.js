const generateToken=require('../config/generateToken')
const asyncHandler= require('express-async-handler') // auto-catches any error in async process
const User = require('../models/userModel')

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

const authUser= asyncHandler(async(req,res)=>{
    const { email, password } = req.body;

    const user =await User.findOne({email});

    if(user && (await user.matchPassword(password))
    ){
res.json({
    _id:user._id,
    name:user.name,
    token: generateToken(user._id),
    email : user.email
})}else{
    res.status(401);
    throw new  Error('failed to connect')
}
})
//api/user?search
const allUsers= asyncHandler(async(req,res)=>{
    const keyword=req.query.search ? {
        //or oerator in mongodb that performs logical or operation
        $or: [
            //regex helps in matching and filtering the strings
           // In MongoDB, the following <options> are available for use with regular expression:

//i: To match both lower case and upper case pattern in the string.
//m: To include ^ and $ in the pattern in the match i.e. to specifically search for ^ and $ inside the string. Without this option, these anchors match at the beginning or end of the string.
//x: To ignore all white space characters in the $regex pattern.
//s: To allow the dot character “.” to match all characters including newline characters.
            { name: { $regex: req.query.search, $options: "i"} },
            { email: { $regex: req.query.search, $options: "i"}}
        ]
    }:{};

    //const users = await User.find(keyword)//.find({_id:{$ne:req.user._id}}) //give user except user currently logged in
    //res.send(users)                       //to make req.user.id accesible we need to make the user authorised as per mongodb

    const users = await User.find(keyword)//.find({_id:{$ne:req.user._id}})
    res.send(users) 
})

module.exports={registerUser, authUser, allUsers}  