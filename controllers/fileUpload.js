// controllers/fileUpload.js
const File = require('../models/File'); // Correct path to your File model
const cloudinary = require("cloudinary").v2;


// localfileupload -> handler function 

exports.localFileUpload = async (req, res) => {
    try {

        // fetch filefrom request
        const file = req.files.file;
        console.log(file);

        // create path where file need to be saved on server  
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log(path);

        // add path to move function 
        file.mv(path, (err) => {
            console.log(err);   
        });

        // create a successfull response
        
        res.json({
            success: true,
            message: 'Local file uploaded successfully',
        });
        
    } catch (err) {
        console.log("Not able to upload on the  file server")
        console.log(err);
    }
};


//image upload on cloudinary

function isFileSupported(fileType, supportedTypes){
    return supportedTypes.includes(fileType);
}

async function uploadFileToCloudinary(file, folder, quality){
    const options = {folder};
    options.resource_type = "auto";
    if(quality){
        options.quality = quality;
    }
   return await cloudinary.uploader.upload(file.tempFilePath, options);
}


async function isLargeFile(fileSize){
    const mbSize = fileSize / (1024  * 1024);

    console.log(mbSize);
    return mbSize  > 5;
}


exports.imageUpload = async (req,res) => {
    try{
        // data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        // validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
  

        if(!isFileSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: 'file format is not supported',
            });
        }
        const response = await uploadFileToCloudinary(file, "SamplesCloudinary");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            ImageUrl :  response.secure_url,
        }) 

        res.json({
            success: true,
            imageUrl : response.secure_url,
            message: "Image successfully uploaded ",  
        })


    }
    catch(err){
        console.log(err);
        res.status(400).json({
            status: false,
            message : "Something went wrong",
        })
    }
}

// video upload
exports.VideoUpload = async (req,res) => {
    try{
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        
        //validation  AVI, WMV, MKV, FLV, and WebM
        const supportedTypes = ["mp4", "mpov", "mp3", "avi", "wmv", "mkv", "flv", "webm"]; // lowercase for consistency
        const fileType = file.name.split('.').pop().toLowerCase();
        
        if(!isFileSupported(fileType, supportedTypes)){  // Fixed parameter order
            return res.status(400).json({
                success:false,
                message:"File format is not supported",
            })
        }

        // add upper limit of 5MB for video 
        const fileSize = file.size;  // Fixed - size is a property, not method
        if(isLargeFile(fileSize)){  // Removed the ! operator
            return res.status(400).json({
                success:false,
                message: "File size exceeds limit (5MB)",
            })
        };

        // file and format is supporting
        const response = await uploadFileToCloudinary(file, "SamplesCloudinary");

        const fileData = await File.create({
            name,
            tags,
            email,
            VideoUrl: response.secure_url,
        }) 

        res.json({
            success: true,
            videoUrl: response.secure_url,  // Changed field name to videoUrl
            message: "Video successfully uploaded",  // Changed message
        })

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

exports.imageSizeRouter = async(req, res) => {
    try{
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        
        //validation  AVI, WMV, MKV, FLV, and WebM
        const supportedTypes = ["jpg", "jpeg", "png"]; // lowercase for consistency
        const fileType = file.name.split('.').pop().toLowerCase();
        
        if(!isFileSupported(fileType, supportedTypes)){  // Fixed parameter order
            return res.status(400).json({
                success:false,
                message:"File format is not supported",
            })
        }

       

        // file and format is supporting
        const response = await uploadFileToCloudinary(file, "SamplesCloudinary", 90);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        }) 

        res.json({
            success: true,
            imageUrl: response.secure_url,  // Changed field name to videoUrl
            message: "image successfully uploaded",  // Changed message
        })


    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        })
    }
}