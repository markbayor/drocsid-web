'use strict'

const { Op } = require("sequelize");
const db = require('../server/db')
const {
  User,
  Message,
  Chat,
  ChatsUsers, // LINE 52 LOOK AT ALTERNATIVE
  Friendship
} = require('../server/db/models')

async function seed() {
  await db.sync({ force: true })
  console.log('db synced!')

  const [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = await Promise.all([
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
    User.create({ email: 'cunt1@gmail.com', username: 'cunt1', password: '123' }),
    User.create({ email: 'cunt2@gmail.com', username: 'cunt2', password: '123' }),
    User.create({ email: 'cunt3@gmail.com', username: 'cunt3', password: '123' }),
    User.create({ email: 'cunt4@gmail.com', username: 'cunt4', password: '123' }),
    User.create({ email: 'cunt5@gmail.com', username: 'cunt5', password: '123' }),
    User.create({ email: 'cunt6@gmail.com', username: 'cunt6', password: '123' }),
    User.create({ email: 'cunt7@gmail.com', username: 'cunt7', password: '123' }),
    User.create({ email: 'cunt8@gmail.com', username: 'cunt8', password: '123' }),
    User.create({ email: 'cunt9@gmail.com', username: 'cunt9', password: '123' }),
    User.create({ email: 'cunt10@gmail.com', username: 'cunt10', password: '123' }),
  ])

  // TO ADD FRIENDS MAKE BOTH RELATIONS WHEN ONE USER ADDS THE OTHER
  // ACCEPT FUNCTION WILL UPDATE BOTH RELATIONS "confirmed" COLUMN TO TRUE
  // REJECT FUNCTION WILL DELETE BOTH RELATIONS ALTOGETHER
  // DELETE FRIEND FUNCTION WILL DO THE SAME
  const friendship1 = await Friendship.create({ userId: user1.id, friendId: user2.id, requesterId: user1.id })
  const friendship1reverse = await Friendship.create({ userId: user2.id, friendId: user1.id, requesterId: user1.id })
  await Friendship.create({ userId: user1.id, friendId: user3.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user3.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user4.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user4.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user5.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user5.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user6.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user6.id, friendId: user1.id, requesterId: user1.id, confirmedd: true })
  await Friendship.create({ userId: user1.id, friendId: user7.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user7.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user8.id, requesterId: user8.id, confirmed: false })
  await Friendship.create({ userId: user8.id, friendId: user1.id, requesterId: user8.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user9.id, requesterId: user9.id, confirmed: false })
  await Friendship.create({ userId: user9.id, friendId: user1.id, requesterId: user9.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user10.id, requesterId: user10.id, confirmed: false })
  await Friendship.create({ userId: user10.id, friendId: user1.id, requesterId: user10.id, confirmed: false })

  const chat = await Chat.create({ name: 'chat1' })

  const addUserToChat = async (chat, newUser) => {
    chat.addUser(newUser) //add to join table 
    // if (chat.userIds) {
    if (chat.userIds && chat.userIds.length) {
      const newIds = (`${chat.userIds}::${newUser.id}`).split('::').sort().join('::')
      await chat.update({ userIds: newIds }) //case if there is one or more partners already
      // add to actual userIds array
      // }
    } else {
      await chat.update({ userIds: `${newUser.id}` }) // case if there is none at all
      // add the first userId ever in the chat
    }
  }

  await addUserToChat(chat, user1)
  await addUserToChat(chat, user2)
  await addUserToChat(chat, user3)

  // const getChatWithMultipleUsers = async (idsArr) => {
  //   const sorted = idsArr.sort().join('::')
  //   console.log('SORTED', sorted)
  //   const chat = await Chat.findOne({ //ignore for now, but it's how it would look
  //     where: {
  //       userIds: sorted
  //     }
  //   })
  //   return chat
  // }

  const [message1, message2, message3, message4, message5, message6, message7, message8] = await Promise.all([
    Message.create({ userId: user1.id, chatId: chat.id, text: 'Oi cunt' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt1' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt2' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt3' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt4' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt5' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt6' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt7' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What cunt8' }),
  ])
  // OKAY MESSAGES MIGHT GET MIXED IF CREATED AT THE EXACT FUCKIN MILlISECOND GIMME A BREAK KTHXBYE

  const sorted1 = ([user1.id, user2.id, user3.id]).sort().join('::')

  const foundChat1 = await Chat.findOne({
    where: {
      userIds: sorted1 //FUCKIN WORKS WITH THE EXACT IDS
    },
    include: [Message, User],
    order: [[Message, 'createdAt', 'ASC']]
  })

  // MUST MAKE A COPY WITH SLICE OR ... TO NOT SORT ORIGINAL ARRAY
  // foundChat1.dataValues.messages.sort((a, b) => a.createdAt - b.createdAt).forEach(m => console.log('SORTED? ', m.dataValues))

  //DOESNT WORK AS EXPECTED. MUST LOOK INTO METHOD TO MAKE IT HAVE BOTH UNORDERED, THOUGH WE SHOULDNT NEED IT
  const myChats = await Chat.findAll({ where: { userIds: { [Op.iLike]: `%${user3.id}%`, [Op.iLike]: `%${user1.id}%` } }, include: [Message] })

  // const relations = await Promise.all([
  //   ChatsMessages.create({ chatId: chat.id, messageId: message1.id, senderId: user1.id, receiverId: user2.id }),
  //   ChatsMessages.create({ chatId: chat.id, messageId: message2.id, senderId: user2.id, receiverId: user1.id })
  // ])

  // console.log('CHAT', chat.get())
  // console.log('CHAT_USER1', relation1[0].dataValues)
  // console.log('CHAT_USER2', relation2[0].dataValues)
  // console.log('MESSAGE1', message1.dataValues)
  // console.log('MESSAGE2', message2.dataValues)
  // console.log('MESSAGE1 FROM USER1', relations[0].dataValues)
  // console.log('MESSAGE2 FROM USER2', relations[1].dataValues)
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