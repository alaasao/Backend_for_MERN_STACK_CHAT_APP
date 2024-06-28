const express = require("express")
const userRouter = express.Router()

const {getUserDetails,updateUser,getAllUsers}=require("../controllers/user")

userRouter.route("/user").get(getUserDetails)
userRouter.route("/updateuser").put(updateUser)
userRouter.route("/allusers").get(getAllUsers)
module.exports=userRouter