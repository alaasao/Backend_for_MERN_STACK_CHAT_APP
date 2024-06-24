const express = require("express")
const authRouter = express.Router()
const {login,register}=require("../controllers/auth")
authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
module.exports=authRouter