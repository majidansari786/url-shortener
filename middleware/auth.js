const jwt = require('jsonwebtoken')
require('dotenv').config();

async function auth(req,res,next) {
    const accessToken = req.cookies.userAccessToken
    if(!accessToken){
        res.status(401).json({message:'No token provided'})
    }
    try{
        const decode = jwt.verify(accessToken,process.env.Access_secret_key)
        req.user=decode
        next();
    }catch(err){
        console.log(err)
    }
}

module.exports = auth;