const express = require('express')
const router = express.Router()
const shortnerController = require("../controllers/shortnerController")

router.post('/shorten',shortnerController.shorten)
router.get("/:url",shortnerController.urlredirect)

module.exports = router;