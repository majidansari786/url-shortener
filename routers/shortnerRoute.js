const express = require('express')
const router = express.Router()
const shortnerController = require("../controllers/shortnerController")
const auth = require('../middleware/auth')
const validateShorten=require('../middleware/validateShorten')
const validateRequest = require('../middleware/validateRequest')

router.post('/shorten',auth,validateShorten,validateRequest,shortnerController.shorten)
router.post('/shortenwgen',auth,shortnerController.qrgen)
router.get("/:url",shortnerController.urlredirect)

module.exports = router;