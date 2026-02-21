import { Router } from "express";

const router = Router();

// Example route (you can change later)
router.get("/", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Client routes working",
  });
});

export default router;
