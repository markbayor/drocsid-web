const { User, Chat, Message, ChatsUsers } = require('../../db/models')
const { Op } = require('sequelize')

const adminGetAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.findAll({ include: [User, Message] })
    let copy = chats.slice()
    copy = copy.sort((a, b) => a.updateddAt - b.updatedAt)
    res.status(200).json(copy)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const getUserChats = async (req, res, next) => {
  try {
    const myChats = await Chat.findAll({ where: { userIds: { [Op.iLike]: `%${req.user.id}%` } } })
    let copy = myChats.slice()
    copy = copy.sort((a, b) => a.updatedAt - b.updatedAt)
    res.status(200).json(copy)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const getUserChatsWithMessages = async (req, res, next) => {
  try {
    const myChats = await Chat.findAll({ where: { userIds: { [Op.iLike]: `%${req.user.id}%` } }, include: [{ model: Message, limit: 50 }] }) //TODO ADD OFFSET TO GET OLDER MESSAGES
    let copy = myChats.slice()
    // SORTING MESSAGES HERE... NOT GOOD. TODO.
    copy.forEach(chat => chat.messages = chat.messages.sort((a, b) => a.updatedAt - b.updatedAt))
    res.status(200).json(copy)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const getSingleChatWithMessages = async (req, res, next) => {
  try {
    if (req.body.userId || req.body.partnerId) {
      const userId = req.body.id
      const partnerId = req.body.partnerId;
      const chat = await Chat.findOne({ where: { userIds: `${[userId, partnerId].sort().join('::')}` }, include: [{ model: Message, limit: 50 }] })
      // SORTS THEM HERE, GOTTA LOOK INTO IT WITH SOME SEQUELIZE METHOD 
      // TODO
      chat.messages = chat.messages.sort((a, b) => a.createdAt - b.createdAt)
      res.json(chat)
    } else if (req.body.chatId) {
      const chat = await Chat.findOne({ where: { id: req.body.chatId }, include: [Message] })
      chat.messages = chat.messages.sort((a, b) => a.createdAt - b.createdAt)
      res.json(chat)
    }
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const createTwoPersonChat = async (req, res, next) => {
  try {
    const userId = req.user.id //get the id of the person that wanted to open a new chat
    const partnerId = req.body.partnerId // get the id of the person they clicked into
    const chat = await Chat.create({ userIds: `${[userId, partnerId].sort().join('::')}` }) //ids are ALWAYS SORTED
    // create relations in join table for both users
    await ChatsUsers.create({ userId, chatId: chat.id })
    await ChatsUsers.create({ userId: partnerId, chatId: chat.id })
    // send back chat TODO
    res.status(200).json(chat)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const createGroupChat = async (req, res, next) => {
  try {
    const userId = req.user.id //get the id of the person that clicked create group
    const partnerIds = req.body.partnersIds // get the people he wanted to add in the create form

    //create the chat with all the userIds in it and the name if it is set
    const userIds = [userId, ...partnerIds].sort().join('::')
    const chat = await Chat.create({ name: req.body.groupName || null, userIds })

    await ChatsUsers.create({ chatId: chat.id, userId: userId }) // add the main user to the chat join table for easy retrieval if needed (will have to think about it)
    await partnersIds.forEach(async partnerId => {
      await ChatsUsers.create({ chatId: chat.id, userId: partnerId })// consequently add each partner to group
    })
    res.status(200).json(chat) //send back new chat TODO
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const addUserToGroupChat = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body
    const chat = await Chat.findByPk(chatId)
    const user = await User.findOne({ where: { id: userId }, attributes: ['id', 'email', 'username'] })

    await chat.addUser(user)

    if (chat.userIds && chat.userIds.length) {
      const newIds = (`${chat.userIds}::${userId}`).split('::').sort().join('::')
      await chat.update({ userIds: newIds }) //case if there is one or more partners already
      // add to actual userIds array
    } else {
      await chat.update({ userIds: `${newUser}` }) // case if there is none at all
      // add the first userId ever in the chat
    }

    res.status(200).json({ user, chat })
  } catch (ex) {

  }
}

const removeUserFromGroupChat = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body
    const chat = await Chat.findByPk(chatId)
    const relation = ChatsUsers.findOne({ where: { userId, chatId } })
    await relation.destroy()
    chat.userIds = chat.userIds.split('::').filter(id => id === userId ? '' : id).join('::')
    await chat.save()
    res.status(200).json(chat)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

module.exports = {
  adminGetAllChats,
  getUserChats,
  getUserChatsWithMessages,
  createTwoPersonChat,
  createGroupChat,
  getSingleChatWithMessages,
  addUserToGroupChat,
  removeUserFromGroupChat
}