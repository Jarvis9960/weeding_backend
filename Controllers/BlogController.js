import path from "path";
import BlogModel from "../Models/BlogModel.js";
import sharp from "sharp";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
let fileName = fileURLToPath(import.meta.url);
let __dirname = dirname(fileName);

export const createBlog = async (req, res) => {
  try {
    const imageFile = req.file;
    const details = req.body.details;

    if (!imageFile || !details) {
      return res.status(422).json({
        status: false,
        message: "Please provide all the requested fields properly",
      });
    }

    const extension = req.file.originalname.split(".").pop().toLowerCase();

    let compressedImageBuffer;
    if (extension === "png") {
      compressedImageBuffer = await sharp(imageFile.path)
        .resize(1024)
        .png({ quality: 90 }) // Set the desired PNG compression quality
        .toBuffer();
    } else if (extension === "jpeg" || extension === "jpg") {
      compressedImageBuffer = await sharp(imageFile.path)
        .resize(1024)
        .jpeg({ quality: 90 }) // Set the desired JPEG compression quality
        .toBuffer();
    } else {
      return res.status(422).json({
        status: false,
        message:
          "Invalid file extension. Only .png and .jpeg files are allowed.",
      });
    }

    const originalDestinationPath = path.join(
      __dirname,
      "../public/uploads",
      imageFile.filename
    );

    const compressedDestinationPath = path.join(
      __dirname,
      "../public/compressed",
      imageFile.filename
    );

    // Write the original image to the original destination path
    fs.writeFileSync(originalDestinationPath, fs.readFileSync(imageFile.path));

    // Write the compressed image buffer to the destination path
    fs.writeFileSync(compressedDestinationPath, compressedImageBuffer);

    // Remove the original file
    fs.unlinkSync(imageFile.path);

    const newBlog = new BlogModel({
      ImagePath: compressedDestinationPath,
      Details: details,
    });

    const savedResponse = await newBlog.save();

    if (savedResponse) {
      return res
        .status(201)
        .json({ status: true, message: "Blog successfully created" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const limit = 10;
    const page = req.query.page || 1;

    const totalCount = await BlogModel.find({}).countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    const savedBlog = await BlogModel.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    if (savedBlog.length < 1) {
      return res
        .status(404)
        .json({ status: true, message: "No blog are present" });
    }

    return res.status(202).json({
      status: true,
      message: "successfully fetched blogs",
      savedBlog,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "something went wrong", err: error });
  }
};
