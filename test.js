const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

(async () => {
  const base64Dot =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP+X8Wc3gAAAABJRU5ErkJggg==";
  // ↑ this is a 1x1 PNG (guaranteed valid)

  const res = await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER_EMAIL,
          Name: "CodeFusion Test"
        },
        To: [
          {
            Email: "238w1a1266@vrsec.ac.in",
            Name: "Test User"
          }
        ],
        Subject: "INLINE IMAGE TEST",
        HTMLPart: `
          <h3>If you see a small dot below, inline images WORK</h3>
          <img src="cid:testimg" />
        `,
        InlineAttachments: [
          {
            ContentType: "image/png",
            Filename: "dot.png",
            Base64Content: base64Dot,
            ContentID: "testimg"
          }
        ]
      }
    ]
  });

  console.log("Mail sent", res.body.Messages[0].Status);
})();
