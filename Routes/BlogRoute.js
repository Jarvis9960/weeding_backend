import express from "express";
const router = express.Router();
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { createBlog, getAllBlog } from "../Controllers/BlogController.js";
let fileName = fileURLToPath(import.meta.url);
let __dirname = dirname(fileName);
import { tokenCheck } from "../Middlewares/tokenCheck.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!"); // custom this message to fit your needs
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/createBlog", tokenCheck, upload.single("Image"), createBlog);
router.get("/getallblog", getAllBlog);

export default router;
