const jwt = require("jsonwebtoken");
require("dotenv").config();
const pgdb = require("../config/db");

async function auth(req, res, next) {
  const accessToken = req.cookies.userAccessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    if (!refreshToken) {
      return res.status(400).json({ error: "No token provided" });
    }
    try {
      const query = `select * from users where refreshToken=$1`;
      const { rows } = await pgdb.query(query, [refreshToken]);
      if (rows.length === 0) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
      const user = rows[0];
      const decode = jwt.verify(refreshToken, process.env.Refresh_secret_key);
      const payload = { id: user.id, email: user.email };
      const newAccessToken = jwt.sign(payload, process.env.Access_secret_key, {
        expiresIn: "4h",
      });
      res.cookie("userAccessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      req.user = decode;
      return next();
    } catch (err) {
      res.status(500).json({ error: "An error occured try again later" });
    }
  }
  try {
    const decode = jwt.verify(accessToken, process.env.Access_secret_key);
    req.user = decode;
    next();
  } catch (err) {
    return res.status(500).json({ error: "An error occured try again later" });
  }
}

module.exports = auth;
