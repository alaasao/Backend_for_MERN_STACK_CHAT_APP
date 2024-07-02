const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const getDetailsFromToken = (token) => {
   
  return jwt.verify(token, process.env.JWT_SECRET);
};
 const getUserDetailsFromToken = async(token) => {
  const user = getDetailsFromToken(token)
  return await User.findById(user.userId).select("-password")
  
 }

const getUserDetails = async (req, res) => {

  const token = req.cookies.token || "";

  payload = getDetailsFromToken(token);

  const user = await User.findById(payload.userId).select("-password");

  res.status(StatusCodes.OK).json({ user: user });
};
const updateUser = async (req, res) => {

  const token = req.cookies.token || "";
  
  payload = getDetailsFromToken(token);
  console.log(req.body)
  const user = await User.findByIdAndUpdate(payload.userId, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id ${payload.userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};
const getAllUsers = async (req, res) => {
  const users = await User.find({})
  res.status(StatusCodes.OK).json({users:users})
}
module.exports = { getUserDetails, updateUser ,getAllUsers,getUserDetailsFromToken};
