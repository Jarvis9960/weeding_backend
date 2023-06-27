import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  ImagePath: {
    type: String,
    required: true,
  },
  Details: {
    type: String,
    required: true,
  },
});

const BlogModel = mongoose.model("Blog", blogSchema);

export default BlogModel;