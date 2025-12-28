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
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Registration Confirmed</title>
  </head>

  <body style="margin:0; padding:0; background-color:#f3f4f6; font-family:Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6; padding:20px;">
      <tr>
        <td align="center">
          <!-- Main Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#6b21a8,#9333ea); padding:24px; text-align:center; color:#ffffff;">
                <h1 style="margin:0; font-size:22px;">RD Conclave 2026</h1>
                <p style="margin:6px 0 0; font-size:14px;">CodeFusion Hackathon</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px; color:#1f2937;">
                <h2 style="margin-top:0; font-size:20px;">🎉 Registration Successful</h2>

                <p style="font-size:15px; line-height:1.6;">
                  Dear <strong>${toName}</strong>,
                </p>

                <p style="font-size:15px; line-height:1.6;">
                  We’re excited to inform you that your team
                  <strong>${teamName}</strong> has been successfully registered for
                  <strong>RD Conclave – CodeFusion 2026</strong>.
                </p>

                <!-- Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin:20px 0;">
                  <tr>
                    <td style="font-size:14px;">
                      <p style="margin:6px 0;"><strong>🆔 Registration ID:</strong> <span style="color:#6b21a8;">${registrationId}</span></p>
                      <p style="margin:6px 0;"><strong>👥 Team Name:</strong> ${teamName}</p>
                      <p style="margin:6px 0;"><strong>👤 Team Size:</strong> ${teamSize}</p>
                    </td>
                  </tr>
                </table>

                <!-- Members -->
                <p style="font-size:15px; margin-bottom:8px;"><strong>Team Members</strong></p>
                <ul style="padding-left:20px; margin-top:6px; font-size:14px;">
                  ${members.map(m => `<li style="margin-bottom:4px;">${m}</li>`).join("")}
                </ul>

                <!-- Preliminary Round Notice -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff; border-left:4px solid #6b21a8; border-radius:6px; padding:16px; margin:22px 0;">
                  <tr>
                    <td style="font-size:14px; color:#1f2937;">
                      <strong>📌 Preliminary Shortlisting</strong>
                      <p style="margin:8px 0 0; line-height:1.6;">
                        All registered teams will undergo a <strong>preliminary evaluation round</strong>.
                        Based on this round, shortlisted teams will be notified via email with
                        further instructions and event details.
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- WhatsApp Group Join -->
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#ecfeff; border-left:4px solid #06b6d4; border-radius:6px; padding:16px; margin:22px 0;">
  <tr>
    <td style="font-size:14px; color:#0f172a;">
      <strong>📢 Official WhatsApp Updates Group</strong>
      <p style="margin:8px 0 12px; line-height:1.6;">
        All important announcements, shortlisting updates, and event instructions
        will be shared through our official WhatsApp group.
      </p>

      <a href="https://chat.whatsapp.com/DKmbsq2lYmQ2UgZVorHxOG"
         target="_blank"
         style="
           display:inline-block;
           background:#06b6d4;
           color:#ffffff;
           text-decoration:none;
           padding:10px 18px;
           border-radius:6px;
           font-size:14px;
           font-weight:bold;
         ">
        👉 Join WhatsApp Group
      </a>

      <p style="margin-top:10px; font-size:12px; color:#475569;">
        *Only registered team members should join this group.
      </p>
    </td>
  </tr>
</table>


                <p style="font-size:14px; line-height:1.6;">
                  Kindly keep this email for future reference. Make sure to follow
                  official communications for updates regarding shortlisting,
                  reporting time, and event guidelines.
                </p>

                <p style="font-size:14px; margin-top:28px;">
                  Best Regards,<br />
                  <strong>RD Conclave Organizing Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb; padding:14px; text-align:center; font-size:12px; color:#6b7280;">
                © 2026 RD Conclave • Siddhartha Academy of Higher Education
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
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
            Subject: "RD Conclave 2026 Codefusion – Registration Confirmed",
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
