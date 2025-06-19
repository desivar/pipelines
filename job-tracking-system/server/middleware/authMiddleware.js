// server/middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Your authentication logic here
  next();
};

module.exports = authMiddleware;