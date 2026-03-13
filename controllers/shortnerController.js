const QRCode = require("qrcode");
const { nanoid } = require("nanoid");
const pgdb = require("../config/db");
const bcrypt = require("bcrypt");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

async function urlredirect(req, res) {
  try {
    const { code } = req.params;
    const password = req.body?.password;

    const geo = geoip.lookup(req.ip);
    const parser = new UAParser(req.headers["user-agent"]);

    const query = `
      UPDATE shorten
      SET visitors = visitors + 1
      WHERE shortcode = $1
      RETURNING original, pass
    `;

    const { rows } = await pgdb.query(query, [code]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    const insertClick = `
      INSERT INTO clicks
      (short_code, ip_address, country, browser, device, os, referrer)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id
    `;

    await pgdb.query(insertClick, [
      code,
      req.ip,
      geo?.country || "Unknown",
      parser.getBrowser().name,
      parser.getDevice().type || "desktop",
      parser.getOS().name,
      req.get("Referrer") || "direct",
    ]);

    const { original, pass } = rows[0];

    if (pass) {
      const matching = await bcrypt.compare(password, pass);

      if (!matching) {
        return res
          .status(403)
          .json({ error: "Password not correct or not provided" });
      }

      return res.json({ url: original });
    }

    return res.redirect(original);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function shorten(req, res) {
  try {
    const { url, custom_short, email, password } = req.body;
    if (!password) {
      const shortenedUrl = custom_short || nanoid(5);
      const query = `insert into shorten(original,shortcode,created_by) values($1,$2,$3) RETURNING id,original,shortcode,created_by`;
      const { rows } = await pgdb.query(query, [url, shortenedUrl, email]);
      return res.json({
        shortenedUrl,
      });
    } else {
      try {
        const { url, custom_short, email, password } = req.body;
        const hashedpass = await bcrypt.hash(password, 10);
        const shortenedUrl = custom_short || nanoid(5);
        const query = `insert into shorten(original,shortcode,created_by,pass) values($1,$2,$3,$4) RETURNING id,original,shortcode,created_by`;
        const { rows } = await pgdb.query(query, [
          url,
          shortenedUrl,
          email,
          hashedpass,
        ]);
        return res.json({
          shortenedUrl,
        });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
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

async function bulk_shorten(req, res) {
  const { url } = req.body;
}

module.exports = {
  urlredirect,
  shorten,
  qrgen,
};
