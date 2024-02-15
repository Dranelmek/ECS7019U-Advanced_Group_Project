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
  // `mongodb+srv://group2:group2@cluster0.es1jknu.mongodb.net/`,
  process.env.MONGO_URL,
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
  url: process.env.MONGO_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const fileInfo = {
      filename: file.originalname,
      bucketName: "uploads",
      contentType: file.mimetype,
    };

    return fileInfo;
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload only images or videos."));
    }
  },
}).fields([
  { name: "files", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

app.post("/api/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(500).json({ message: "Failed to upload files" });
    } else if (err) {
      console.error(err);
      return res.status(404).json({ message: err.message });
    }
    // Access the uploaded files information from req.files
    const uploadedFiles = req.files;

    return res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  });
});

const db = mongoose.connection;
let uploadsBucket;

db.once("open", () => {
  uploadsBucket = new mongoose.mongo.GridFSBucket(db.db, {
    bucketName: "uploads"
  });
});

app.get('/api/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const downloadStream = uploadsBucket.openDownloadStreamByName(filename);

  // Set the content type header based on the file extension
  const contentType = mime.lookup(filename);
  res.set('Content-Type', contentType);

  downloadStream.on('data', chunk => {
    res.write(chunk);
  });

  downloadStream.on('end', () => {
    res.end();
  });

  downloadStream.on('error', error => {
    console.error(error);
    res.sendStatus(404);
  });
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
