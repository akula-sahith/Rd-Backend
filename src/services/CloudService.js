const cloudinary = require("../config/cloudinary");
const QRCode = require("qrcode");
const fs = require("fs");

/* -------------------- */
/* Upload payment image */
/* -------------------- */
const uploadPaymentProof = async (file, teamName) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: `CFRD/${teamName}/payments`
  });

  fs.unlinkSync(file.path); // cleanup local file
  return result.secure_url;
};

/* -------------------- */
/* Upload QR image      */
/* -------------------- */
const uploadQrToCloudinary = async (qrToken, teamName, participantId) => {
  const buffer = await QRCode.toBuffer(qrToken, {
  width: 300
});


  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `CFRD/${teamName}/qrs`,
        public_id: participantId,
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};

module.exports = {
  uploadPaymentProof,
  uploadQrToCloudinary
};
