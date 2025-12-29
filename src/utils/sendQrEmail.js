const Mailjet = require("node-mailjet");
const QRCode = require("qrcode");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const sendQrEmail = async ({
  toEmail,
  toName,
  finalTeamId,
  teamName,
  participants
}) => {
  const attachments = [];

  for (const p of participants) {
    // Generate QR in memory
    const dataUrl = await QRCode.toDataURL(p.qrToken);

    // Extract base64
    const base64 = dataUrl.split(",")[1];

    attachments.push({
  ContentType: "image/png",
  Filename: `${p.participantId}_${p.name.replace(/\s+/g, "-")}.png`,
  Base64Content: base64
});

  }

  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER_EMAIL,
          Name: process.env.MAILJET_SENDER_NAME
        },
        To: [
          {
            Email: toEmail,
            Name: toName
          }
        ],
        Subject: "CodeFusion Hackathon – Your QR Codes",
        HTMLPart: `
  <h2>🎟 CodeFusion Hackathon – QR Codes</h2>

  <p>Dear <b>${toName}</b>,</p>

  <p>
    Please find attached the official QR codes for your team
    <b>${teamName}</b>.
  </p>

  <p><b>Final Team ID:</b> ${finalTeamId}</p>

  <h3>👥 Participant – QR Mapping</h3>
  <ul>
    ${participants.map(p =>
      `<li><b>${p.name}</b> → ${p.participantId}</li>`
    ).join("")}
  </ul>

  <p>
    📌 Each attached QR file name matches the participant shown above.
    Please distribute them accordingly.
  </p>

  <p>
    Regards,<br/>
    <b>RD Conclave – CodeFusion Team</b>
  </p>
`
,
        Attachments: attachments
      }
    ]
  });
};

module.exports = sendQrEmail;
