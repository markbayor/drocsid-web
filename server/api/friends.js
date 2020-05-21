const router = require('express').Router()
module.exports = router

const { addFriend, getUserFriends, getUserFriendRequests, searchUser, acceptFriendRequest, rejectFriendRequest, deleteFriend } = require('./controllers/friends')

router.get('/', getUserFriends)

// req.user.id must be present
router.get('/requests', getUserFriendRequests)

// must send searchVal on req.body
router.post('/search', searchUser)

// must send friendId on req.body and req.user.id is assumed
router.post('/add', addFriend)

// must send requesterId in req.body
router.post('/accept', acceptFriendRequest)

// must send requesterId in req.body
router.delete('/reject', rejectFriendRequest)

// must send friendId in req.body
router.delete('/delete', deleteFriend)

