const router = require("express").Router();
const Pothole = require("../models/Pothole");
const geolib = require('geolib'); // Import geolib library for distance calculation
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

// Create a new pothole
router.post("/addNewPothole", async (req, res) => {
  try {
    const newLocationString = req.body.location;
    const newLocationArray = newLocationString.split(';'); // Split the string into latitude and longitude

    if (newLocationArray.length !== 2) {
      return res.status(400).json({ error: "Invalid location format." });
    }

    const newLocation = {
      latitude: parseFloat(newLocationArray[0].trim()), // Convert latitude to float
      longitude: parseFloat(newLocationArray[1].trim()) // Convert longitude to float
    };

    // Fetch existing pothole locations from the database
    const existingPotholes = await Pothole.find({}, 'location');

    // Check if the new location is close to any existing pothole
    const closePothole = existingPotholes.find(pothole => {
      if (!pothole.location) return false; // Check if location is defined
      const potholeLocationArray = pothole.location.split(';');
      if (potholeLocationArray.length !== 2) return false; // Check if location format is correct
      const potholeLatitude = parseFloat(potholeLocationArray[0].trim());
      const potholeLongitude = parseFloat(potholeLocationArray[1].trim());
      if (isNaN(potholeLatitude) || isNaN(potholeLongitude)) return false; // Check if latitude or longitude is valid
      const distance = geolib.getDistance(
        { latitude: potholeLatitude, longitude: potholeLongitude },
        newLocation
      );
      // Setting the distance threshold to <= 4 meters
      return distance <= 4;
    });

    if (closePothole) {
      // Return a response indicating that the location is close to an existing pothole
      return res.status(400).json({ error: "Location is too close to an existing pothole." });
    }

    // If the location is not close to any existing pothole, create a new one
    const newPothole = new Pothole({
      _id: new mongoose.Types.ObjectId(),
      location: newLocationString,
      video: req.body.video,
      image: req.body.image,
      severe_level: req.body.severe_level,
      repairment_needed: req.body.repairment_needed
    });

    // Save the new pothole and respond
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

// Get a pothole by id
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
