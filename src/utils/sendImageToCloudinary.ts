import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import AppError from '../errors/appError';
import httpStatus from 'http-status';

export const sendImageToCloudinary = async (path: string, imgName: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDE_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imgName,
    });

    // Delete the file from the uploads folder after successful upload
    fs.unlink(path, (err) => {
      if (err) {
        console.error(`Failed to delete local file: ${err}`);
      } else {
        console.log(`Successfully deleted local file: ${path}`);
      }
    });

    return uploadResult;
  } catch (error) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to upload image to Cloudinary'
    );
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
