const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../utils/errorHandler')
const User = require('../models/User')
const keys = require('../config/keys')

module.exports.login = async function (req, res) {
try {
  const candidate = await User.findOne({
    email: req.body.email
  })
  if (candidate) {
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult) {
      const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
      }, keys.jwt, {expiresIn: 60 * 60 })

      await res.status(200).json({
        token: `Bearer ${token}`
      })
    } else {
      await res.status(401).json({
        message: 'Invalid password'
      })
    }
  } else {
    await res.status(404).json({
      message: 'User is not found'
    })
  }

} catch (e) {
  errorHandler(res, e)
}
}

module.exports.register = async function (req, res) {
  try {
    const candidate = await User.findOne({
      email: req.body.email
    })

    if (candidate) {
      await res.status(409).json({
        message: 'This user already exist'
      })
    } else {
      const hashPassword = await bcrypt.hash(req.body.password, 10)
      const user = await new User({
        email: req.body.email,
        password: hashPassword,
      }).user.save()

      await res.status(201).json(user)
    }
  } catch (e) {
    errorHandler(res, e)
  }
}
