const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const user = require("./routes/user");
const pothole = require("./routes/pothole");
dotenv.config();


mongoose.connect(
  `mongosh mongodb://ec20909:1eAAV3LF@ec20909-mongodb-0.ec20909-mongodb-svc.database-systems-ec20909.svc.cluster.local:27017/admin`,
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    socketTimeoutMS: 1200000,
    connectTimeoutMS: 1200000,
    bufferMaxEntries: 0,
    poolSize: 100,
  },
  () => {
    console.log("Connected to MongoDB");
  }
);


//middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use(helmet());
app.use(morgan("common"));

// Add the following middleware to enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pothole detection App" });
});

app.use("/pothole", pothole);
app.use("/user", user);

app.listen(8800, () => {
  console.log("Backend server is running!");
});

module.exports = app;
