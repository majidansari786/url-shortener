const userModel = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function register(req,res) {
    try {
        const {firstname,Lastname,email,password} = req.body;
        const isalready = await userModel.findOne({email: email})
        if(isalready){
            return res.status(409).json({error:"Email already exist"})
        }
        const hashedpass = await bcrypt.hash(password,10)
        const newuser = new userModel({
            firstname: firstname,
            Lastname: Lastname,
            email: email,
            password: hashedpass
        });
        await newuser.save();
        return res.send("User created successfully");
        }catch(err){
            res.status(500).send("Server error");
            console.log(err)
        }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const finduser = await userModel.findOne({ email });

    if (!finduser) {
      return res.status(404).json({ error: "User not found" });
    }

    const matching = await bcrypt.compare(password, finduser.password);
    if (!matching) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = { id: finduser._id, email: finduser.email };

    const accessToken = jwt.sign(payload, process.env.Access_secret_key, { expiresIn: "4h" });
    const refreshToken = jwt.sign(payload, process.env.Refresh_secret_key, { expiresIn: "7d" });

    res
      .cookie("userAccessToken", accessToken, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: "User login successful" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


async function forgetpass(req,res){
    try{
        const {email, newpass} = req.body;
        const findemail = await userModel.findOneAndUpdate(
            {email: email},
            {$set:{password: newpass}},
            {new: true}
        );
        if(!findemail){
            return res.status(404).json({error:"Email not found"});
        }
        return res.status(200).json({success:"Password reset successfull"})
    }catch(err){
        return res.json(err);
    }
}

module.exports = {
    register,
    login,
    forgetpass
}
