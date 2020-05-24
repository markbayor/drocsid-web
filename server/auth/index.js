const router = require('express').Router()
module.exports = router

const { loginUser, signUpUser, logOutUser, getMe } = require('./auth')

router.post('/login', loginUser)
router.post('/signup', signUpUser)
router.post('/logout', logOutUser)
router.get('/me', getMe)

