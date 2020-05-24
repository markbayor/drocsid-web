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

  const [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12] = await Promise.all([
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
    User.create({ email: 'user3@gmail.com', username: 'user3', password: '123' }),
    User.create({ email: 'user4@gmail.com', username: 'user4', password: '123' }),
    User.create({ email: 'user5@gmail.com', username: 'user5', password: '123' }),
    User.create({ email: 'user6@gmail.com', username: 'user6', password: '123' }),
    User.create({ email: 'user7@gmail.com', username: 'user7', password: '123' }),
    User.create({ email: 'user8@gmail.com', username: 'user8', password: '123' }),
    User.create({ email: 'user9@gmail.com', username: 'user9', password: '123' }),
    User.create({ email: 'user10@gmail.com', username: 'user10', password: '123' }),
    User.create({ email: 'user11@gmail.com', username: 'user11', password: '123' }),
    User.create({ email: 'user12@gmail.com', username: 'user12', password: '123' }),
  ])

  // TO ADD FRIENDS MAKE BOTH RELATIONS WHEN ONE USER ADDS THE OTHER
  // ACCEPT FUNCTION WILL UPDATE BOTH RELATIONS "confirmed" COLUMN TO TRUE
  // REJECT FUNCTION WILL DELETE BOTH RELATIONS ALTOGETHER
  // DELETE FRIEND FUNCTION WILL DO THE SAME
  const friendship1 = await Friendship.create({ userId: user1.id, friendId: user2.id, requesterId: user1.id, confirmed: true })
  const friendship1reverse = await Friendship.create({ userId: user2.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user3.id, requesterId: user3.id, confirmed: true })
  await Friendship.create({ userId: user3.id, friendId: user1.id, requesterId: user3.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user4.id, requesterId: user1.id, confirmed: false })
  await Friendship.create({ userId: user4.id, friendId: user1.id, requesterId: user1.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user5.id, requesterId: user1.id, confirmed: false })
  await Friendship.create({ userId: user5.id, friendId: user1.id, requesterId: user1.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user6.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user6.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user7.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user7.id, friendId: user1.id, requesterId: user1.id, confirmed: true })
  await Friendship.create({ userId: user1.id, friendId: user8.id, requesterId: user8.id, confirmed: false })
  await Friendship.create({ userId: user8.id, friendId: user1.id, requesterId: user8.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user9.id, requesterId: user9.id, confirmed: false })
  await Friendship.create({ userId: user9.id, friendId: user1.id, requesterId: user9.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user10.id, requesterId: user10.id, confirmed: false })
  await Friendship.create({ userId: user10.id, friendId: user1.id, requesterId: user10.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user11.id, requesterId: user11.id, confirmed: false })
  await Friendship.create({ userId: user11.id, friendId: user1.id, requesterId: user11.id, confirmed: false })
  await Friendship.create({ userId: user1.id, friendId: user12.id, requesterId: user12.id, confirmed: false })
  await Friendship.create({ userId: user12.id, friendId: user1.id, requesterId: user12.id, confirmed: false })

  const chat = await Chat.create({ name: 'chat1' })
  const chat2 = await Chat.create({ name: 'chat2' })
  const chat3 = await Chat.create({ name: 'chat3' })
  const chat4 = await Chat.create({ name: 'chat4' })
  const groupchat1 = await Chat.create({ name: 'groupchat1' })


  const addUserToChat = async (chat, newUser) => {
    chat.addUser(newUser) //add to join table 
    if (chat.userIds && chat.userIds.length) {
      const newIds = (`${chat.userIds}::${newUser.id}`).split('::').sort().join('::')
      await chat.update({ userIds: newIds }) //case if there is one or more partners already
    } else {
      await chat.update({ userIds: `${newUser.id}` }) // case if there is none at all
      // add the first userId ever in the chat
    }
  }

  await addUserToChat(chat, user1)
  await addUserToChat(chat, user2)
  await addUserToChat(chat2, user1)
  await addUserToChat(chat2, user3)
  await addUserToChat(chat3, user1)
  await addUserToChat(chat3, user4)
  await addUserToChat(chat4, user1)
  await addUserToChat(chat4, user5)
  await addUserToChat(groupchat1, user1)
  await addUserToChat(groupchat1, user2)
  await addUserToChat(groupchat1, user3)
  await addUserToChat(groupchat1, user4)

  const [message1, message2, message3, message4, message5, message6, message7, message8] = await Promise.all([
    Message.create({ userId: user1.id, chatId: chat.id, text: 'Hey there' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'what it do' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'What it do babyyyy' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'Anyobdy there?' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'Please respond' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'This feels lonely' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'I dunno what to write' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'This is a message :)' }),
    Message.create({ userId: user2.id, chatId: chat.id, text: 'Hello again' }),
  ])
  // OKAY MESSAGES MIGHT GET MIXED IF CREATED AT THE EXACT MILlISECOND GIMME A BREAK KTHXBYE

  const sorted1 = ([user1.id, user2.id, user3.id]).sort().join('::')

  const foundChat1 = await Chat.findOne({
    where: {
      userIds: sorted1 //FUCKIN WORKS WITH THE EXACT IDS
    },
    include: [Message, User],
    order: [[Message, 'createdAt', 'ASC']]
  })
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