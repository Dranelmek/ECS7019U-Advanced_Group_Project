const router = require("express").Router();
const Pothole = require("../models/Pothole");
const mongoose = require("mongoose");

//Get all pothole
router.get("/", async (req, res) => {
  try {
    // Retrieve all potholes from the database
    const allPotholes = await Pothole.find(); 
    res.status(200).json(allPotholes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//create a new pothole
router.post("/addNewPothole", async (req, res) => {
  try {
    //create new pothole
    const newPothole = new Pothole({
      _id: new mongoose.Types.ObjectId(),
      location: req.body.location,
      video: req.body.video,
      image: req.body.image,
      severe_level: req.body.severe_level,
      repairment_needed: req.body.repairment_needed
    });

    //save user and respond
    const newPotholeDetail = await newPothole.save();
    res.status(200).json(newPotholeDetail);

  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

//get a pothole by id
router.get("/:id", async (req, res) => {
  try {
    const pothole = await Pothole.findById(req.params.id);
    res.status(200).json(pothole);
  } catch (err) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

// Delete a pothole
router.delete("/deletePothole/:id", async (req, res) => {
  try {
    const pothole = await Pothole.remove({_id: req.params.id});

    res.status(200).json("Deleted pothole!");
  } catch (err) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: err.message 
    });
  }
});

// Delete all potholes
router.delete("/deleteAllPotholes", async (req, res) => {
  try {
    // Deleting all users
    const result = await Pothole.deleteMany({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
