const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
var { expressjwt: jwt } = require("express-jwt");

// MIDDLEWARE
const requireSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// REGISTER
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // VALIDATION
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required!",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be atleast 6 characters long!",
      });
    }

    // EXISTING USER
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "User already exists!",
      });
    }

    // HASHED PASSWORD
    const hashedPassword = await hashPassword(password);

    // SAVE USER
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res.status(201).send({
      success: true,
      message: "Registration Successfull please login!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // VALIDATIONS
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Please provide email and password",
      });
    }

    // CHECK IF THE EMAIL EXISTS IN DB
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    // MATCH PASSWORD
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // JWT TOKEN
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // UNDEFINE PASSWORD
    user.password = undefined;

    return res.status(200).send({
      success: true,
      message: "Successfully loged in",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login api",
      error,
    });
  }
};

// UPDATE USER
const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // FIND USER
    const user = await userModel.findOne({ email });

    // VALIDATE PASSWORD
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be atleast 6 characters long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;

    // UPDATED USER
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated please login!",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in user update API",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
};
