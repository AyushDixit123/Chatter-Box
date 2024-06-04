const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel")
const User= require("../models/userModel")
const accessChat = expressAsyncHandler( async (req,res)=>{
    //user id with which we are going to create a chat
    const { userId } = req.body;

    if(!userId){
        console.log("userId param not sent with request");
        return res.sendStatus(400);
    }
    //whether chat exists with this user

    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{ $eq: req.user._id}}}, //current user that have loged in
            {users: { $elemMatch: { $eq: userId}}}    //userId provided to have a chat with

        ]

    }).populate('users','-password').populate("latestMessage");
    isChat = await User.populate(osChat, {
        path:'latestMessage.sender',
        select: "name pic email"
    })
    if(isChat.length>0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user_id,userId],
        }

        try{
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.send(FullChat)
        }catch(error){
            throw new Error(error.message)
        }
    }

})
module.exports={accessChat}