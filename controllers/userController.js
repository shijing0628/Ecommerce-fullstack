const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createAccessToken = user => {
 return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = user => {
 return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const userCtrl = {
 register: async (req, res) => {
  try {
   const { name, email, password } = req.body;

   const user = await Users.findOne({ email })
   if (user) return res.status(400).json({ msg: "The email already exists." })

   if (password.length < 6)
    return res.status(400).json({ msg: "Password length at least should be 6." })

   //password encryption
   const passwordHash = await bcrypt.hash(password, 10)
   const newUser = new Users({
    name,
    email,
    password: passwordHash
   })
   //save it to mongodb
   await newUser.save()

   // Then create jsonwebtoken for authentication
   const accesstoken = createAccessToken({ id: newUser._id })
   const refreshtoken = createRefreshToken({ id: newUser._id })

   res.cookie('refreshtoken', refreshtoken, {
    httpOnly: true,
    path: '/user/refresh_token'
   })

   res.json(accesstoken)
  } catch (err) {
   return res.status(500).json({ msg: err.message })
  }
 },

 login: async (req, res) => {
  try {
   const { email, password } = req.body;

   const user = await Users.findOne({ email })
   if (!user) return res.status(400).json({ msg: "User does not exist." })

   const isMatch = await bcrypt.compare(password, user.password)
   if (!isMatch) return res.status(400).json({ msg: "Incorrect password!" })

   // if login success create acccess token and refresh token
   const accesstoken = createAccessToken({ id: user._id })
   const refreshtoken = createRefreshToken({ id: user._id })

   res.cookie('refreshtoken', refreshtoken, {
    httpOnly: true,
    path: '/user/refresh_token'
   })

   res.json(accesstoken)

  } catch (err) {
   return res.status(500).json({ msg: err.message })
  }
 },

 logout: async (req, res) => {
  try {
   res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
   return res.json({ msg: "Logout successfully!" })
  } catch (err) {
   return res.status(500).json({ msg: err.message })
  }
 },

 getUser: async (req, res) => {
  try {
   // id of auth user, hide password in postman
   const user = await (await Users.findById(req.user.id).select('-password'))
   if (!user) return res.status(400).json({ msg: "user does not exist." })
   res.json(user)
  } catch (err) {
   return res.status(500).json({ msg: err.message })
  }
 },

 refreshToken: (req, res) => {
  try {
   const rf_token = req.cookies.refreshtoken;
   if (!rf_token) return res.status(400).json({ msg: "Please login or register" })

   jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(400).json({ msg: "Please login or register" })
    const accesstoken = createAccessToken({ id: user.id })
    res.json({ user, accesstoken })
   })
   res.json({ accesstoken })
  } catch (err) {
   return res.status(500).json({ msg: err.message })
  }

 }
}



module.exports = userCtrl