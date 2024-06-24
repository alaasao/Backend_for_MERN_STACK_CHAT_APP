const mongoose = require("mongoose")
const MessageSchema = mongoose.Schema({
    text: {
        type: String,
        required:[true,"Please provide text"]
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
    }
}, {
    timestamps:true
})
module.exports=mongoose.model("Message",MessageSchema)