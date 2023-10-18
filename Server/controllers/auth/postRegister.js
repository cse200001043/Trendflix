const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.exists({ email });
    if (userExists) {
      return res.status(409).send("User is already registered");
    }
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(409).send("Username is already taken.");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      email: email,
      password: encryptedPassword,
      role: "user",
    });

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      process.env.AUTH_TOKEN,
      {
        expiresIn: "72h",
      }
    );
    res.status(201).json({
      userDetails: {
        username: user.username,
        email: user.email,
        token: token,
        userId: user._id,
        age: user.age,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error Occured. Please try again");
  }
};

module.exports = postRegister;
