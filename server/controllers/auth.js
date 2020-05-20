const User = require('../db/models/user')

export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
    }
  } catch (err) {
    next(err)
  }
}

export const signUpUser = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.create(email, password)
    if (user.isAdmin === true) {
      user.isAdmin = false
    }
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
}

export const logOutUser = async (req, res, next) => {
  try {
    req.logout()
    req.session.destroy()
    res.redirect('/')
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

export const getMe = async (req, res, next) => {
  try {
    res.json(req.user)
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}