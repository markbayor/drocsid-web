const { User, Chat, Message, ChatsUsers, Friendship } = require('../../db/models')
const { Op } = require('sequelize')

const Fuse = require('fuse.js')

const getUserFriends = async (req, res, next) => {
  try {
    //ONLY SEND BACK USERNAME EMAIL AND ID FOR EACH FRIEND IN REQUEST
    const friends = (await User.findOne({ where: { id: req.user.id }, include: [{ model: User, as: 'friend', attributes: ['id', 'email', 'username'] }] })).friend
    const response = friends.filter(friend => friend.friendship.confirmed === true)
    console.log('FRIEEEENDS', response)
    res.status(200).json(friends)
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
    console.log('REQUEEEESTS', incomingRequests, sentRequests)
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
      return res.status(200).json({ requested: friend })
    } else {

      const { friendId } = req.body
      const friend = await User.findByPk({ where: { id: friendId }, attributes: ['id', 'email', 'username'] })
      await Friendship.create({ userId: requesterId, friendId, requesterId })
      await Friendship.create({ userId: friendId, friendId: requesterId, requesterId })
      return res.status(200).json({ requested: friend })
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
    const requester = User.findOne({ where: { id: requesterId }, attributes: ['id', 'email', 'username'] })

    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId: requesterId } }),
      Friendship.findOne({ where: { userId: requesterId, friendId: req.user.id } })
    ])
    await Promise.all([
      relation.update({ confirmed: true }),
      reverseRelation.update({ confirmed: true })
    ])

    // send back some info from the friend and the updated relations
    res.status(200).json({ friend: requester })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const rejectFriendRequest = async (req, res, next) => {
  try {
    const { requesterId } = req.body
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

const deleteFriend = async (req, res, next) => {
  try {
    const { friendId } = req.body
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
    const results = await User.findAll({ where: { username: { [Op.iLike]: `%${req.body.searchVal}%` } }, attributes: ['id', 'email', 'username'] })
    // THEN FILTER THOSE EVER MORE  
    // const filterOptions = {threshold: 0.5,distance: 15,keys: ['name']} 
    //TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    // const fuse = new Fuse(results, filterOptions)
    // const result = fuse.search(req.body.searchVal).map(r => r.item)

    res.status(200).json(results)
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
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend
}