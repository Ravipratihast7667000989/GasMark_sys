require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://ravipratihast71:LCtQ1SB82Dr5ITu3@cluster0.hkwcuwh.mongodb.net/Image')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'de6tw9ooe',
  api_key: '788868226827735',
  api_secret: 'DF1S8PgX2YXbYKDfAtE9MN945r4',
});

// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Define a simple Mongoose schema
const ImageSchema = new mongoose.Schema({
  url: String,
  public_id: String,
});

const Image = mongoose.model("Image", ImageSchema);

// API routes
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { path, filename } = req.file;
    const newImage = await Image.create({ url: path, public_id: filename });
    res.status(200).json({ message: "Image uploaded successfully", data: newImage });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running`));
