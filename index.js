import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
let fileName = fileURLToPath(import.meta.url);
let __dirname = dirname(fileName);
import cors from "cors";
import connectDb from "./Database/connectDB.js";
dotenv.config({ path: path.resolve(__dirname + "/config.env") });
import cookieParser from "cookie-parser";
import blogRoute from "./Routes/BlogRoute.js";
import authRoute from "./Routes/AuthRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());

// database connection function
connectDb()
  .then((res) => {
    console.log("connection to database is successfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api", blogRoute);
app.use("/api", authRoute);

// app to listen on port function
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
