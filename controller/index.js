const router = require('express').Router();
const htmlRoutes = require('./htmlRoutes')
const uploadRoutes = require('./uploadRoutes')

router.use('/api', uploadRoutes)
router.use('/', htmlRoutes)

module.exports = router;