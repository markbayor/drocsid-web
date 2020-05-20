'use strict'

const db = require('../server/db')
const {
  User,
  Message,
  Chat,
  ChatsUsers,
  ChatsMessages
} = require('../server/db/models')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  const [user1, user2, user3] = await Promise.all([
    User.create({
      email: 'admin@gmail.com',
      password: 'admin',
      username: 'admin',
      isAdmin: true
    }),
    User.create({
      email: 'murphy@gmail.com',
      username: 'murphy',
      password: '123'
    }),
    User.create({
      email: 'cunt@gmail.com',
      username: 'cunt',
      password: '123'
    })
  ])

  const chat = await Chat.create()

  const relation1 = await chat.addUser(user1)
  await relation1[0].update({ partnerId: user2.id })
  // TWO WAYS TO DO IT
  const relation2 = await chat.addUser(user2)
  relation2[0].partnerId = user1.id
  await relation2[0].save()

  const [message1, message2] = await Promise.all([
    Message.create({ text: 'Oi cunt' }),
    Message.create({ text: 'What cunt' }),
  ])

  const relations = await Promise.all([
    ChatsMessages.create({ chatId: chat.id, messageId: message1.id, senderId: user1.id, receiverId: user2.id }),
    ChatsMessages.create({ chatId: chat.id, messageId: message2.id, senderId: user2.id, receiverId: user1.id })
  ])

  console.log('CHAT', chat.get())
  console.log('CHAT_USER1', relation1[0].dataValues)
  console.log('CHAT_USER2', relation2[0].dataValues)
  console.log('MESSAGE1', message1.dataValues)
  console.log('MESSAGE2', message2.dataValues)
  console.log('MESSAGE1 FROM USER1', relations[0].dataValues)
  console.log('MESSAGE2 FROM USER2', relations[1].dataValues)

  const testChat = await ChatsUsers.findOne({ where: { userId: user2.id, partnerId: user1.id } })
  console.log('TEST CHAT', testChat.dataValues)
  // console.log('MSG CHATS', msg.dataValues.chats[0].dataValues.chats_messages)
}

async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }

}

if (module === require.main) {
  runSeed()
}

module.exports = seed