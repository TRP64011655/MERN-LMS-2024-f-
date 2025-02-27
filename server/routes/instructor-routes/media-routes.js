// const express = require("express");
// const multer = require("multer");
// const {
//   uploadMediaToCloudinary,
//   deleteMediaFromCloudinary,
// } = require("../../helpers/cloudinary");

// const router = express.Router();

// const upload = multer({
//   dest: "uploads/",
//   limits: { fileSize: 100 * 1024 * 1024 },  // Limit file size to 100MB
// });



// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const result = await uploadMediaToCloudinary(req.file.path);
//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error uploading file" });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "Assest Id is required",
//       });
//     }

//     await deleteMediaFromCloudinary(id);

//     res.status(200).json({
//       success: true,
//       message: "Assest deleted successfully from cloudinary",
//     });
//   } catch (e) {
//     console.log(e);

//     res.status(500).json({ success: false, message: "Error deleting file" });
//   }
// });

// router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
//   try {
//     const uploadPromises = req.files.map((fileItem) =>
//       uploadMediaToCloudinary(fileItem.path)
//     );

//     const results = await Promise.all(uploadPromises);

//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (event) {
//     console.log(event);

//     res
//       .status(500)
//       .json({ success: false, message: "Error in bulk uploading files" });
//   }
// });

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Set up multer for file upload with a 100MB size limit
const upload = multer({
  dest: "uploads/",  // Temporary upload folder
  limits: { fileSize: 100 * 1024 * 1024 },  // 100MB max file size
});

// Route for single file upload
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    console.log("No file uploaded!");
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  try {
    console.log("Uploading file to Cloudinary:", req.file.path);  // Log file path
    const result = await uploadMediaToCloudinary(req.file.path);  // Upload file to Cloudinary
    console.log("File uploaded successfully:", result);  // Log success

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log("Error during upload:", e);  // Log error
    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

// Route for deleting a file from Cloudinary
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Asset Id is required",
    });
  }

  try {
    const result = await deleteMediaFromCloudinary(id);  // Delete from Cloudinary
    console.log("File deleted from Cloudinary:", result);  // Log deletion success

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.log("Error deleting file from Cloudinary:", e);  // Log error
    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

// Route for bulk file upload
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)  // Upload each file to Cloudinary
    );

    const results = await Promise.all(uploadPromises);  // Wait for all files to upload
    console.log("Bulk upload successful:", results);  // Log success

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    console.log("Error in bulk file upload:", e);  // Log bulk upload error
    res.status(500).json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
