const User = require("../../models/User");

const addToFavourites = async (req, res) => {
  try {
    const { isFavourite, movieId } = req.body;
    const userId = req.user.userId;
    if (isFavourite) {
      await User.updateOne(
        { _id: userId },
        {
          $push: { likedMoviesId: movieId },
        }
      );
    } else {
      await User.updateOne(
        { _id: userId },
        {
          $pull: { likedMoviesId: movieId },
        }
      );
    }
    res.status(201).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).send("Error Occured. Please try again");
  }
};

module.exports = addToFavourites;
