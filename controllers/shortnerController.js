const shortenedModel = require('../models/shortened')
const QRCode = require('qrcode');
const { nanoid } = require('nanoid');
const pgdb = require('../config/db')

async function urlredirect(req, res) {
  try {
    const { code } = req.params;
    const query = `
      UPDATE shorten
      SET visitors = visitors + 1
      WHERE shortcode = $1
      RETURNING original
    `;

    const { rows } = await pgdb.query(query, [code]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    return res.redirect(rows[0].original);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}


async function shorten(req, res) {
  try {
    const { url, email } = req.body;
    const shortenedUrl = nanoid(5);
    const query =  `insert into shorten(original,shortcode,created_by) values($1,$2,$3) RETURNING id,original,shortcode,created_by`
    const {rows}=await pgdb.query(query,[url,shortenedUrl,email])
    return res.json({
      shortenedUrl
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