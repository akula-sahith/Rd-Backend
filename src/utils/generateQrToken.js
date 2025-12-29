const jwt = require("jsonwebtoken");

const QR_SECRET = process.env.QR_SECRET;

exports.generateQrToken = (participantId) => {
  return jwt.sign(
    { participantId },
    QR_SECRET,
    { expiresIn: "3d" } // event duration
  );
};
