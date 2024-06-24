const mongoose = require("mongoose");
const ConversationSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a sender"],
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a receiver"],
    },
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports=mongoose.model("Conversation",ConversationSchema)
