const router = require('express').Router();
const { unlink } = require('fs')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config()

const upload = multer({ dest: './_temp' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

router.post('/upload', upload.single('myFile'), async (req, res) => {
    // console.log(req.body); // req.body will hold the text fields appended to your formData object
    // console.log(req.file); // req.file is the name of your file in the form above, here 'uploaded_file'
    const { file: { filename, destination } } = req;
    const pathToFile = `${destination}/${filename}`;
    try {
        const { url } = await cloudinary.uploader.upload(pathToFile,
            {
                resource_type: "image",
                public_id: 'cloudinary-sandbox-demo', // folder name to store in cloudinary 
            }, (error) => console.error(error)
        )
        res.json(url);
        unlink(pathToFile, (error) => console.error(error))
    } catch (error) {
        console.error(error);
        res.json({ msg: 'failure' })
    }
});

module.exports = router;
