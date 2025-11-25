const express = require('express');
const shortenedModel = require('./models/shortened');
const app = express();
const connectDB = require('./config/db');

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:url',async (req,res)=>{
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

app.post('/shorten',(req,res)=>{
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