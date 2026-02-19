const rateLimit = require('express-rate-limit')
const { isWindows } = require('nodemon/lib/utils')

const limiter = rateLimit({
    limit: 200,
    windowMs:60*60*1000,
    message:"Too many request try again later",
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports=limiter;