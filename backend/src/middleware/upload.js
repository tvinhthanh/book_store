const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage configuration
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "uploads",
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading image to Cloudinary:", error);
          reject(error);
        } else {
          console.log("Image uploaded successfully:", result);
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToCloudinary };
