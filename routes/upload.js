const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

//upload image on couldinary. Saving file by using email 
//brenda.liu628@gmail.com
//password: Cso....
cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_API_SECRET
})

// every time when upload file it will generate a temp folder--file, remove them
const removeTmp = (path) => {
 fs.unlink(path, err => {
  if (err) throw err;
 })
}


//upload image to https://cloudinary.com/  only admin can do it.
router.post('/upload', auth, authAdmin, (req, res) => {
 try {
  //console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0)
   return res.status(400).json({
    msg: 'No file were uploaded.'
   })

  const file = req.files.file;
  if (file.size > 1024 * 1024)  // ==1Mb
  {
   removeTmp(file.tempFilePath)
   return res.status(400).json({ msg: "Size too large" })
  }

  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
   removeTmp(file.tempFilePath)
   return res.status(400).json({ msg: "file format is incorrect!" })
  }
  //https://cloudinary.com/documentation/node_integration
  //multer upload file to cloudinary : https://medium.com/@joeokpus/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54
  cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
   if (err) throw err;
   removeTmp(file.tempFilePath)
   res.json({ public_id: result.public_id, url: result.url })

  })

 } catch (err) {
  return res.status(500).json({ msg: err.message })
 }
})


//delete image, only admin can.
router.delete('/destroy', auth, authAdmin, (req, res) => {
 try {
  const { public_id } = req.body;
  if (!public_id)
   return res.status(400).json({ msg: "No image selected" })
  cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
   if (err) throw err;
   removeTmp(file.tempFilePath)
   res.json({ msg: "Image deleted." })
  })
 }
 catch (err) {
  return res.status(500).json({ msg: err.message })
 }
})


module.exports = router