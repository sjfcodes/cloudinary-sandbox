const router = require('express').Router();
const { unlink } = require('fs');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

const upload = multer({ dest: './utils/_temp-file-store' });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const auth = (req, res, next) => {
    if (req.headers.authorization.substring(7) === process.env.SERVER_PW) return next()
    res.status(401).json({ message: 'unauthorized' })
}

router.post('/upload', auth, upload.single('myFile'), async ({ body, file }, res) => {
    try {
        // console.log(body); // body will hold the text fields appended to your formData object
        // console.log(file); // file is the name of your file in the form above, here 'uploaded_file'
        console.log(file)
        const { filename, destination, mimetype } = file;
        const pathToFile = `${destination}/${filename}`;
        // https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
        const data = await cloudinary.uploader
            .upload(pathToFile, {
                // mime type starts with 'image' || 'video'|| 'auido'
                resource_type: mimetype.split('/')[0] === 'image' ? 'image' : 'video',
                public_id: 'cloudinary-sandbox-demo', // folder name to store in cloudinary 
            },
                (error) => {
                    if (error) console.error(error)
                }
            );
        console.log(data)

        const httpsUrl = `https://${data.url.split('://')[1]}` // convert http to https

        /**
         * the resourse is now hosted, send back the url to user.
         * if you'd like to save the url to a db, do this here
         */

        res.json({ ...body, url: httpsUrl, mimetype }); // respond with url and  inital request body
        // delete file from utils/_temp-file-store folder 
        unlink(pathToFile, (error) => {
            if (error) console.error(error)
        });
    } catch (error) {
        console.error(error);
        res.json({ msg: 'failure' });
    }
});

module.exports = router;
