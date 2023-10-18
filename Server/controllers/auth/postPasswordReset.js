const Token = require("../../models/Token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const sendEmail = require("../../utils/sendEmail");

const passwordReset = async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    let passwordResetToken = await Token.findOne({ userId });
    if (!passwordResetToken) {
      return res.status(400).send("Invalid or expired password reset token");
    }
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      return res.status(400).send("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    const user = await User.findById({ _id: userId });
    sendEmail(
      user.email,
      "Password Reset Successfully",
      {
        name: user.username,
      },
      "./passwordUpdated.handlebars"
    );
    await passwordResetToken.deleteOne();
    return res.status(200).send("Password Updated Successfully.");
  } catch (error) {
    return res.status(500).send("Something went wrong. Please try again");
  }
};

module.exports = passwordReset;
