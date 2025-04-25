const express = require('express');
const router = express.Router('router');

const {localFileUpload, imageUpload , VideoUpload, imageSizeRouter} = require('../controllers/fileUpload');

// API ROUTE

router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/VideoUpload", VideoUpload);
router.post("/imageSizeRouter", imageSizeRouter);



module.exports = router;
