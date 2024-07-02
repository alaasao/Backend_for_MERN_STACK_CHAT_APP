const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { getUserDetailsFromToken } = require("../controllers/user");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const io = new Server(server, {
  cors: {
    origins: [process.env.LOCAL_URL, process.env.DEPLOYED_URL],
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});
const onlineUser = []
io.on("connection", async (socket) => {
  console.log("connected", socket.id);
  const { token } = socket.handshake.auth;

  const user = await getUserDetailsFromToken(token);
  // create room
  socket.join(user._id);
  onlineUser.push(user._id.toString());
  io.emit("onlineUser", onlineUser);
  socket.on("message-page", async (data) => {

    const user = await User.findById(data).select("-password");
  


    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
      profilePic: user.profilePic,
      online:onlineUser.includes(data),
    };

    socket.emit("message-user", payload);
  });
  socket.on("new message", async (data) => { 
  
        //check conversation is available both user

        let conversation = await Conversation.findOne({
          "$or" : [
              { sender : data?.sender, receiver : data?.receiver },
              { sender : data?.receiver, receiver :  data?.sender}
          ]
        })
    console.log(conversation)


      if(!conversation){
          const createConversation = await Conversation.create({
              sender : data?.sender,
              receiver : data?.receiver
          })
        
    }
    const message = await Message.create({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,

    });
  
    })
 

    socket.on("disconnect", () => {
      // onlineUser.delete(user._id);
      console.log("disconnected", socket.id);
    });

})
 

module.exports = {
  app,
  server,
};
