const nodemail = require('nodemailer')
require('dotenv').config();

const transport = nodemail.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GPASS
    }
})

module.exports=transport;