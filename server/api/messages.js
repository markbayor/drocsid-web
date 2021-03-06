const router = require('express').Router()
module.exports = router

const { isLoggedIn } = require('../middleware')
const { sendMessage } = require('./controllers/messages')

router.post('/new', isLoggedIn, sendMessage)