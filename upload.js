// upload.js
const multer = require("multer");
const { storage } = require("./cloudinary"); // Correctly import the Cloudinary storage configuration

// Initialize Multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
