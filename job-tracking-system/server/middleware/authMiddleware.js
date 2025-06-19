// Simple authentication middleware
const authMiddleware = (req, res, next) => {
  console.log('Authentication middleware running');
  // Add your actual authentication logic here
  next(); // Proceed to the next middleware/route handler
};

module.exports = authMiddleware;