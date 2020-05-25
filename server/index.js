const path = require('path')
const express = require('express')
const session = require('express-session')
// const passport = require('passport')
const morgan = require('morgan')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({ db })
const PORT = process.env.PORT || 5000
const app = express()
const socketio = require('socket.io')
const { corsRoute } = require('./middleware')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// passport.serializeUser((user, done) => done(null, user.id))

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await db.models.user.findByPk(id)
//     const res = {
//       id: user.id,
//       email: user.email,
//       username: user.username,
//       isAdmin: user.isAdmin,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     }
//     done(null, res)
//   } catch (err) {
//     done(err)
//   }
// })

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(corsRoute)

  // app.use(passport.initialize())
  // app.use(passport.session())

  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}
let _socketServer
const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

  // set up our socket control center
  _socketServer = socketio(server)

  require('./socket')(_socketServer)
}

const socketServer = () => _socketServer


const syncDb = () => db.sync()

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()

}

bootApp()

module.exports = {
  app,
  socketServer
}