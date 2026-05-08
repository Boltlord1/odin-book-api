import type { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { MulterError } from 'multer'
import { clientError } from '../lib/errors'
import { avatar, images } from '../lib/multer'

const validateInitial: RequestHandler = (req, _res, next) => {
  req.errors = []
  next()
}

const validateBody: RequestHandler = (req, _res, next) => {
  const errors = req.errors
  const results = validationResult(req)
  if (!results.isEmpty()) {
    const array = results.array()
    for (const result of array) {
      if (result.type !== 'field') {
        continue
      }

      const error = clientError(result.path, result.msg)
      errors.push(error)
    }
  }

  next()
}

const validateAvatar: RequestHandler = (req, res, next) => {
  const errors = req.errors

  avatar(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const error = clientError('avatar', 'File size must be less than 5mb.')
        errors.push(error)
      } else {
        const error = clientError(
          'avatar',
          `Unknown upload error: ${err.message}`
        )
        errors.push(error)
      }
    }

    if (err && err.message === 'INVALID_FILE_TYPE') {
      const error = clientError('avatar', 'Avatar must be a png or jpeg.')
      errors.push(error)
    }

    next()
  })
}

const validateImages: RequestHandler = (req, res, next) => {
  const errors = req.errors

  images(req, res, (err) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const error = clientError(
          'images',
          'File size for each image must be less than 5mb.'
        )
        errors.push(error)
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        const error = clientError(
          'images',
          'Each post can only have up to 5 images.'
        )
        errors.push(error)
      } else {
        const error = clientError(
          'images',
          `Unknown upload error: ${err.message}`
        )
        errors.push(error)
      }
    }

    if (err && err.message === 'INVALID_FILE_TYPE') {
      const error = clientError('images', 'Image must be a png, jpeg or gif.')
      errors.push(error)
    }

    next()
  })
}

const validateFinal: RequestHandler = (req, res, next) => {
  const errors = req.errors
  if (errors.length > 0) {
    res.status(400).json(errors)
    return
  }

  next()
}

export {
  validateAvatar,
  validateBody,
  validateFinal,
  validateImages,
  validateInitial
}
