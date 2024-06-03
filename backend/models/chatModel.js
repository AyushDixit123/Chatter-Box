//schema for a particular chat
//chatname, isgroupchat, userslist, latesmsg, who is grpadmin

const { Timestamp } = require('bson');
const mongoose = require('mongoose');

const chatModel= mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false},
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        latestMessage: {
            type: momgoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        groupAdmin: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    },
    {
        timestamps: true 
    }

)
const Chat = mongoose.model("Chat",chatModel);
module.exports= Chat;