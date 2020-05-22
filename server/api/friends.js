const router = require('express').Router()
module.exports = router

const { addFriend, getUserFriends, getUserFriendRequests, searchUser, acceptFriendRequest, rejectFriendRequest, deleteFriend } = require('./controllers/friends')

// must be logged in with req.user.id
router.get('/', getUserFriends)

// must send searchVal on req.body
router.post('/search', searchUser)

// must send friendId in req.body
router.delete('/delete', deleteFriend)

// req.user.id must be present
router.get('/requests', getUserFriendRequests)

// must send friendId on req.body and req.user.id is assumed
router.post('/requests/add', addFriend)

// must send requesterId in req.body
router.post('/requests/accept', acceptFriendRequest)

// must send requesterId in req.body
router.delete('/requests/reject', rejectFriendRequest)

