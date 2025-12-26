const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

const sendRegistrationEmail = async ({
  toEmail,
  toName,
  registrationId,
  teamName,
}) => {
  const sentFrom = new Sender(
    process.env.SENDER_EMAIL,
    process.env.SENDER_NAME
  );

  const recipients = [
    new Recipient(toEmail, toName),
  ];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif;">
      <h2>🎉 Team Registration Successful!</h2>
      <p>Dear <strong>${toName}</strong>,</p>

      <p>Your team <strong>${teamName}</strong> has been successfully registered for
      <strong>RD Conclave – CodeFusion 2025</strong>.</p>

      <p><strong>Registration ID:</strong> <span style="color:#6b21a8;">${registrationId}</span></p>

      <p>Please keep this ID for future reference.</p>

      <br/>
      <p>Best Regards,<br/>
      <strong>RD Conclave Team</strong></p>
    </div>
  `;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("RD Conclave 2025 – Registration Confirmed")
    .setHtml(htmlContent)
    .setText(
      `Your team ${teamName} is registered successfully. Registration ID: ${registrationId}`
    );

  await mailerSend.email.send(emailParams);
};

module.exports = sendRegistrationEmail;
