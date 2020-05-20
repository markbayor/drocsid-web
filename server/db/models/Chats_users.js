const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize

const ChatsUsers = db.define('chats_users', {
  partnerId: {
    type: UUID
  }
})

module.exports = ChatsUsers