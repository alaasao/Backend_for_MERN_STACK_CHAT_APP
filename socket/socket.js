const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { getUserDetailsFromToken } = require("../controllers/user");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const getConversation = require("./getConversation");

const io = new Server(server)
  ;
  app.use(cors())
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
const onlineUser = [];
io.on("connection", async (socket) => {
  const { token } = socket.handshake.auth;

  const user = await getUserDetailsFromToken(token);
  // create room
  socket.join(user._id.toString());
  onlineUser.push(user._id.toString());
  io.emit("onlineUser", onlineUser);
  socket.on("message-page", async (data) => {
    const userDetails = await User.findById(data).select("-password");

    const payload = {
      name: userDetails.name,
      email: userDetails.email,
      _id: userDetails._id,
      profilePic: userDetails.profilePic,
      online: onlineUser.includes(data),
    };

    socket.emit("message-user", payload);

    let conversation = await Conversation.findOne({
      $or: [
        { sender: data, receiver: user._id },
        { sender: user._id, receiver: data },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", conversation?.messages || []);
  });
  socket.on("new message", async (data) => {
    //check conversation is available both user

    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      const createConversation = await Conversation.create({
        sender: data?.sender,
        receiver: data?.receiver,
        messages: [],
      });
    }
    conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    const message = await Message.create({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      msgByUser: data.msgByUser,
    });
    const updatedConversation = await Conversation.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: message?._id },
      }
    );

    const getUpdatedConversation = await Conversation.findById(
      conversation?._id || createConversation._id
    )
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.receiver).emit(
      "message data",
      getUpdatedConversation.messages || []
    );
    io.to(data?.sender).emit(
      "message data",
      getUpdatedConversation.messages || []
    );

    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  socket.on("sidebar", async (currentUserId) => {
    let conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await Message.updateMany(
      { _id: { $in: conversationMessageId }, msgByUser: msgByUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });
  socket.on("disconnect", () => {
    const index = onlineUser.indexOf(user._id);
    onlineUser.splice(index, 1);
  });
});

module.exports = {
  app,
  server,
};
