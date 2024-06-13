/*const expressAsyncHandler =  require("express-async-handler");
const Message =require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModel");



const sendMessage= expressAsyncHandler(async (req,res)=>{

    const { content, chatId } = req.body;

    if (!content || !chatId){
        console.log("invalid data passed into request");
        return res.sendStatus(400);

    }


    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,

    }
    try {
        var message= await Message.create(newMessage);

         message = await message.populate("sender","name pic").execPopulate();
         message = await message.populate("chat").execPopulate();
         message= await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
         })
         await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message,
         });
         res.json(message)
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


})

module.exports= {sendMessage}*/

const expressAsyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
   
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate('sender', "name")// We are using execPopulate becasuse we are not using the populate method on the query but on the instance of the query (like not on Message.find() but on message)
        message = await message.populate('chat')
        message = await User.populate(message, { path: 'chat.users', select: "name email" });

        await Chat.findByIdAndUpdate(req.body.chatID, {
            latestMessage: message
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500);
        throw new Error('Error in creating message:' + error.message);
    }
});

const allMessages= expressAsyncHandler(async (req,res)=>{

    try {

        const messages= await Message.find({chat:req.params.chatId}).populate("sender", "name pic email").populate("chat");
        res.json(messages)
        // We are first finding all the messages of a chat (with the chatID by Message.find which will return an array of all the messages)
        // Then we are populating (i.e in the messages array we are also adding the sender field with the name and email of the sender)
        // Then we are populating the chat field (i.e in the messages array we are also adding t
    } catch (error) {

        res.status(400);
        throw new Error(error.message)
        
    }


})
module.exports = { sendMessage,allMessages };
