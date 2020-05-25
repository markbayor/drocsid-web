const { User } = require('./db/models')
const jwt = require('jsonwebtoken')

const isLoggedIn = async (req, res, next) => {
  try {
    console.log('HEADERS', req.headers)
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.split('Bearer ')[1]) return res.status(403).json({ message: 'Forbidden' });

    const token = authHeader.split('Bearer ')[1]
    const user = jwt.verify(token, process.env.JWT_SECRET)

    req.user = user
    next()
  } catch (ex) {
    console.log(ex)
    next(ex)
  }
}

const isAdmin = async (req, res, next) => {
  const dbUser = await User.findByPk(req.user.id)
  if (!dbUser.isAdmin) return res.status(403).json({ message: 'Forbidden' })
  else next()
}

const corsRoute = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-Real-Ip, Content-Type, Accept, Authorization'
  );
  next();
};


module.exports = {
  isLoggedIn,
  isAdmin,
  corsRoute
}

