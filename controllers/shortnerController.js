const shortenedModel = require('../models/shortened')
const QRCode = require('qrcode');

async function urlredirect(req,res) {
    try{
        const { url } = req.params;
        const findurl = await shortenedModel.findOne({Shortened: "http://localhost:3000/api/url/" + url});
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
        const createdby = req.body.email;
        if(!createdby){
            const shortenedUrl = "http://localhost:3000/api/url/" + Math.random().toString(36).substring(7); 
            const newshortened = new shortenedModel({
                original: url,
                Shortened: shortenedUrl
            });
            newshortened.save();
        }
        const shortenedUrl = "http://localhost:3000/api/url/" + Math.random().toString(36).substring(7); 
        const newshortened = new shortenedModel({
            original: url,
            Shortened: shortenedUrl,
            createdby: createdby
        });
        newshortened.save();
        return res.json({shortenedUrl: shortenedUrl});
    }catch(err){
        return res.status(500).json({error: err})
    }
}

async function qrgen(req, res) {
    try {
        const { url } = req.body;
        const qrcode = await QRCode.toDataURL(url, { type: "image/png" });
        return res.json({ qrcode });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}


module.exports = {
    urlredirect,
    shorten,
    qrgen
}