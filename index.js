const express = require("express")
require("express-async-errors")
const app = express()
require("dotenv/config")
const cors = require("cors")
const connectDb = require("./db/connect")
const notFound = require("./middleware/not-found")
const errorHandlerMiddleware =require("./middleware/error-handler")
const authRouter = require("./routes/auth")
const cookieParser=require("cookie-parser")
app.use(cors());
app.use(express.json())
app.use(cookieParser())
const userRouter=require("./routes/user")
app.use("/auth", authRouter)
app.use("/",userRouter)
app.use(notFound)
app.use(errorHandlerMiddleware)
const port = process.env.PORT || 3000

const start = async() => {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log("app is apping")
        })
    } catch (err) {
        console.log(err)
    }
}
start()