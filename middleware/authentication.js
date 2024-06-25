const User = require('../models/users')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header


  try {
      const token = req.cookies.token ||""
    const payload = jwt.verify(token, process.env.JWT_SECRET)
  
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
