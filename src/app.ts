import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";

const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        callback(null, origin);
      } else {
        callback(null, "*");
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const uploadsPath = path.resolve("uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

app.use("/uploads", express.static(uploadsPath));

// API routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    status: "connected",
    message: "Welcome to Your Secured Server!",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
