const express = require("express");
const app = express();
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const user = require("./routes/user");
const pothole = require("./routes/pothole");
const path = require("path");
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require("multer");
const mime = require("mime-types");
dotenv.config();


mongoose.connect(
  `mongodb://localhost:27017/groupProject`, // Use this for running the testing code or local database
  // `mongodb+srv://group2:group2@cluster0.es1jknu.mongodb.net/`, // Cloud database
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

app.use("/images", express.static(path.join(__dirname, "public/images")));

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

const storage = new GridFsStorage({
  url: `mongodb://localhost:27017/groupProject`, // Use this for running the testing code or local database
  // url: `mongodb+srv://group2:group2@cluster0.es1jknu.mongodb.net/`, // Cloud database
  options: { useNewUrlParser: true, useUnifiedTopology: true }, // MongoDB connection options
  // Define how files will be stored
  file: (req, file) => {
    const fileInfo = {
      filename: file.originalname, // Store original filename
      bucketName: "uploads", // Bucket name for file storage
      contentType: file.mimetype, // Store file content type (e.g., image/jpeg, video/mp4)
    };
    return fileInfo; // Return file information
  },
});

// Set up multer for handling file uploads
const upload = multer({ 
  storage: storage, // Use the storage configuration defined above
  // Define a file filter to allow only images or videos to be uploaded
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      // If the file is an image or video, accept it
      cb(null, true);
    } else {
      // If the file is not an image or video, reject it
      cb(new Error("Please upload only images or videos."));
    }
  },
}).fields([
  { name: "image", maxCount: 1 }, // Define the field name for uploaded files and maximum file count
  { name: "video", maxCount: 1 }, // Define the field name for uploaded videos and maximum file count
]);

// Route for handling file uploads
app.post("/api/upload", (req, res) => {
  // Call the upload function to handle file upload
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // If multer encounters an error, return a 500 error response
      return res.status(500).json({ message: "Failed to upload files" });

    } else if (err) {
      // If there's any other error, return a 404 error response
      console.log(err);
      return res.status(404).json({ message: err.message });
    }
    // If upload is successful, access the uploaded files information from req.files
    const uploadedFiles = req.files;

    // Return a 200 success response along with uploaded files information
    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  });
});

// Access the MongoDB connection instance
const db = mongoose.connection;

let uploadsBucket;

// Once the MongoDB connection is connected, create a GridFSBucket for storing and retrieving files
db.once("open", () => {
  uploadsBucket = new mongoose.mongo.GridFSBucket(db.db, {
    bucketName: "uploads" // Specify the bucket name as "uploads"
  });
});

// Route for downloading files by filename
app.get('/api/file/:filename', (req, res) => {
  // Extract the filename from the request parameters
  const filename = req.params.filename;

  // Open a download stream for the specified filename from the uploads bucket
  const downloadStream = uploadsBucket.openDownloadStreamByName(filename);

  // Set the content type header based on the file extension
  const contentType = mime.lookup(filename);
  res.set('Content-Type', contentType);

  // Stream data chunks from the download stream to the response
  downloadStream.on('data', chunk => {
    res.write(chunk); // Write data chunk to the response
  });

  // When the download stream ends, end the response
  downloadStream.on('end', () => {
    res.end(); // End the response
  });

  // If an error occurs during the download stream, send a 404 response
  downloadStream.on('error', error => {
    res.sendStatus(404); 
  });
});

// Define a route for the root endpoint ("/") and provide a welcome message
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pothole Detection App!" }); 
});

// Mount the pothole router at the "/pothole" endpoint
app.use("/pothole", pothole);

// Mount the user router at the "/user" endpoint
app.use("/user", user);

// Start the server on port 8800 and log a message once it's running
const server = app.listen(8800, () => {
  console.log("Backend server is running!"); // Log a message indicating the server is running
});

// Export the server instance for external usage 
module.exports = server;
