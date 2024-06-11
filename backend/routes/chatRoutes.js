const express = require('express');
const { protect } = require('../middleware/authMiddleware')
const router = express.Router();
const { accessChat,fetchChats,createGroupChat,renameGroupChat, addtoGroupChat,removeFromGroup }=require("../controllers/chatControllers")
//creating and accesing chats
 router.route('/').post(protect, accessChat );
 router.route('/').get(protect, fetchChats);

//creating groups
 router.route('/group').post(protect, createGroupChat);
 router.route('/rename').put(protect, renameGroupChat);
 router.route('/groupremove').put(protect, removeFromGroup);
 router.route("/groupadd").put(protect, addtoGroupChat)

module.exports= router;

 

