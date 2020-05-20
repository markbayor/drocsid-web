const { User, Chat, Message, ChatsUsers } = require('../db/models')

export const adminGetAllChats = async (req, res, next) => {
  try {
    const chats = await Chat.findAll({ include: [User, Message] })
    res.status(200).json(chats)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

export const getUserChats = async (req, res, next) => {
  try {
    const myChats = await Chat.findAll({ where: { userId: req.user.id }, include: [Message] })
    res.status(200).json(myChats)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

export const createChat = async (req, res, next) => {
  try {
    const userId = req.user.id
    const partnerId = req.body.id
    const chat = await Chat.create()
    await ChatsUsers.create({ userId, partnerId, chatId: chat.id })
    res.status(200).json(chat)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

export const getSingleChat = async (req, res, next) => {
  try {
    const partnerId = req.body.partnerId;
    const chatId = (await Chat.findOne({ where: { userId: req.user.id, partnerId } })).id
    const chat = await Chat.findOne({ where: { id: chatId }, include: [{ model: Message }], order: [[Message, 'createdAt', 'ASC']] })
    req.status(200).json(chat)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}