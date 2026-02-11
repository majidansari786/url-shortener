const shortenedModel = require('../models/shortened')
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');

async function urlredirect(req,res) {
    try{
        const { url } = req.params;
        const findurl = await shortenedModel.findOne({Shortened: url});
        if(!findurl){
            return res.status(404).send('URL not found');
        }
        if (findurl.expiresAt && findurl.expiresAt < new Date()) {
            return res.status(410).send("This URL has expired");
        }
        await shortenedModel.findOneAndUpdate( { Shortened: url }, { $inc: { visiters: 1 } } );
        return res.redirect(findurl.original);
    }catch(err){
        console.error('Redirect error:', err);
        return res.status(500).send('Server error: ' + err.message);
    }
}

async function shorten(req, res) {
  try {
    const { url, email: createdby, expiresAt } = req.body;

    const shortenedUrl = nanoid(5);
    const newshortened = new shortenedModel({
      original: url,
      Shortened: shortenedUrl,
      createdby: createdby || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });
    await newshortened.save();
    return res.json({
      shortenedUrl,
      expiresAt: newshortened.expiresAt
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
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