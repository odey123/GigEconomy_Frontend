import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// Cloudinary is configured automatically from env vars:
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isCloudinaryConfigured = (): boolean =>
  !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

/**
 * Saves a file buffer to local disk (development fallback).
 * Files are stored at /uploads/<folder>/<filename>.
 * Returns a server-relative URL path.
 */
const saveLocally = (
  buffer: Buffer,
  originalName: string,
  folder: string,
): string => {
  const uploadsDir = path.join(process.cwd(), "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const ext = path.extname(originalName) || ".jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadsDir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${folder}/${filename}`;
};

/**
 * Uploads a file buffer to Cloudinary.
 * Returns the permanent secure URL.
 */
const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "raw" = "image",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `eco-routes/${folder}`, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    uploadStream.end(buffer);
  });
};

export interface UploadResult {
  url: string;
  provider: "cloudinary" | "local";
}

/**
 * Uploads a file to the configured storage provider.
 * Uses Cloudinary in production, local disk in development.
 */
export const uploadFile = async (
  buffer: Buffer,
  originalName: string,
  folder: string,
  resourceType: "image" | "raw" = "image",
): Promise<UploadResult> => {
  if (isCloudinaryConfigured()) {
    const url = await uploadToCloudinary(buffer, folder, resourceType);
    return { url, provider: "cloudinary" };
  }

  // Development fallback — save to local disk
  console.warn(
    "[upload] Cloudinary not configured. Saving file locally. Set CLOUDINARY_* env vars for production.",
  );
  const url = saveLocally(buffer, originalName, folder);
  return { url, provider: "local" };
};
