const router = require('express').Router();
const multer = require('multer');
// https://www.npmjs.com/package/multer


const upload = multer({ dest: './public/data/uploads' });
/**
 * simple file upload
 * 
 * * * * * * * *
 *    myFile   * ---> key used to extract file from FormData object set from the client
 * * * * * * * *
 */
router.post('/upload', upload.single('myFile'), function (req, res) {

    // req.body will hold the text fields, if there were any 
    console.log(req.body);
    // req.file is the name of your file in the form above, here 'uploaded_file'
    console.log(req.file);

    res.json({ msg: 'success' })
});



// /**
//  * optional - setup multer disk Storage to control file name
//  */
// var { extname } = require('path');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/data/uploads');
//     },
//     filename: function (req, file, cb) {
//         const fileExt = file.mimetype.match(/jpg|jpeg|png|gif/i);
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
//     }
// });
// const upload = multer({ storage });

// router.post('/upload', upload.single('myFile'), function (req, res) {

//     // req.body will hold the text fields, if there were any 
//     console.log(req.body);
//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     console.log(req.file);

//     res.json({ msg: 'success' });
// });


module.exports = router;
