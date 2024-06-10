const Profile = require("../Models/userprofileModel");
const User = require("../Models/userModel");
const Joi = require("joi");
const bcrypt = require("bcrypt");


const userinfo = async (req, res) => {
  try {
    const userID = req.user.userId;
    const userRole =req.user.role;

    if (userRole === "sitter") {
      const userID = req.user.userId
      const info = await Profile.usersitterinfo(userID);
      res.status(201).json({ success: true, info });
  } 
   else {
    const info = await Profile.userinfo(userID);
    res.status(200).json({ success: true, info });
  }
   
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, error: "Error in getting user info" });
  }
};




const updateinfo = async (req, res) => {

  const userID = req.user.userId;

  const {username, email} = req.body;

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
      })
  });

  const { error } = schema.validate({
    username,
    email
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  try {
    if (email || username  ) {
      await Profile.checkUserExistence(email, username);
    }

    await Profile.updateinfo(
      userID,
      username,
      email
      
    );

    res
      .status(201)
      .json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    if (
      err.message === "invalid email" ||
      err.message === "invalid username" 
    ) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      res.status(500).json({ success: false, error: "User updated failed" });
    }
  }
};

const updatepassword = async (req, res) => {
  
  try {
    
    const userID = req.user.userId;
    const email = req.user.email;
    const { oldpassword, newpassword } = req.body;

    const user = await User.login(email);

    if (!user || !user.password) {
      return res
        .status(401)
        .json({ success: false, error: "User or password not found." });
    }

    const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Incorrect old password." });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await Profile.updatepassword(userID, hashedPassword);

    res.status(200).json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

const mycourses = async (req, res, next) => {
  try {
    const userID = req.user.userId;
    const courses = await Profile.mycourses(userID);
    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error in getting courses" });
  }
};


module.exports = {
  userinfo,
  updateinfo,
  updatepassword,
  mycourses
};
