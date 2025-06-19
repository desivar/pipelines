// Simple version that will work with your frontend
module.exports = (req, res, next) => {
  // Skip actual authentication but keep the structure
  console.log('Auth middleware passed (simplified for homework)');
  next();
};