// const cloudinary = require("cloudinary").v2;

// //configure with env data
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadMediaToCloudinary = async (filePath) => {
//   try {
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "auto",
//     });

//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error("Error uploading to cloudinary");
//   }
// };

// const deleteMediaFromCloudinary = async (publicId) => {
//   try {
//     await cloudinary.uploader.destroy(publicId);
//   } catch (error) {
//     console.log(error);
//     throw new Error("failed to delete assest from cloudinary");
//   }
// };

// module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload media to Cloudinary
const uploadMediaToCloudinary = async (filePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        console.log("Cloudinary upload error:", error);  // Log detailed Cloudinary error
        reject(error);
      }
      fs.unlinkSync(filePath);  // Delete local file after successful upload
      resolve(result);
    });
  });
};

// Function to delete media from Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.log("Cloudinary delete error:", error);  // Log detailed delete error
        reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
};
