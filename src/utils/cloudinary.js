import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
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
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Configure on first upload attempt
    if (!isConfigured) {
      const configured = configureCloudinary();
      if (!configured) {
        throw new Error("Cloudinary not configured. Check environment variables.");
      }
    }
    if (!localFilePath) {
      console.log(" No local file path provided");
      return null;
    }
    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      console.log(` File does not exist: ${localFilePath}`);
      return null;
    }  
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // Delete local file after upload
    try {
      fs.unlinkSync(localFilePath);
      console.log(` Deleted local file: ${localFilePath}`);
    } catch (unlinkError) {
      console.error(`⚠️ Failed to delete local file: ${unlinkError.message}`);
    }
    console.log(`Uploaded to Cloudinary: ${result.url}`);
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    // Clean up local file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      try {
        fs.unlinkSync(localFilePath);
        console.log(`Cleaned up local file after failed upload: ${localFilePath}`);
      } catch (unlinkError) {
        console.error(`Failed to clean up local file: ${unlinkError.message}`);
      }
    }
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if(!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);
  }
}
export { uploadOnCloudinary, deleteFromCloudinary };