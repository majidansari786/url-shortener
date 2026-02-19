const jwt = require('jsonwebtoken')
require('dotenv').config();

async function auth(req,res,next) {
    const accessToken = req.cookies.userAccessToken
    const refreshToken = req.cookies.refreshToken

    if(!accessToken){
        if(!refreshToken){
            res.status(400).json({error:"No token provided"})
        }
        try{
            const decode = jwt.verify(accessToken,process.env.Refresh_secret_key)
            req.user=decode
            const payload = { id: user._id, email: user.email };
            const accessToken = jwt.sign(payload, process.env.Access_secret_key, { expiresIn: "4h" });
            res
            .cookie("userAccessToken", accessToken, {
            httpOnly: true,
            secure: false, // set true in production with HTTPS
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({ success: "User login successful" });
            next();
        }catch(err){
            res.status(500).json({error:"An error occured try again later"})
        }
    }
    try{
        const decode = jwt.verify(accessToken,process.env.Access_secret_key)
        req.user=decode
        next();
    }catch(err){
        res.status(500).json({error:"An error occured try again later"})
    }
}

module.exports = auth;