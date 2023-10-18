const passport = require("passport");

const getGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

module.exports = getGoogle;
