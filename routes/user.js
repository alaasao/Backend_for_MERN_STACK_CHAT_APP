const express = require("express")
const userRouter = express.Router()

const {getUserDetails,updateUser}=require("../controllers/user")

userRouter.route("/user").get(getUserDetails)
userRouter.route("/updateuser").put(updateUser)

module.exports=userRouter