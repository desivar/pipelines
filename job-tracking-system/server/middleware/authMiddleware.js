// Simple auth middleware example
const authMiddleware = (req, res, next) => {
  // Your authentication logic here
  console.log('Auth middleware running');
  next();
};

module.exports = authMiddleware;