const { User, Chat, Message, ChatsUsers } = require('../../db/models')
const { Op } = require('sequelize')
const { socketServer } = require('../../index')

//must send req.user.id, chatId and text (content) in req.body
const sendMessage = async (req, res, next) => {
  try {
    const chatId = req.body.chatId; // get the chat where the message was written
    // create the message with the text and with the id of the user that made it, and attach it to the chat through chatId
    const message = await Message.create({ userId: req.user.id, chatId, text: req.body.text })
    // save relation for easier retrieval later (?) TODO
    const response = await Message.findOne({ where: { id: message.id }, include: [{ model: User, attributes: ['id', 'email', 'username'] }] })
    socketServer().emit('message', { message: response })
    res.status(200).json({ message: response })
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

module.exports = {
  sendMessage
}