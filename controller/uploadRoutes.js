const router = require('express').Router();
const { unlink } = require('fs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

const upload = multer({ dest: './utils/_temp-image-store' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

router.post('/upload', upload.single('myFile'), async ({ body, file }, res) => {
    // console.log(req.body); // req.body will hold the text fields appended to your formData object
    // console.log(req.file); // req.file is the name of your file in the form above, here 'uploaded_file'
    const { filename, destination } = file;
    const pathToFile = `${destination}/${filename}`;
    try {
        const { url } = await cloudinary.uploader
            .upload(pathToFile, {
                resource_type: "image",
                public_id: 'cloudinary-sandbox-demo', // folder name to store in cloudinary 
            },
                (error) => {
                    if (error) console.error(error)
                }
            );

        /**
         * the resourse is now hosted, send back the url to user.
         * if you'd like to save the url to a db, do this here
         */

        res.json({ ...body, url }); // respond with url and  inital request body
        // delete file from utils/_temp-image-store folder 
        unlink(pathToFile, (error) => {
            if (error) console.error(error)
        });
    } catch (error) {
        console.error(error);
        res.json({ msg: 'failure' });
    }
});

module.exports = router;
