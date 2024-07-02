const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const register = async (req, res) => {
  res.json({name:"jjkk"})

  const user = await User.create({ ...req.body });
  const token = user.generateToken();
  const cookieOptions = {
    http: true,
    secure: true,
    sameSite: "none",
  };

  res
    .cookie("token", token, cookieOptions)
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new UnauthenticatedError("user does not exist");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("password incorrect");
  }

  const token = user.generateToken();
  const cookieOptions = {
    http: true,
    sameSite: "none",
    secure: true,

};
  res
    .cookie("token", token, cookieOptions)
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token });
};

const logout = (req, res) => {
  const cookieOptions = {
    http: true,
    secure: true,
    expires: new Date(0),
    sameSite: "none",
  };
  res
    .cookie("token", "", cookieOptions)
    .status(StatusCodes.OK)
    .json({ msg: "session out" });
};
module.exports = { login, register, logout };
