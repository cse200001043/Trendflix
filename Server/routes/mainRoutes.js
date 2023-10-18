const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mainControllers = require("../controllers/main/mainControllers");

router.post(
  "/addInitialDetails",
  auth,
  mainControllers.controllers.addInitialDetails
);
router.post(
  "/addToFavourites",
  auth,
  mainControllers.controllers.addToFavourites
);
router.post(
  "/addToPreviouslyWatched",
  auth,
  mainControllers.controllers.addToPreviouslyWatched
);
router.post("/isFavourite", auth, mainControllers.controllers.isFavourite);

module.exports = router;
