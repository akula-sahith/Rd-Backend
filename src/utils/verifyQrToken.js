const jwt = require("jsonwebtoken");

const verifyQrToken = (qrToken) => {
  try {
    return jwt.verify(qrToken, process.env.QR_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = verifyQrToken;
