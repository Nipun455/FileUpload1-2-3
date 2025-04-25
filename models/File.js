const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const fileSchema = new  mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    tags:{
        type: String,
        required: false,
    }, 
    imageUrl:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    }
})

fileSchema.post("save", async function(doc) {
    try{
        console.log("Doc", doc);

        let transporter = nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS,
            },
        })

        let info = await transporter.sendMail({
                
            from: `singhnipunkumarl@gmail.com`,
            to : doc.email,
            subject:  "New file is uploaded in cloudinary",
            html: `<h1>Hello jee </h1> <p> File uploaded      <a href="${doc.imageUrl}">${doc.imageUrl}</a></p> `
        })



    }
    catch(error){
        console.error(error);
    }
} )

const File = mongoose.model("File", fileSchema);
module.exports = File;


