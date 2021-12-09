const router = require('express').Router()

/**
 * handlebars hompage
 */
router.get('/', async (req, res) => res.render('upload-form'));


module.exports = router