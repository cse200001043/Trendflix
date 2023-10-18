const jwt = require("jsonwebtoken");
const config = process.env;

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.headers["authorization"] || req.query.token;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, config.AUTH_TOKEN);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("Token is invalid!");
  }

  return next();
};

module.exports = verifyToken;
