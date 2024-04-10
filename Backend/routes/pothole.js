const router = require("express").Router();
const Pothole = require("../models/Pothole");
const geolib = require('geolib'); // Import geolib library for distance calculation
const mongoose = require("mongoose");
const axios = require('axios');

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
    const newLocationString = req.body.coordinates;
    const newLocationArray = newLocationString.split(';'); // Split the string into latitude and longitude
    if (newLocationArray.length !== 2) {
      return res.status(400).json({ error: "Invalid coordinates format." });
    }

    const newLocation = {
      latitude: parseFloat(newLocationArray[0].trim()), // Convert latitude to float
      longitude: parseFloat(newLocationArray[1].trim()) // Convert longitude to float
    };

    // Reverse geocoding to get address from coordinates
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.latitude}&lon=${newLocation.longitude}`);
    const addressData = response.data;
    const fullAddress = `${addressData.address.road}, ${addressData.address.postcode}`;

    // Fetch existing pothole locations from the database
    const existingPotholes = await Pothole.find({}, 'coordinates');

    // Check if the new coordinates is close to any existing pothole
    const closePothole = existingPotholes.find(pothole => {
      if (!pothole.coordinates) return false; // Check if coordinates is defined
      const potholeLocationArray = pothole.coordinates.split(';');
      if (potholeLocationArray.length !== 2) return false; // Check if coordinates format is correct
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
      // Return a response indicating that the coordinates is close to an existing pothole
      return res.status(400).json({ error: "Location is too close to an existing pothole." });
    }

    // If the coordinates is not close to any existing pothole, create a new one
    const newPothole = new Pothole({
      _id: new mongoose.Types.ObjectId(),
      coordinates: newLocationString,
      address: fullAddress,
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
    const pothole = await Pothole.deleteOne({_id: req.params.id});

    res.status(200).json({ message: "Pothole deleted successfully." });
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
    res.status(200).json({ message: "All potholes deleted successfully." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
