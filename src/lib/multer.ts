import multer from 'multer'

const avatarTypes = [
  'image/jpeg',
  'image/png'
]
const imagesTypes = [
  ...avatarTypes,
  'image/gif'
]

const avatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_req, file, callback) {
    if (!imagesTypes.includes(file.mimetype)) {
      callback(new Error('INVALID_FILE_TYPE'))
      return
    }
    callback(null, true)
  }
}).single('avatar')

const images = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(_req, file, callback) {
    if (!imagesTypes.includes(file.mimetype)) {
      callback(new Error('INVALID_FILE_TYPE'))
      return
    }
    callback(null, true)
  }
}).array('images', 5)

export { avatar, images }
