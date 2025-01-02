// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary using environment variables (or hardcoded if necessary)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dvt6ydqgt", // Your Cloudinary Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY || "293241237865216", // Your Cloudinary API Key
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "d5XeqCmfJ7f6mbcJldNk4REBfTs", // Your Cloudinary API Secret
});

// Set up Multer Storage to upload directly to Cloudinary
const storage1 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // All uploaded files will be stored in this folder
    format: async (req, file) => "png", // You can change this to 'jpeg', 'jpg', etc.
    public_id: (req, file) => file.originalname.split(".")[0], // Use the original file name without extension
  },
});
const storage2 = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "receipt", // All uploaded files will be stored in this folder
    format: async (req, file) => "png", // You can change this to 'jpeg', 'jpg', etc.
    public_id: (req, file) => file.originalname.split(".")[0], // Use the original file name without extension
  },
});

module.exports = { cloudinary, storage1, storage2 };
