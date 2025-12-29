// const QRCode = require("qrcode");
// const fs = require("fs");
// const path = require("path");

// // folder to store QRs
// const QR_DIR = path.join(__dirname, "..", "qr-storage");

// // ensure folder exists
// if (!fs.existsSync(QR_DIR)) {
//   fs.mkdirSync(QR_DIR);
// }

// const generateQrImage = async (qrToken, participantId) => {
//   try {
//     // local file path
//     const filePath = path.join(QR_DIR, `${participantId}.png`);

//     // generate & store QR as PNG
//     await QRCode.toFile(filePath, qrToken, {
//       width: 300,
//       margin: 2
//     });

//     // OPTIONAL: also return base64 if needed later
//     const base64 = await QRCode.toDataURL(qrToken);

//     return base64;      // for future email usage

//   } catch (err) {
//     console.error("QR generation failed:", err);
//     throw err;
//   }
// };

// module.exports = generateQrImage;
