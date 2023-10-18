const passport = require("passport");

const getFacebookRedirect = passport.authenticate("facebook", {
  failureRedirect: "/failed",
  successRedirect: "/success",
});

module.exports = getFacebookRedirect;
