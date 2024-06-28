const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const getDetailsFromToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const getUserDetails = async (req, res) => {

  console.log(req.cookies.token)

  const token = req.cookies.token || "";
console.log(token)
  payload = getDetailsFromToken(token);

  const user = await User.findById(payload.userId).select("-password");
  console.log(user);

  res.status(StatusCodes.OK).json({ user: user });
};
const updateUser = async (req, res) => {
  const token = req.cookies.token || "";
  payload = getDetailsFromToken(token);
  const user = await User.findByIdAndUpdate(payload.userId, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!user) {
    throw new NotFoundError(`No user with id ${payload.userId}`);
  }
  res.status(StatusCodes.OK).json({ user });
};
module.exports = { getUserDetails, updateUser };
