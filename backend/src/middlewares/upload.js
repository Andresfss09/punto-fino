const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { sendError } = require('../utils/helpers');

// Multer memory storage
const storage = multer.memoryStorage();

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten imágenes (jpeg, jpg, png, webp).'), false);
  }
};

// Upload avatar middleware (5MB limit)
exports.uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
}).single('avatar');

// Upload portfolio middleware (10MB limit, multiple files)
exports.uploadPortfolio = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
}).array('images', 5); // Allow up to 5 images

// Helper to upload a buffer to Cloudinary
exports.uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};
