const router = require('express').Router()
module.exports = router

router.use('/chats', require('./chats'))
router.use('/messages', require('./messages'))
router.use('/friends', require('./friends'))
router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
