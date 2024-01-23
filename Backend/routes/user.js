const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

//Get all users 
router.get("/allUsers", async (req, res) => {
  try {
    // Retrieve all users from the database
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

// Add new councils' staff
router.post("/addStaff", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      password: hashedPassword,
      user_first_name: req.body.user_first_name,
      user_last_name: req.body.user_last_name,
      email: req.body.email
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(newUser);

  } catch (err) {
    if (err.code === 11000) {
      const field = err.message.split('index: ')[1].split('_')[0];

      // Duplicate key error handling accordingly
      if (field === 'username') {
        res.status(400).json('Username already exists');
      } else if (field === 'email') {
        res.status(401).json('Email already being used' );
      } else {
        res.status(402).json('Duplicate key error, please double check your fields');
      }
    } else {
      // Other error handle accordingly
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find the user with the username user inputted
    const user = await User.findOne({ username: req.body.username });

    // If email is not found, return status 401
    if (!user) {
      return res.status(401).json("Email not found");
    }

    // Use the bcrypt library to compare the password in the request body to the hashed password stored in the database
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    // If doesn't match, return status 401
    if (!validPassword) {
      return res.status(401).json("Wrong Password");
    }

    // If everything is correct, then it will return 200
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a user
router.delete("/deleteUser/:username", async (req, res) => {
  try {
    // Delete a user by their username
    const user = await User.remove({username: req.params.username});

    res.status(200).json("Deleted user!");
  } catch (err) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

// Delete all users
router.delete("/deleteAllUsers", async (req, res) => {
  try {
    // Deleting all users
    const result = await User.deleteMany({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
