const QRCode = require("qrcode");
const { nanoid } = require("nanoid");
const pgdb = require("../config/db");
const bcrypt = require("bcrypt");
const UAParser = require("ua-parser-js");
const geoip = require("geoip-lite");

const { shortenCounter, redirectCounter } = require("../metrics");

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
      redirectCounter.inc(); // optional: count failed
      return res.status(404).json({ error: "Short URL not found" });
    }

    await pgdb.query(
      `INSERT INTO clicks
      (short_code, ip_address, country, browser, device, os, referrer)
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        code,
        req.ip,
        geo?.country || "Unknown",
        parser.getBrowser().name,
        parser.getDevice().type || "desktop",
        parser.getOS().name,
        req.get("Referrer") || "direct",
      ]
    );

    const { original, pass } = rows[0];

    if (pass) {
      const matching = await bcrypt.compare(password, pass);

      if (!matching) {
        redirectCounter.inc(); // failed attempt
        return res
          .status(403)
          .json({ error: "Password not correct or not provided" });
      }

      redirectCounter.inc(); // success
      return res.json({ url: original });
    }

    redirectCounter.inc(); // success
    return res.redirect(original);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function shorten(req, res) {
  try {
    const { url, custom_short, email, password } = req.body;
    const userEmail = email || "null@majid.com"
    const shortenedUrl = custom_short || nanoid(5);

    if (!password) {
      await pgdb.query(
        `insert into shorten(original,shortcode,created_by) values($1,$2,$3)`,
        [url, shortenedUrl, userEmail]
      );

      shortenCounter.inc();
      return res.json({ shortenedUrl });
    }

    const hashedpass = await bcrypt.hash(password, 10);

    await pgdb.query(
      `insert into shorten(original,shortcode,created_by,pass) values($1,$2,$3,$4)`,
      [url, shortenedUrl, userEmail, hashedpass]
    );

    shortenCounter.inc();
    return res.json({ shortenedUrl });

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
  qrgen,
};