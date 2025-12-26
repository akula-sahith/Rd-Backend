const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

const sendRegistrationEmail = async ({
  toEmail,
  toName,
  registrationId,
  teamName,
  teamSize,
  members, // array of member names
}) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>🎉 Team Registration Successful!</h2>
        <p>Dear <strong>${toName}</strong>,</p>

        <p>Your team <strong>${teamName}</strong> has been successfully registered for
        <strong>RD Conclave – CodeFusion 2025</strong>.</p>

        <p>
          <strong>Registration ID:</strong>
          <span style="color:#6b21a8;">${registrationId}</span>
        </p>

        <p><strong>Team Size:</strong> ${teamSize}</p>
        <p><strong>Team Members:</strong></p>
        <ul>
          ${members.map(m => `<li>${m}</li>`).join("")}
        </ul>

        <br/>
        <p>Best Regards,<br/>
        <strong>RD Conclave Team</strong></p>
      </div>
    `;

    const response = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER_EMAIL,
              Name: process.env.MAILJET_SENDER_NAME,
            },
            To: [
              {
                Email: toEmail,
                Name: toName,
              },
            ],
            Subject: "RD Conclave 2025 – Registration Confirmed",
            HTMLPart: htmlContent,
            TextPart: `
Team ${teamName} registered successfully.
Registration ID: ${registrationId}
Team Size: ${teamSize}
Members: ${members.join(", ")}
            `,
          },
        ],
      });

    const status = response.body.Messages[0].Status;

    if (status === "success") {
      console.log("✅ Email sent successfully");
      console.log("📩 Team Leader:", toName, `<${toEmail}>`);
      console.log("🆔 Registration ID:", registrationId);
      console.log("👥 Team Name:", teamName);
      console.log("👤 Team Size:", teamSize);
      console.log("👥 Members:");
      members.forEach((m, i) => {
        console.log(`   ${i + 1}. ${m}`);
      });
    } else {
      console.error("❌ Email sending failed");
      console.error(response.body.Messages[0]);
    }

    return response.body;

  } catch (error) {
    console.error("❌ Mailjet Error while sending email");
    console.error("Status Code:", error.statusCode);
    console.error("Error:", error.message);
    console.error("Details:", error.response?.data);
    throw error;
  }
};

module.exports = sendRegistrationEmail;
