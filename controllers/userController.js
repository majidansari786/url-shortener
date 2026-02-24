const pgdb = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transport = require("../config/mail");
const { nanoid } = require("nanoid");

async function sendOtp(userEmail, otp) {
  await transport.sendMail({
    from: process.env.GMAIL,
    to: userEmail,
    subject: "Email verification code: "+ otp,
    text: "Welcome Sir!" + otp,
    html: "<h1>Otp: !</h1>" + otp,
  });
  console.log('Otp sent.')
}

async function register(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedpass = await bcrypt.hash(password, 10);
    const query = `insert into users (firstname,lastname,email,password,otp)
        values($1,$2,$3,$4,$5)
        RETURNING id, firstname, lastname, email
        `;
    const otpn = nanoid(5);
    const values = [firstname, lastname, email, hashedpass,otpn];
    const { rows } = await pgdb.query(query, values);
    const user = rows[0];
    const payload = { id: user.id, email: user.email };
    const refreshToken = jwt.sign(payload, process.env.Refresh_secret_key, {
      expiresIn: "7d",
    });
    sendOtp(email,otpn);
    const uquery = `update users set refreshToken=$1 where email=$2`;
    const row1 = await pgdb.query(uquery, [refreshToken, user.email]);
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ sucess: "User created successfully", user: rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
}

async function verifyOtp(req,res) {
  try {
    const {email,otp} = req.body;
    const query = `SELECT id, firstname, lastname, email, otp FROM users WHERE email = $1`;
    const { rows } = await pgdb.query(query, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({err:"User not found"});
    }

    if (user.otp === otp) {
      const q1 = `UPDATE users SET status = $1 WHERE email = $2 RETURNING id, firstname`;
      const { rows: updatedRows } = await pgdb.query(q1, ["VERIFIED", email]);
      return res.status(200).json({success:"Successfully verified"});
    } else {
      return res.status(404).json({err:"Invalid OTP"});
    }
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
  }
}



async function login(req, res) {
  try {
    const { email, password } = req.body;
    const query = `select * from users where email = $1`;
    const { rows } = await pgdb.query(query, [email]);
    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = rows[0];
    if(user.status=='UNVERIFIED'){
      return res.status(404).json({error:"User is not verified"})
    }
    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.Access_secret_key, {
      expiresIn: "4h",
    });
    const refreshToken = jwt.sign(payload, process.env.Refresh_secret_key, {
      expiresIn: "7d",
    });
    const q2 = `update users set refreshToken=$1 where email=$2`;
    const row1 = await pgdb.query(q2, [refreshToken, user.email]);
    res
      .cookie("userAccessToken", accessToken, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: "User login successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function forgetpass(req, res) {
  try {
    const { email, newpass } = req.body;
    if (!email || !newpass)
      res.json({ Error: "email and new password not provided" }).status(401);
    const query = `update users set password = $1 where email = $2 RETURNING id, firstname, lastname, email`;
    const hashedpass = await bcrypt.hash(newpass, 10);
    const values = [hashedpass, email];
    const { rows } = await pgdb.query(query, [hashedpass, email]);
    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    return res.status(200).json({
      success: "Password reset successful",
    });
  } catch (err) {
    return res.json(err);
  }
}

module.exports = {
  register,
  login,
  forgetpass,
  verifyOtp
};
