const Sequelize = require('sequelize')
const db = require('../db')
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize

const Friendship = db.define('friendship', {
  confirmed: {
    type: BOOLEAN,
    defaultValue: false
  }
})

module.exports = Friendship