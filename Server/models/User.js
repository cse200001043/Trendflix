const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  age: {
    type: String,
  },
  country: {
    type: String,
  },
  languages: [
    {
      type: String,
    },
  ],
  favGenres: [
    {
      type: String,
    },
  ],
  likedMoviesId: [
    {
      type: String,
    },
  ],
  previouslyWatched: [
    {
      type: String,
    },
  ],
});

module.exports = model("User", userSchema);
