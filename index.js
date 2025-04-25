// App create
const express = require("express");
const app = express();

// Load environment variables
require("dotenv").config();
const Port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
const fileupload = require("express-fileupload");  
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/temp'
}));   // to upload the file on the server

// Connect to the database
const db = require("./config/database");
db.connect();

// Connect to Cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnects();

// API route mount
const Upload = require("./routes/FileUpload"); // Ensure this matches the actual file name
app.use("/api/v1/upload", Upload);

// Start the server
app.listen(Port, () => {
    console.log(`App is running successfully on port ${Port}`);
});
