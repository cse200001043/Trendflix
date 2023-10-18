const passport = require("passport");

const getFacebook = passport.authenticate("facebook");

module.exports = getFacebook;