const { User, Chat, Message, ChatsUsers, Friendship } = require('../../db/models')
const { Op } = require('sequelize')

const Fuse = require('fuse.js')

const getUserFriends = async (req, res, next) => {
  try {
    // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO ONLY SEND BACK USERNAME EMAIL AND ID FOR EACH FRIEND IN REQUEST
    const friends = (await User.findOne({ where: { id: req.user.id }, include: [{ model: User, as: 'friend' }] })).friend
    res.status(200).json(friends)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const getUserFriendRequests = async (req, res, next) => {
  try {
    // TODOOOOOOOO MIGHT CHANGE TO USER.FINDONE(INCLUDE) BUT ALSO NEED TO LEAVE OUT PASSWORD AND SALT
    const requests = await Friendship.findAll({ where: { userId: req.user.id, confirmed: false } })
    res.status(200).json(requests)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const searchUser = async (req, res, next) => {
  try {
    // first find the ones that contain it instead of all of them (?) DOABLE FOR SMALL USER DATABASE
    const results = await User.findAll({ where: { username: { [Op.iLike]: `%${req.body.searchVal}%` } } })
    // THEN FILTER THOSE EVER MORE  
    // const filterOptions = {
    //   threshold: 0.5,
    //   distance: 15,
    //   keys: ['name']    TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    // }
    // const fuse = new Fuse(results, filterOptions)
    // const result = fuse.search(req.body.searchVal).map(r => r.item)

    res.status(200).json(results)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const addFriend = async (req, res, next) => {
  try {
    const requesterId = req.body.id
    if (req.body.friendUsername) {

      const friend = await User.findOne({ where: { username: req.body.friendUsername } })
      const relation = await Friendship.create({ userId: requesterId, friendId: friend.id })
      const reverseRelation = await Friendship.create({ userId: friend.id, friendId: requesterId })

      return res.status(200).json({ friend, relations: [relation, reverseRelation] })
    } else {
      const { friendId } = req.body
      const friend = await User.findByPk(friendId)
      const relation = await Friendship.create({ userId: requesterId, friendId })
      const reverseRelation = await Friendship.create({ userId: friendId, friendId: requesterId })

      return res.status(200).json({ friend, relations: [relation, reverseRelation] }) // sends back new friend and the two relations
    }
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
  getUserFriends,
  getUserFriendRequests,
  searchUser,
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  deleteFriend
}