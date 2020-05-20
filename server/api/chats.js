const router = require('express').Router()
module.exports = router

const { isAdmin } = require('../middleware')
const { adminGetAllChats, getUserChats, getSingleChat, createChat } = require('../controllers/chats')

router.get('/admin/all', isAdmin, adminGetAllChats)

router.get('/all', getUserChats)

router.get('/single', getSingleChat)

router.post('/single', createChat)
