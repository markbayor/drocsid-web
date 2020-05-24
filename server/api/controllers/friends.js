const { User, Chat, Message, ChatsUsers, Friendship } = require('../../db/models')
const { Op } = require('sequelize')

const Fuse = require('fuse.js')

const getUserFriends = async (req, res, next) => {
  try {
    //ONLY SEND BACK USERNAME EMAIL AND ID FOR EACH FRIEND IN REQUEST
    const friends = (await User.findOne({ where: { id: req.user.id }, include: [{ model: User, as: 'friend', attributes: ['id', 'email', 'username'] }] })).friend
    const response = friends.filter(friend => friend.friendship.confirmed === true)

    res.status(200).json(response)
    //testing
    // const related = (await User.findOne({ where: { id: req.user.id }, include: [{ model: Friendship, where: { confirmed: true }, include: [{ model: User, as: 'friend', attributes: ['id', 'email', 'username'] }] }] })).friend
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const getUserFriendRequests = async (req, res, next) => {
  try {
    // TODOOOOOOOO MIGHT CHANGE TO USER.FINDONE(INCLUDE) BUT ALSO NEED TO LEAVE OUT PASSWORD AND SALT
    const friends = (await User.findOne({ where: { id: req.user.id }, include: [{ model: User, as: 'friend', attributes: ['id', 'email', 'username'] }] })).friend

    const incomingRequests = friends.filter(friend => friend.friendship.confirmed === false && friend.friendship.requesterId !== req.user.id)
    const sentRequests = friends.filter(friend => friend.friendship.confirmed === false && friend.friendship.requesterId === req.user.id)

    res.status(200).json({ incomingRequests, sentRequests })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const addFriend = async (req, res, next) => {
  try {
    const requesterId = req.user.id

    if (req.body.friendUsername) {
      const friend = await User.findOne({ where: { username: req.body.friendUsername }, attributes: ['id', 'email', 'username'] })
      await Friendship.create({ userId: requesterId, friendId: friend.id })
      await Friendship.create({ userId: friend.id, friendId: requesterId, requesterId: requesterId })
      return res.status(200).json(friend)
    } else {
      const { friendId } = req.body
      const friend = await User.findOne({ where: { id: friendId }, attributes: ['id', 'email', 'username'] })
      await Friendship.create({ userId: requesterId, friendId, requesterId })
      await Friendship.create({ userId: friendId, friendId: requesterId, requesterId })
      return res.status(200).json(friend)
    }
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const acceptFriendRequest = async (req, res, next) => {
  try {
    // will come from clicking accept on a certain request
    const { requesterId } = req.body
    const requester = await User.findOne({ where: { id: requesterId }, attributes: ['id', 'email', 'username'] })
    console.log('REQUESTER', requester)
    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId: requesterId } }),
      Friendship.findOne({ where: { userId: requesterId, friendId: req.user.id } })
    ])
    console.log('RELATIONS', [relation, reverseRelation])
    relation.confirmed = true
    reverseRelation.confirmed = true
    console.log('RELATIONS AFTER', [relation, reverseRelation])
    await relation.save()
    await reverseRelation.save()

    // send back some info from the friend and the updated relations
    res.status(200).json({ friend: requester })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const rejectFriendRequest = async (req, res, next) => {
  try {
    const requesterId = req.params.id
    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId: requesterId } }),
      Friendship.findOne({ where: { userId: requesterId, friendId: req.user.id } })
    ])
    await Promise.all([
      relation.destroy(),
      reverseRelation.destroy()
    ])

    res.status(204).json({ requesterId })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const cancelFriendRequest = async (req, res, next) => {
  try {
    const friendId = req.params.id
    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId } }),
      Friendship.findOne({ where: { userId: friendId, friendId: req.user.id } })
    ])
    await relation.destroy()
    await reverseRelation.destroy()

    res.status(204).json({ message: 'Canceled', friendId })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const deleteFriend = async (req, res, next) => {
  try {
    const friendId = req.params.id
    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId } }),
      Friendship.findOne({ where: { userId: friendId, friendId: req.user.id } })
    ])
    await Promise.all([
      relation.destroy(),
      reverseRelation.destroy()
    ])

    res.status(204).json({ friendId })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const searchUser = async (req, res, next) => {
  try {
    // first find the ones that contain it instead of all of them (?) DOABLE FOR SMALL USER DATABASE
    const results = await User.findAll({ attributes: ['id', 'email', 'username'] })
    // THEN FILTER THOSE EVER MORE  
    console.log('RESULTS', results)
    const filterOptions = { threshold: 0.5, distance: 50, keys: ['username'] }
    const fuse = new Fuse(results, filterOptions)
    const result = fuse.search(req.body.searchVal).map(r => r.item)
    console.log('RESULT', result)
    res.status(200).json(result)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

module.exports = {
  getUserFriends,
  getUserFriendRequests,
  searchUser,
  addFriend,
  deleteFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
}