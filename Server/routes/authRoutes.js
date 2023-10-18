const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth/authControllers");
const auth = require("../middleware/auth");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/register", authControllers.controllers.postRegister);
router.post("/login", authControllers.controllers.postLogin);
router.get("/failed", authControllers.controllers.getFailed);
router.get("/success", isLoggedIn, authControllers.controllers.getSuccess);
router.get("/google", authControllers.controllers.getGoogle);
router.get(
  "/auth/google/register",
  authControllers.controllers.getGoogleRedirect
);
router.get("/facebook", authControllers.controllers.getFacebook);
router.get(
  "/auth/facebook/register",
  authControllers.controllers.getFacebookRedirect
);

router.post(
  "/auth/requestPasswordReset",
  authControllers.controllers.requestPasswordReset
);
router.post("/auth/passwordReset", authControllers.controllers.passwordReset);
router.get("/test", auth, (req, res) => {
  res.send("request passed");
});

module.exports = router;
