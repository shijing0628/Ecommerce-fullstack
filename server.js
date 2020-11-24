require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const app = express()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
 useTempFiles: true
}))




// routes
const userRouter = require('./routes/userRouter')
app.use('/user', userRouter)
const categoryRouter = require('./routes/categoryRouter')
app.use('/api', categoryRouter)
const uploadRouter = require('./routes/upload')
app.use('/api', uploadRouter)
const productRouter = require('./routes/productRouter')
app.use('/api', productRouter)


//Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
 useCreateIndex: true,
 useFindAndModify: false,
 useNewUrlParser: true,
 useUnifiedTopology: true
}, err => {
 if (err) throw err;
 console.log('connect to mongoDB...')
})

app.get('/', (req, res, next) => {
 res.json({ msg: "welcome to my channel. Please subscribe for us. Thanks" })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
 console.log('Server is running port', PORT)
})