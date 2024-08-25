import express, { Request, Response, NextFunction } from "express";
import { upload } from "./upload";

const router = express.Router();

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
});

export const uploadRoutes = router;
