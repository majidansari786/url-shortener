const userModel = require('../models/user')


async function register(req,res) {
    try {
        const {firstname,Lastname,email,password} = req.body;
        const isalready = await userModel.findOne({email: email})
        if(isalready){
            return res.status(409).json({error:"Email already exist"})
        }
        const newuser = new userModel({firstname,Lastname,email,password});
        await newuser.save();
        return res.send("User created successfully");
        }catch(err){
            res.status(500).send("Server error");
        }
}

async function login(req,res) {
    try {
        const {firstname,Lastname,email} = req.body;
        const finduser = await userModel.findOne({email: email});
        if(!finduser){
            return res.status(404).json({error: "Not found"});
        }
        return res.status(200).json({success:"User login successful"})
    }catch(err){
        return res.json({error: err})
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
