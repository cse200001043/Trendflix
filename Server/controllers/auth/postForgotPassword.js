const JWT = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Token = require("../../models/Token");
const sendEmail = require("../../utils/sendEmail");
const User = require("../../models/User");

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User Does Not Exist!");
    }

    let tkn = await Token.findOne({ userId: user._id });
    if (tkn) await tkn.deleteOne();
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);

    const token = Token.create({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    });

    const link = `${process.env.LOCALHOST}passwordReset?token=${resetToken}&id=${user._id}`;
    sendEmail(
      user.email,
      "Password Reset Request",
      { name: user.username, link: link },
      "./requestResetPassword.handlebars"
    );

    return res.status(200).json({ link: link });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = requestPasswordReset;
