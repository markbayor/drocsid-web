const router = require('express').Router()
module.exports = router

const { isLoggedIn } = require('../middleware')
const { addFriend, getUserFriends, getUserFriendRequests, searchUser, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, deleteFriend } = require('./controllers/friends')

// must be logged in with req.user.id
router.get('/', isLoggedIn, getUserFriends)

// must send searchVal on req.body
router.post('/search', searchUser)

// must send friendId in params
router.delete('/delete/:id', isLoggedIn, deleteFriend)

// req.user.id must be present
router.get('/requests', isLoggedIn, getUserFriendRequests)

// must send friendId on req.body and req.user.id is assumed
router.post('/requests/add', isLoggedIn, addFriend)

// must send requesterId in req.body
router.post('/requests/accept', isLoggedIn, acceptFriendRequest)

// must send friendId
router.delete('/requests/cancel/:id', isLoggedIn, cancelFriendRequest)

// must send requesterId in req.body
router.delete('/requests/reject/:id', isLoggedIn, rejectFriendRequest)

