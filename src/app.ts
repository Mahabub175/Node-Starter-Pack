import express, { Application, Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import router from "./app/routes";
import path from "path";

const app: Application = express();

app.use(express.json());

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

const uploadsPath = path.resolve("uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//api routes
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
