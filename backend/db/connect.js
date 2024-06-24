const mongoose = require("mongoose")
const connectDb = (url) => {
    mongoose.connect(url)
}
module.exports= connectDb