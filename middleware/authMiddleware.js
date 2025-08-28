const jwt = require('jsonwebtoken');
const SECRET_KEY = '4a7d1ed414474e4033ac29ccb8653d9b5e2c6b43c5d1e9e2e5c3a6e3e8d8f6e2';

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;

