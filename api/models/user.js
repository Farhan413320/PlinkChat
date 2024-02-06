const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
],
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
],
    sendFriendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
],
});

const User = mongoose.model('User',userschema);
module.exports = User;