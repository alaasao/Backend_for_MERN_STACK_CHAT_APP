const express = require("express")
const authRouter = express.Router()
const { login, register,logout } = require("../controllers/auth")

authRouter.route("/register").post(register)
authRouter.route("/login").post(login)

authRouter.route("/logout").get(logout)
module.exports=authRouter