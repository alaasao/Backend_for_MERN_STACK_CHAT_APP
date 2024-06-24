const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const bcrypt = require("bcryptjs");
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
});
const jwt = require("jsonwebtoken");
UserSchema.methods.generateToken = function () {
 return jwt.sign({ userId: this._id, email: this.email,name:this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME})
}
UserSchema.methods.comparePassword = async function (canditatePassword) {
    return await bcrypt.compare(canditatePassword, this.password)
    
  }
module.exports=mongoose.model("User",UserSchema)