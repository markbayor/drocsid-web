const router = require('express').Router()
module.exports = router

const { isLoggedIn } = require('../middleware')
const { loginUser, signUpUser, logOutUser, getMe } = require('./auth')

router.post('/login', loginUser)
router.post('/signup', signUpUser)
router.get('/me', isLoggedIn, getMe)

