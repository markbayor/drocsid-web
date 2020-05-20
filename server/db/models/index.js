const User = require('./user')
const Message = require('./Message')
const Chat = require('./Chat')
const ChatsUsers = require('./Chats_users')
const ChatsMessages = require('./Chats_messages')

User.belongsToMany(Chat, { through: ChatsUsers })
Chat.belongsToMany(User, { through: ChatsUsers })

Message.belongsToMany(Chat, { through: ChatsMessages })
Chat.belongsToMany(Message, { through: ChatsMessages })


module.exports = {
  User,
  Message,
  Chat,
  ChatsUsers,
  ChatsMessages
}