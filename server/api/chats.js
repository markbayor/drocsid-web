const router = require('express').Router()
module.exports = router

const { isAdmin } = require('../middleware')
const {
  adminGetAllChats,
  getUserChats,
  getTwoPersonChatWithMessages,
  createTwoPersonChat,
  createGroupChat,
  getUserChatsWithMessages,
  addUserToGroupChat,
  removeUserFromGroupChat,
  deleteTwoPersonChat
} = require('./controllers/chats')

// req.user has to be isAdmin
router.get('/admin/all', isAdmin, adminGetAllChats)

// must pass in req.user.id
router.get('/all', getUserChats)

// must pass in req.user.id
router.get('/all/populated', getUserChatsWithMessages)

// IS REALLY A GET BUT WHATEVER must pass in req.user.id and req.body.partnerId OR just chatId
router.post('/single/populated', getTwoPersonChatWithMessages) // WILL ALSO WORK FOR GROUPCHATS WITH chatId TODO

// create a new single chat with one other person. must pass in partnerId and req.user.id
router.post('/single/new', createTwoPersonChat)

router.delete('/single/:partnerId', deleteTwoPersonChat)

// create a new group chat. must pass in chat name(OPTIONAL) and !!!!!!must pass in userIds as an array of strings!!!!!!
router.post('/groupchat/new', createGroupChat)

// adds user to a group chat. must pass in chatId and userId in req.body
router.post('/groupchat/add', addUserToGroupChat)

// must pass in userId and chatId in req.body
router.post('/groupchat/remove', removeUserFromGroupChat)