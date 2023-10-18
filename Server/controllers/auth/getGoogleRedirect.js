const passport = require("passport");

const getGoogleRedirect = passport.authenticate("google", {
  failureRedirect: "/failed",
  successRedirect: "/success",
});

module.exports = getGoogleRedirect;
