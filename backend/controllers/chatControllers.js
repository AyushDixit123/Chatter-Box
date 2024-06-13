const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel")
const User= require("../models/userModel")

const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;
  

  if (!userId) {
    
    return res.sendStatus(400);
  }
  const otherUser = await User.findById(userId);
  const currentUserFirstName = req.user.name.split(' ')[0];
        const otherUserFirstName = otherUser.name.split(' ')[0];

        const chatName = `${currentUserFirstName} & ${otherUserFirstName}'s Chat`;
  // Check if a chat already exists
  var isChat = await Chat.findOne({
    isGroupChat: false,  
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // current user
      { users: { $elemMatch: { $eq: userId } } }, // user to chat with
    ],
  }).populate('users', '-password').populate("latestMessage");


  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: "name pic email"
  });

  if (isChat) {
    res.send(isChat);
  } else {
    // Create a new chat
    const chatData = {
      chatName: chatName,
      isGroupChat: false,
      users: [req.user._id, userId], // Corrected user ID
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.send(FullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});
/*const accessChat = expressAsyncHandler(async (req, res) => {

    const { userID } = req.body; // Current user who is logged in will send us the userID of the user with whom he wants to chat
    if (!userID) {
        console.log("UserID param not sent with the request");
        res.sendStatus(400);
    }
    try {
        //Find the user with the specified userID
        const otherUser = await User.findById(userID);
        if (!otherUser) {
            console.log("User with the specified ID not found");
            res.sendStatus(404);
            return;
        }
        // Split full names and select the first part
        const currentUserFirstName = req.user.name.split(' ')[0];
        const otherUserFirstName = otherUser.name.split(' ')[0];

        const chatName = `${currentUserFirstName} & ${otherUserFirstName}'s Chat`;


        let isChat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userID } } }
            ],
        }).populate("users", "-password").populate("latestMessage");  // Populating the users and the latest message
        isChat = await User.populate(
            isChat, {
            path: "latestMessage.sender",
            select: "name email"
        }); // Populating the sender of the latest message
        if (isChat) { // If chat exists, return the chat
            res.status(200).send(isChat);
        } else { // If chat does not exist, create a new chat
            let chatData = {
                chatName: chatName,
                isGroupChat: false,
                users: [req.user._id, userID],
            };
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password").populate("latestMessage");
            res.status(201).send(FullChat);

        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});*/


/*const fetchChats = expressAsyncHandler( async(req,res)=>{
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email"
        });
        res.status(200).send(chats);
    } catch (error) {

        throw new Error(error.message)
        
    }
})*/
const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        })
            .populate("users", "-password -otherSensitiveInfo") // Populate users field with user objects
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email"
        });
        
        res.status(200).send(chats);
    } catch (e) {
        
        res.status(500).send("Internal Server Error");
    }
});


const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

//fetching created chat
 const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected

const renameGroupChat = expressAsyncHandler(async (req,res) =>{
    const { chatId, chatName } =req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,{
            chatName:chatName
        },{
            new:true // so it does not return old name
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");
    if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});
 
const addtoGroupChat  = expressAsyncHandler(async (req,res) =>{
    const { chatId, userId } = req.body;


    const added= await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
            
        },{
                new:true
            }
    ).populate("users","-password")
    .populate("groupAdmin","-password");

     if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    
    res.json(addtoGroupChat);
  }
});

const removeFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});


module.exports={accessChat,fetchChats,createGroupChat,renameGroupChat,addtoGroupChat,removeFromGroup}