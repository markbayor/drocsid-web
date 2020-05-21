const router = require('express').Router()
module.exports = router

const { isAdmin } = require('../middleware')
const { sendMessage } = require('./controllers/messages')

router.post('/new', sendMessage)