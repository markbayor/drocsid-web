const User = require('./User')
const Message = require('./Message')
const Chat = require('./Chat')
const ChatsUsers = require('./Chats_users')
const Friendship = require('./Friendship')

User.belongsToMany(Chat, { through: ChatsUsers })
Chat.belongsToMany(User, { through: ChatsUsers })

User.hasMany(Message)
Message.belongsTo(User)

Chat.hasMany(Message)
Message.belongsTo(Chat)

User.belongsToMany(User, { through: Friendship, as: 'friend' })

module.exports = {
  User,
  Message,
  Chat,
  ChatsUsers,
  Friendship
}
