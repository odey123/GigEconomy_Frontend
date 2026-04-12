import { Router } from "express";
import multer from "multer";
import { validateRiderRegister, validateRiderLogin } from "../middleware/validate.middleware";
import { registerRider, riderLogin } from "../controllers/rider-auth.controller";

const router = Router();

// Memory storage — files are kept in RAM as Buffer objects and
// immediately streamed to Cloudinary (or saved locally in dev).
// Max 5 MB per file; only image MIME types are accepted.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are accepted for KYC documents."));
    }
  },
});

const kycUpload = upload.fields([
  { name: "idDocument",   maxCount: 1 },
  { name: "passportPhoto", maxCount: 1 },
]);

router.post(
  "/register",
  kycUpload,
  validateRiderRegister,
  registerRider,
);

router.post("/login", validateRiderLogin, riderLogin);

export default router;
