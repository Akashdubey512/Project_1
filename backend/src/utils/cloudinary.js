import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
let isConfigured = false;
const configureCloudinary = () => {
  if (isConfigured) return;
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isConfigured = true;
  console.log(" Cloudinary configured successfully");
  return true;
};
const uploadOnCloudinary = async (localFilePath, resourceType = "image") => {
  if (!localFilePath) return null;

  try {
    if (!isConfigured) configureCloudinary();

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    return null;
  } finally {
    // guaranteed cleanup (non-blocking)
    try {
      await fs.unlink(localFilePath);
    } catch {
      // ignore cleanup errors
    }
  }
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  try {
    if (!isConfigured) configureCloudinary();

    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };