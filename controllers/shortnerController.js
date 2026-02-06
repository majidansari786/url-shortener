const shortenedModel = require('../models/shortened')

async function urlredirect(req,res) {
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
}

async function shorten(req,res) {
    try{
        const url = req.body.url;
        const shortenedUrl = "http://localhost:3000/" + Math.random().toString(36).substring(7); 
        const newshortened = new shortenedModel({
            original: url,
            Shortened: shortenedUrl
        });
        newshortened.save();
        return res.json({shortenedUrl: shortenedUrl});
    }catch(err){
        return res.status(500).json({error: err})
    }
}

module.exports = {
    urlredirect,
    shorten
}