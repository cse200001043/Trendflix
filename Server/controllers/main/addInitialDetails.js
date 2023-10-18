const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const addInitialDetails = async (req, res) => {
  try {
    const { age, country, languages, genres } = req.body;
    const userId = req.user.userId;
    await User.updateOne(
      { _id: userId },
      {
        age: age,
        country: country,
        $push: {
          languages: languages,
          favGenres: genres,
        },
      }
    );
    const user = await User.findOne({ _id: userId });
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "72h",
      }
    );
    res.status(201).json({
      userDetails: {
        email: user.email,
        token: token,
        username: user.username,
        _id: user._id,
        age: user.age,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Occured. Please try again");
  }
};

module.exports = addInitialDetails;
