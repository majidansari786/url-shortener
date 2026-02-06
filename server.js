const express = require('express');
const shortenedModel = require('./models/shortened');
const app = express();
const connectDB = require('./config/db');
const { default: mongoose } = require('mongoose');
const userModel = require('./models/user');

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.send("URL SHORTNER API")
})

app.post('/signup', async (req,res)=>{
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
})

app.get('/login',async (req,res)=>{
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
})

app.get('/:url', async (req,res)=>{
    try{
        const { url } = req.params;
        const findurl = await shortenedModel.findOne({Shortened: "http://localhost:3000/" + url});
        if(!findurl){
            return res.status(404).send('URL not found');
        }
        const originalUrl = findurl.original;
        return res.redirect(originalUrl);
    }catch(err){
        return res.status(500).send('Server error');
    }
});

app.post('/shorten', async (req,res)=>{
    const url = req.body.url;
    
    const shortenedUrl = "http://localhost:3000/" + Math.random().toString(36).substring(7); 
    const newshortened = new shortenedModel({
        original: url,
        Shortened: shortenedUrl
    });
    newshortened.save();
    return res.json({shortenedUrl: shortenedUrl});
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});