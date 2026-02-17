// Middleware autentificare admin - placeholder
module.exports = function (req, res, next) {
  // TODO: verifica token/session
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  // Implement actual validation
  next();
};
