const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize

const Chat = db.define('chat', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
})

module.exports = Chat