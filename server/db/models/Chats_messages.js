const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize

const ChatsMessages = db.define('chats_messages', {
  senderId: {
    type: UUID
  },
  receiverId: {
    type: UUID
  }
})

module.exports = ChatsMessages