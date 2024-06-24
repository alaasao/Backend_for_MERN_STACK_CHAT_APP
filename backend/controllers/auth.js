const User=require("../models/User")
const {StatusCodes}=require("http-status-codes")
const register = async (req, res) => {
    
console.log(req.body)
    const user = await User.create({ ...req.body })
    const token=user.generateToken()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = () => {
    
}
module.exports={login,register}