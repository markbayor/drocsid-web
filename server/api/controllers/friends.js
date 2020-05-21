const { User, Chat, Message, ChatsUsers, Friendship } = require('../../db/models')
const { Op } = require('sequelize')

const Fuse = require('fuse.js')

const searchUser = async (req, res, next) => {
  try {
    // first find the ones that contain it instead of all of them (?) DOABLE FOR SMALL USER DATABASE
    const results = await User.findAll({ where: { name: { [Op.iLike]: `%${req.body.searchVal}%` } } })
    // THEN FILTER THOSE EVER MORE  
    const filterOptions = {
      threshold: 0.5,
      distance: 15,
      keys: ['name']
    }
    const fuse = new Fuse(results, filterOptions)
    const result = fuse.search(req.body.searchVal).map(r => r.item)

    res.status(200).json(result)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const addFriend = async (req, res, next) => {
  try {
    const { friendId } = req.body
    const requesterId = req.user.id

    const friend = await User.findByPk(friendId)
    const relation = await Friendship.create({ userId: requesterId, friendId })
    const reverseRelation = await Friendship.create({ userId: friendId, friendId: requesterId })

    res.status(200).json({ friend, relations: [relation, reverseRelation] }) // sends back new friend and the two relations
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requesterId } = req.body
    const requester = User.findOne({ where: { id: requesterId } })

    const [relation, reverseRelation] = await Promise.all([
      Friendship.findOne({ where: { userId: req.user.id, friendId: requesterId } }),
      Friendship.findOne({ where: { userId: requesterId, friendId: req.user.id } })
    ])
    await Promise.all([
      relation.update({ confirmed: true }),
      reverseRelation.update({ confirmed: true })
    ])

    // send back some info from the friend and the updated relations
    res.status(200).json({
      friend: {
        id: requester.id,
        username: requester.username,
        email: requester.email
      },
      relations: [relation, reverseRelation]
    })

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

    res.status(204).json({ message: 'Friend rejected and relations deleted.' })
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

    res.status(204).json({ message: 'Friend deleted.' })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}


module.exports = {
  searchUser,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend
}