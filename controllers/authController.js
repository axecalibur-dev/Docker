const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashpassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashpassword,
    });
    res.status(201).json({
      status: "Success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(201).json({
      status: "Fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: "User not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({
        status: "Success",
        message: "Correct Password",
      });
    } else {
      res.status(200).json({
        status: "Fail",
        message: "Incorrect Password",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(201).json({
      status: "Fail",
    });
  }
};
