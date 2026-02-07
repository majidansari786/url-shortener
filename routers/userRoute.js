const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")

router.post('/signup',userController.register)
router.get('/login',userController.login)
router.post('/fp',userController.forgetpass)
module.exports = router;