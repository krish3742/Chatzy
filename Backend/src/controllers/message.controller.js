import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    const resp = {
      status: "success",
      message: "All user fetched",
      data: filteredUser,
    };
    res.status(200).json(resp);
  } catch (error) {
    next(error);
  }
};
