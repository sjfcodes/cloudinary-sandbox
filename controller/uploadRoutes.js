const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config()

const upload = multer({ dest: './public/data/uploads' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

router.post('/upload', upload.single('myFile'), (req, res) => {
    console.log(req.body); // req.body will hold the text fields appended to your formData object
    console.log(req.file); // req.file is the name of your file in the form above, here 'uploaded_file'

    const { file: { filename, destination } } = req;
    const pathToFile = `${destination}/${filename}`;

    cloudinary.uploader.upload(pathToFile,
        {
            resource_type: "image",
            public_id: 'cloudinary-sandbox-demo', // folder name to store in cloudinary 
        }, (error, result) => console.log(result, error)
    )
        .then(data => {
            console.log(data);
            res.json(data.url);
        })
        .catch(error => {
            console.error(error);
            res.json({ msg: 'failure' })
        });
});

module.exports = router;
