import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" })); //accepting the json and limit
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url
app.use(express.static("public")); //public folder for image and favicon
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/users", userRouter);

export { app };
