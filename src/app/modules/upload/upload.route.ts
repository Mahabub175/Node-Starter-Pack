import express, { Request, Response } from "express";
import { uploadService } from "./upload";
import config from "../../config";

const router = express.Router();

router.post(
  "/upload",
  uploadService.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const filePath = req.file.path.replace(/\\/g, "/");

      const fileUrl = `${config.base_url}/${filePath}`;

      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        file: {
          ...req.file,
          url: fileUrl,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to upload file",
        error: error.message,
      });
    }
  }
);

export const uploadRoutes = router;
