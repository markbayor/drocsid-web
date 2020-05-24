const { User } = require('./db/models')

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
  isAdmin,
  corsRoute
}

