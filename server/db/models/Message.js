const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize

const Message = db.define('message', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  text: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = Message