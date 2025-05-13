//server/src/middlewares/upload.middleware.js
import multer from 'multer';
import AppError from '../utils/appError.js';
import path from 'path';
import fs from 'fs';

// Create storage configuration
const createStorage = (subfolder) => {
  const uploadPath = path.join('./uploads', subfolder);
  
  // Ensure directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, filename);
    }
  });
};

// File filter for images
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed!', 400), false);
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('application/pdf') || 
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new AppError('Only document files are allowed!', 400), false);
  }
};

// Configure uploads
const userUpload = multer({
  storage: createStorage('users'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const driverUpload = multer({
  storage: createStorage('drivers'),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const documentUpload = multer({
  storage: createStorage('documents'),
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 } 
});
const disputeUpload = multer({
  storage: createStorage('disputes'), 
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new AppError('Invalid file type for dispute attachment.', 400), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const uploadUserPhoto = userUpload.single('profilePicture');
export const uploadDriverPhoto = driverUpload.single('driverPic');
export const uploadDocuments = documentUpload.array('documents', 5); // Max 5 files
export const uploadDisputeAttachment = disputeUpload.single('attachment');
