const userModel = require('../models/user')


async function register(req,res) {
    try {
        const {firstname,Lastname,email} = req.body;
        const isalready = await userModel.findOne({email: email})
        if(isalready){
            return res.status(409).json({error:"Email already exist"})
        }
        const newuser = new userModel({firstname,Lastname,email});
        await newuser.save();
        res.send("User created successfully");
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

module.exports = {
    register,
    login
}
