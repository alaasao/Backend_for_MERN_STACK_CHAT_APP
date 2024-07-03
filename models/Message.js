const mongoose = require("mongoose")
const MessageSchema = mongoose.Schema({
    text: {
        type: String,
      
    },
    imageUrl: {
        type: String,
        default:""
    },
    videoUrl: {
        type: String,
        default:""
    },
    seen: {
        type: Boolean,
        default:false
    },
    msgByUser:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
}, {
    timestamps:true
})
module.exports=mongoose.model("Message",MessageSchema)