const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = require("../schemas/userSchema");

//creating Data model
const User = new mongoose.model("User", userSchema);

//SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: "Signup was successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Signup was not successful",
    });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword =await bcrypt.compare(
        req.body.password,
        user[0].password
      );

      if (isValidPassword) {
        //generate token
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          accessToken: token,
          message: "Login Successful",
        });
      } else {
        res.status(401).json({
          error: "Authentication failed",
        });
      }
    } else {
      res.status(401).json({
        error: "Authentication failed",
      });
    }
  } catch (error) {
    res.status(401).json({
        error: "Authentication failed",
      });
    }
});

//GET ALL USERS
router.get('/all', async(req, res) =>{
    try {
        const user = await User.find({})
        .populate('todos')
        res.status(200).json({
            data: user,
            message: 'All user fetched successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: 'there was an error on the server side'
        })
    }
})

module.exports = router;
