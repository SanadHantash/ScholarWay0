const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
require("dotenv").config();



const register = async (req, res) => {
  const { username, email, password,role_id } =
    req.body;

  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .custom((value, helpers) => {
        if (!value.endsWith("@gmail.com")) {
          return helpers.error("any.custom", {
            message: "Email must be a Gmail address",
          });
        }
        return value;
      }),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$%&])[a-zA-Z\d@#!$%&]{8,}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          "Invalid password format. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one of @, #, !, $, %, or &.",
      })
    
  });

  const { error } = schema.validate({
    username,
    email,
    password,
    
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  try {
    await User.checkUserExistence(email, username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.register(
  
      username,
      email,
      hashedPassword,
      role_id
    );
    console.log("id:"+user.id);
    console.log("role:"+user.role);
    console.log("role_id:"+user.role_id);
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role_id, 
      },
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    res.cookie("token", token);
    console.log(token);
    res
      .status(201)
      .json({ success: true, message: "User added successfully", token, user });
  } catch (err) {
    console.error(err);
    if (
      err.message === "invalid email" ||
      err.message === "invalid username" 
   
    ) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      res
        .status(500)
        .json({ success: false, error: "User registration failed" });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email);

    if (!user || user.is_deleted || !user.password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

const role = user.role;
console.log(role);
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },

     
      process.env.SECRET_KEY,
      { expiresIn: "4h" }
    );
    res.cookie("token", token, { httpOnly: true });
    res
      .status(200)
      .json({ success: true, message: "Successfully signed in", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};






module.exports = {
  register,
  login
};
