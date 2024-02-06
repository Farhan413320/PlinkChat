/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Message = require('./models/message');
const path = require('path');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');


//creating token....

const createToken = (userId) =>{
  const payload = {
    userId:userId,
  };

  const token = jwt.sign(payload , "Q$r2K6W8n!jCW%Zk" , {expiresIn:"8h"});
  return token;
};


mongoose
  .connect(
    'mongodb+srv://zojaan42:Farhan413320@cluster0.06b7qyh.mongodb.net/',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => {
    console.log('connected to mongodb');
  })
  // eslint-disable-next-line handle-callback-err
  .catch((err) => {
    console.log('error connecting to mongodb');
  });
app.listen(port, () => {
  console.log('server running on port 8000');
});

//endpoint for registering user....

app.post('/register', (req, res) => {
  const { name, email, password, image } = req.body;
  const newUser = new User({ name, email, password, image });
  newUser.save().then(() => {
    res.status(200).json({ message: 'User registered successfully' });
  }).catch((err) => {
    console.log('error creating user', err);
    res.status(500).json({ message: 'error registering user' });
  });
});

app.post('/login', (req, res) => {
  const { email,password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: 'Email and Password are required' });
  };

  User.findOne({ email }).then((user) => {
   
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: 'Invalid Password' });
    }

    const token = createToken(user._id);
    res.status(200).json({ token });
  }).catch((err) => {
    console.log('error in finding user', err);
    res.status(500).json({ message: 'internal server error' });
  });

});

//access all the user except the loggedin user

app.get('/users/:userId', (req, res) => {
  const loggedIn = req.params.userId;
  
 User.find({_id:{$ne:loggedIn}}).then((users) =>{
  res.status(200).json(users)
 }).catch((err)=>{
  console.log('error retrieving users',err);
  res.status(500).json({ message: 'error retrieving users' });
 });
});

//sending friend requests....
app.post('/friend-request', async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sendFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

//get all friends requests....

app.get('/friend-request/:userId' , async (req,res) =>{
  try{
    const {userId} = req.params;
//console.log(userId);
    const user = await User.findById(userId).populate('friendRequests' , 'name email image').lean();
    const friendrequests = user.friendRequests;
    res.json(friendrequests);
  // console.log(friendrequests);
  
  }
  catch(error){
    console.log(error);
    res.status(500).json({message:'internal server error'});
  }
});

//accepting friend request...
app.post('/friend-request/accept', async(req,res)=>{

  try{
    const {senderId,recepientId} = req.body;

  const sender = await User.findById(senderId);
  const recepient = await User.findById(recepientId);
  // console.log(senderId);
  //console.log(recepient);

  sender.friends.push(recepientId);
  recepient.friends.push(senderId);

  recepient.friendRequests = recepient.friendRequests.filter((request) => request.toString() !== senderId.toString());
  sender.friendRequests = sender.friendRequests.filter((request) => request.toString() !== recepientId.toString());

  await sender.save();
  await recepient.save();
  res.status(200).json({message:'Friend Request Accepted Successfully'});


  }catch(error){
    console.log(error);
    res.status(500).json({message:'internal server error'});
  }
  
});

//endpoint to access all the friends of the logged in user!
app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use('/fetchimage', express.static(path.join(__dirname, 'files')));
   

const multer = require('multer');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({storage: storage});

//sending message endpoint....

app.post('/messages' , upload.single('imageFile'), async(req,res)=>{
 
  try {
    const { senderId,recepientId,messageType,messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message:messageText,
      timestamp:new Date(),
      imageUrl: messageType === 'image'?req.file.path:null,
    });
    await newMessage.save();
    res.status(200).json({message:'message sent successfully'});
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//for header of inbox message....
app.get('/userdata/:userId' , async(req,res) =>{
  try {
    const {userId} = req.params;

  const recepientId = await User.findById(userId);
    res.json(recepientId);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//to fetch between two users in chatbox....

app.get('/messages/:senderId/:recepientId' , async (req,res)=>{
   try {
    const {senderId,recepientId} = req.params;

    const messages = await Message.find({
      $or:[
        {senderId:senderId, recepientId:recepientId},
        {senderId:recepientId , recepientId:senderId}
      ]
    }).populate('senderId' , '_id name');

    messages.forEach((message) => {
      if (message.messageType === 'image' && message.imageUrl) {
        message.imageUrl = `http://${req.headers.host}/fetchimage/${path.basename(message.imageUrl)}`;
      }
    });

    res.json(messages);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///delete messages...

app.post('/deleteMessages' , async(req,res)=>{
  try {
    const {messages} = req.body;
    if(!Array.isArray(messages) || messages.length === 0){
      return res.status(400).json({message:'invalid req body!'});
    };

    await Message.deleteMany({_id :{$in: messages}});

    res.json({message: 'Messages deleted successfully'});

   
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/friend-requests/sent/:userId',async(req,res) => {
  try{
    const {userId} = req.params;
    const user = await User.findById(userId).populate("sendFriendRequests","name email image").lean();

    const sentFriendRequests = user.sendFriendRequests;

    res.json(sentFriendRequests);
  } catch(error){
    console.log("error",error);
    res.status(500).json({ error: "Internal Server" });
  }
});

app.get('/friends/:userId',(req,res) => {
  try{
    const {userId} = req.params;

    User.findById(userId).populate("friends").then((user) => {
      if(!user){
        return res.status(404).json({message: "User not found"})
      }

      const friendIds = user.friends.map((friend) => friend._id);

      res.status(200).json(friendIds);
    })
  } catch(error){
    console.log("error",error);
    res.status(500).json({message:"internal server error"})
  }
});