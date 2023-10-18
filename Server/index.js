const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const mainRoutes = require("./routes/mainRoutes");

require("./controllers/auth/passport");

const PORT = process.env.PORT || parseInt(process.env.API_PORT);
const app = express();
app.use(express.json());
app.use(cors());

app.use(
  cookieSession({
    name: "google-auth-session",
    keys: ["key1", "key2"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("", authRoutes);
app.use("/main", mainRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed. Server not started");
    console.log(err);
  });
